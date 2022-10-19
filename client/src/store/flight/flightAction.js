import {
    GET_FLIGHTS,
    GET_FLIGHT,
    ADD_FLIGHT,
    EDIT_FLIGHT,
    DELETE_FLIGHT,
    FLIGHT_ERROR,
    CLEAR_FLIGHT,
    ADD_FILES,
    GET_PDF_NAMES,
    LOADING_START,
    DONE_UPLOADING,
    START_UPLOADING
} from './flightTypes';
import axios from 'axios';
import { setAlert } from '../alert/alertAction';

import { xml2json, json2xml } from "xml-js";

import allTripInfoMock from '../../mock/allTripInfoMock.js'
window.Buffer = window.Buffer || require("buffer").Buffer;


export const getFlights = () => async dispatch => {
    try {
        dispatch({
            type: LOADING_START
        })
        const res = await axios.get('/api/flight');

        dispatch({
            type: GET_FLIGHTS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FLIGHT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getFlight = id => async dispatch => {
    try {
        dispatch({
            type: LOADING_START
        })
        const res = await axios.get(`/api/flight/${id}`);
        dispatch({
            type: GET_FLIGHT,
            payload: res.data
        });
        return res.data;
    } catch (err) {
        dispatch({
            type: FLIGHT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const addFlight = (currentState, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token
        }
    };
    try {
        dispatch({
            type: START_UPLOADING
        })
        dispatch({
            type: LOADING_START
        })
        const resExist = await dispatch(getFlight(currentState._id));
        if (resExist) {
            dispatch(setAlert('החופשה קיימת, כנס/י לעמוד עריכה', 'danger'));
            return;
        }
        //console files from form data
        // FILES
        const filesPath = await dispatch(uploadFiles(formData))//upload files to server

        if (filesPath) {
            currentState.pdfName = filesPath.filesNames;
            currentState.pdfFiles = filesPath.pdfFiles;
        }
        currentState.folderName = formData.get('folderName');

        //get names of pdf files
        const res = await axios.post('api/files/pdf-names', currentState, config);
        currentState.passengers = res.data.data;
        currentState.pathToReport = res.data.pathToReport;

        // KAV
        //*****const kavData = await getKavDataByTripNumber(currentState.tripNumber);

        //check related passengers
        //****const tempListOfPassengers = crossInformationBetweenKavAndUser(kavData, currentState.passengers);

        //send mail to user
        //****await sendUserMail(currentState);

        const addFlightRes = await axios.post('/api/flight', currentState, config);

        if (filesPath.pdfFiles)
            addFlightRes.data.pdfFiles = filesPath.pdfFiles;

        if (filesPath.filesNames)
            addFlightRes.data.pdfName = filesPath.filesNames;
        await dispatch({
            type: ADD_FLIGHT,
            payload: addFlightRes.data
        });
        await dispatch(setAlert('Flight Created', 'success'));

        await dispatch({
            type: DONE_UPLOADING,
        });

        await dispatch({
            type: CLEAR_FLIGHT
        });

    } catch (err) {
        const errors = err.response.msg;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error, 'danger')));
        }
        dispatch({
            type: FLIGHT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const deleteFlight = id => async dispatch => {
    try {
        await axios.delete(`/api/flight/${id}`);
        dispatch({
            type: DELETE_FLIGHT,
            payload: id
        });
        dispatch(setAlert('Flight Removed', 'success'));
    } catch (err) {
        dispatch({
            type: FLIGHT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const editFlight = (currentState, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token
        }
    };
    try {
        dispatch({
            type: LOADING_START
        })
        //check if flight exist
        let resExist = await dispatch(getFlight(currentState._id));
        if (!resExist) {
            dispatch(setAlert('לא נמצאה חופשה - אנא בדוק/י את מספר החופשה', 'danger'));
            return;
        }

        // const res = await axios.put(`/api/flight/${resExist._id}`, resExist, config);
        // await dispatch(uploadFiles(formData))

        const filesPath = await dispatch(uploadFiles(formData))//upload files to server
        if (filesPath) {
            currentState.pdfName = [...filesPath.filesNames, ...resExist.pdfName];
            currentState.pdfFiles = [...filesPath.pdfFiles, ...resExist.pdfFiles];
        }
        resExist = { ...resExist, ...currentState };

        // const res = await axios.post('/api/flight', currentState, config);
        const res = await axios.put(`/api/flight/${resExist._id}`, resExist, config);

        dispatch({
            type: EDIT_FLIGHT,
            payload: res.data
        });

        dispatch(setAlert('Flight Created', 'success'));
    } catch (err) {
        const errors = err.response.data.msg;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error, 'danger')));
        }
        dispatch({
            type: FLIGHT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const clearFlight = () => dispatch => {
    dispatch({ type: CLEAR_FLIGHT });
}

export const uploadFiles = formData => async dispatch => {
    try {
        dispatch({
            type: LOADING_START
        })
        const config = {
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(percentCompleted);
            },
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.token
            }
        };

        debugger
        const res = await axios.post(`/api/files`, formData, config);
        let responseData = res.data.data;
        let finaleData = { pdfFiles: [], filesNames: [] };

        if (responseData.constructor === Array) {
            responseData.forEach(data => {
                finaleData.pdfFiles.push(data.uploadPath);
                let fileName = data.uploadPath.split('/');
                finaleData.filesNames.push(fileName[fileName.length - 1]);
            });
        } else {
            finaleData.pdfFiles.push(responseData);
            let fileName = responseData.split('/');
            finaleData.filesNames.push(fileName[fileName.length - 1]);
        }

        await dispatch({
            type: ADD_FILES,
            payload: finaleData
        });
        await dispatch(setAlert('Files Uploaded', 'success'));
        return finaleData;
    }
    catch (err) {
        console.log(err)
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: FLIGHT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getNameFromPdf = (pdfFiles) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token
        }
    };
    const body = { pdfFiles }
    try {
        dispatch({
            type: LOADING_START
        })
        const res = await axios.get(`/api/files/pdf-names`, body, config);
        dispatch({
            type: GET_PDF_NAMES,
            payload: res.data.data
        });

        return res.data;
    } catch (err) {
        console.log(err)

    }
}

export const downloadReport = (folderPath) => async dispatch => {
    console.log('here!!!')
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token
        }
    };
    const body = {}
    // const body = { folderPath }
    try {
        dispatch({
            type: LOADING_START
        })

        const res = await axios.get(`/api/files/report`, { responseType: 'blob' }, config);

        const data = window.URL.createObjectURL(res.data);


        const url = window.URL
            .createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // const blob = await res.blob();
        // download(blob, "test.pdf");
        // dispatch({
        //     type: DOWNLOAD_REPORT,
        //     payload: res.data.data
        // });
        return res.data;
    } catch (err) {
        console.log(err)
    }
}

//---helpers---
const setJsonToXml = async (json) => {
    return json2xml(json, {
        compact: true
    });
}
const setXmlToJson = async (xmlString) => {
    const xml = xml2json(xmlString, {
        compact: true
    });
    return JSON.parse(xml);
}

const getKavDataByTripNumber = async (tripNumber) => {
    const config = {
        headers: {
            'Content-Type': 'text/xml,charset=utf-8',
            'X-API-Key': '71b9632c5f53496faec51878a49c1bfd'
        }
    };
    const xlmBody = `<Root>
	<Header>
		<Protocol>CAV</Protocol>
		<Version>1.00</Version>
		<EtopsID>LLH-------</EtopsID>
		<Password>-------</Password>
		<UserId>-------</UserId>
	</Header>
	<Body>
		<Command>PAX.DETAILS.REQ</Command>
		<Id>${tripNumber}</Id>
	</Body>
</Root>`

    // const body = {}

    const res = await fetch(`http://localhost:5000/api/flight/${tripNumber}`, xlmBody, config);

    return res.data;
}

// export const getFlights = () => async dispatch => {

const crossInformationBetweenKavAndUser = async (kavData, userFlightData) => {
    if (!kavData) return userFlightData;
    if (!userFlightData) return kavData;

    let kavDataCopy = JSON.parse(JSON.stringify(kavData));
    let userFlightDataCopy = JSON.parse(JSON.stringify(userFlightData));


}


const sendUserMail = async (user) => {
    const { email, name, tripNumber } = user;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': '71b9632c5f53496faec51878a49c1bfd'
        }
    };

    const body = `{
        "message": {
            "html": "Hello world",
            "subject": "My subject",
            "from_email": "SenderEmail@YourDomain.com",
            "from_name": "Your Company Name",
            "to": [
                {
                    "email": "${email}",
                    "name": "${name}",
                    "type": "to"
                }
            ]
        }
    }`

    const res = fetch('https://api.inwise.com:443/rest/v1/v1', body, config);
    return res.data;
}
