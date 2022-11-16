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
    LOADING_END,
    DONE_UPLOADING,
    START_UPLOADING
} from './flightTypes';
import axios from 'axios';
import { setAlert } from '../alert/alertAction';
import balanceAnswerMock from '../../mock/balanceAnswerMock.js'
import XMLParser from 'react-xml-parser'
import convert from 'xml-js'
import { xml2json, json2xml } from "xml-js";
window.Buffer = window.Buffer || require("buffer").Buffer;

export const setCurrentFlight = (flight) => async dispatch => {
    try {
        dispatch({
            type: GET_FLIGHT,
            payload: flight
        })
    } catch (err) {
        dispatch({
            type: FLIGHT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

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
        dispatch({ type: START_UPLOADING });
        dispatch({ type: LOADING_START });
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
        const res = await axios.post('api/files/main', currentState, config);
        currentState.passengers = res.data.data;

        //get related passengers 
        // const relatedPassengers = checkForRelatedPassengers(currentState.passengers);

        // KAV
        //*****const kavData = await getKavDataByTripNumber(currentState.tripNumber);
        const kavData = await balanceAnswerMock;
        let kavDataJson = await setXmlToJson(kavData)
        kavDataJson = JSON.parse(kavDataJson) // or if you prefer this notation

        //cross information with Kav system
        const tempListOfPassengers = await crossInformationBetweenKavAndUser(kavDataJson, currentState.passengers);

        //send mail to user
        let mailSent = await axios.post('api/mail', currentState, config);
        currentState.mailSent = mailSent.data.msg
        currentState.passengers = mailSent.data.data;

        //get names of pdf files
        const resnew = await axios.post('api/files/pdf-names', currentState, config);
        currentState.passengers = resnew.data.data;
        currentState.pathToReport = resnew.data.pathToReport;

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
        await dispatch({ type: DONE_UPLOADING, });
        await dispatch({ type: CLEAR_FLIGHT });

    } catch (err) {
        console.log(err);
        const errors = err.response;
        if (errors) {
            // errors.forEach(error => dispatch(setAlert(error, 'danger')));
            await dispatch(setAlert('Flight Not Created', 'danger'));
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

        // FILES
        const filesPath = await dispatch(uploadFiles(formData))//upload files to server
        if (filesPath) {
            currentState.pdfName = [...filesPath.filesNames, ...resExist.pdfName];
            currentState.pdfFiles = [...filesPath.pdfFiles, ...resExist.pdfFiles];
        }

        resExist = { ...resExist, ...currentState };

        //get names of pdf files
        // const resPdfNames = await axios.post('/api/files/pdf-names', resExist, config);
        const resPdfNames = await axios.post('/api/files/main', resExist, config);
        debugger
        resPdfNames.data.data = resPdfNames.data.data.map(passenger => {
            let test = resExist.passengers.find(p => p.name === passenger.name)
            if (test) {
                return test
            }
            else
                return passenger
            // return resExist.passengers.find(p => p.name === passenger.name) ?  resExist.passengers.find(p => p.name === passenger.name) : passenger
        })
        resExist.passengers = resPdfNames.data.data;

        const kavData = await balanceAnswerMock;
        let kavDataJson = await setXmlToJson(kavData)
        kavDataJson = JSON.parse(kavDataJson) // or if you prefer this notation

        //cross information with Kav system
        const tempListOfPassengers = await crossInformationBetweenKavAndUser(kavDataJson, resExist.passengers);

        //send mail to user
        let mailSent = await axios.post('/api/mail', resExist, config);
        resExist.mailSent = mailSent.data.msg
        resExist.passengers = mailSent.data.data;
        debugger
        //get names of pdf files
        const resnew = await axios.post('/api/files/pdf-names', resExist, config);
        resExist.passengers = resnew.data.data;
        resExist.pathToReport = resnew.data.pathToReport;

        const res = await axios.put(`/api/flight/${resExist._id}`, resExist, config);
        // const addFlightRes = await axios.post('/api/flight', currentState, config);

        if (filesPath.pdfFiles)
            res.data.pdfFiles = filesPath.pdfFiles;

        if (filesPath.filesNames)
            res.data.pdfName = filesPath.filesNames;
        await dispatch({
            type: EDIT_FLIGHT,
            payload: res.data
        });
        await dispatch(setAlert('Flight Created', 'success'));
        await dispatch({ type: DONE_UPLOADING, });
        await dispatch({ type: CLEAR_FLIGHT });



        // // currentState.passengers = [...resPdfNames.data.data, ...resExist.passengers];
        // currentState.pathToReport = resPdfNames.data.pathToReport;
        // // const res = await axios.post('/api/flight', currentState, config);
        // const res = await axios.put(`/api/flight/${resExist._id}`, resExist, config);

        // dispatch({
        //     type: EDIT_FLIGHT,
        //     payload: res.data
        // });

        // dispatch(setAlert('Flight Created', 'success'));
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
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token
        }
    };
    const body = {
        folderPath: `./routes/api/${folderPath}/report.xls`
    }
    try {
        dispatch({
            type: LOADING_START
        })
        const res = await axios.post(`/api/files/report`, body, { responseType: 'blob' }, config);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch(setAlert('Report Downloaded', 'success'));
        dispatch({ type: LOADING_END })
        return res.data;
    } catch (err) {
        console.log(err)
    }
}

//---helpers---

// const checkForRelatedPassengers = (passengers, flightId) => {
// }


// const setJsonToXml = async (json) => {
//     return json2xml(json, {
//         compact: true
//     });
// }

const setXmlToJson = async (xml) => {
    return xml2json(xml, {
        compact: true
    });
}

// const getKavDataByTripNumber = async (tripID) => {
//     const userID = 400512;
//     const Password = 400512;
//     const apiKey = '71b9632c5f53496faec51878a49c1bfd'
//     const config = {
//         headers: {
//             'Content-Type': 'text/xml,charset=utf-8',
//             'X-API-Key': `${apiKey}`
//         }
//     };
//     const xlmBody = `
//         <Root>
//             <Header>
//                 <Protocol>CAV</Protocol>
//                 <Version>1.00</Version>
//                 <EtopsID>LLH400512</EtopsID>
//                 <Password>${Password}</Password>
//                 <UserId>${userID}</UserId>
//             </Header>
//             <Body>
//                 <Command>PAX.TRLIST</Command>
//                 <Tour ID="${tripID}"></Tour>
//             </Body>
//         </Root>`

//     // const body = {}

//     const res = await fetch(`http://localhost:5000/api/flight/${tripID}`, xlmBody, config);

//     return res.data;
// }


const crossInformationBetweenKavAndUser = async (kavData, userFlightData) => {
    if (!kavData) return userFlightData;
    if (!userFlightData) return kavData;
    debugger
    let kavDataCopy = JSON.parse(JSON.stringify(kavData));
    let userFlightDataCopy = JSON.parse(JSON.stringify(userFlightData));

    for (let i = 0; i < userFlightData.length; i++) {
        const element = userFlightData[i];
        console.log('element::::', element)
        let tt = kavDataCopy.Root.Body.DocketList.Docket.map(docket => {
            if (element.name.toUpperCase().trim() == `${docket.Paxes.Pax.FirstName._text} ${docket.Paxes.Pax.LastName._text}`.toUpperCase().trim()) {
                element['kavData'] = docket;
                element['isPaid'] = docket.Balance.Currency.Difference > 0 ? false : true;
                if (docket.Paxes.Pax.Email._text)
                    element['email'] = docket.Paxes.Pax.Email._text
            }
            return element;
        })

    }
    return userFlightData
}


// const sendUserMail = async (user) => {
//     const { email, name, tripNumber } = user;
//     const config = {
//         headers: {
//             'Content-Type': 'application/json',
//             'X-API-Key': '71b9632c5f53496faec51878a49c1bfd'
//         }
//     };

//     const body = `{
//         "message": {
//             "html": "Hello world",
//             "subject": "My subject",
//             "from_email": "SenderEmail@YourDomain.com",
//             "from_name": "Your Company Name",
//             "to": [
//                 {
//                     "email": "${email}",
//                     "name": "${name}",
//                     "type": "to"
//                 }
//             ]
//         }
//     }`

//     const res = fetch('https://api.inwise.com:443/rest/v1/v1', body, config);
//     return res.data;
// }


export const formatDate = (fullDate) => {
    if (fullDate) {
        const date = fullDate.slice(0, 10)
        const time = fullDate.slice(11, 16)
        const dateFormatted = [date.split('-').reverse().join('-'), time]
        return dateFormatted
    }
}



