import React, { useState, useEffect } from 'react'
import folderImage from '../../assets/img/folder.webp'
// import Moment from 'react-moment';
// import moment from "moment";
import Dropzone from 'react-dropzone'
import XInsideSolidCircle from '../icons/XInsideSolidCircle.js'
import PlusInCircle from '../icons/PlusInCircle.js'
import { useDispatch, useSelector } from 'react-redux'
import { addFlight, uploadFiles, downloadReport } from '../../store/flight/flightAction'
// import PdfTest from '../layout/PdfTest'
import moment from 'moment';
import { Navigate } from 'react-router-dom';
import UploadingAnimation from '../layout/UploadingAnimation'
import Alert from '../layout/Alert'
const AddTrip = () => {

    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const flightState = useSelector(state => state.flight);
    const alertState = useSelector(state => state.alert);
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

    useEffect(() => {
        if (flightState.doneUpload) {
            setTripState({
                tripNumber: '',
                tripDate: (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1),
                pdfFiles: [],
                filesNames: [],
                folderName: '',
                msg: '',
                error: '',
                dateFormatted: '',
                uploadEnd: false
            })
        }
    }, [flightState.doneUpload, tzoffset, dispatch])

    useEffect(() => {
        if (flightState.startUpload) {
            setTripState({
                tripNumber: '',
                tripDate: (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1),
                pdfFiles: [],
                filesNames: [],
                folderName: '',
                msg: '',
                error: '',
                dateFormatted: '',
                uploadEnd: false,
                startUpload: true
            })
        }
    }, [flightState.startUpload, tzoffset, dispatch])
    const [tripState, setTripState] = useState({
        tripNumber: '',
        tripDate: (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1),
        pdfFiles: [],
        filesNames: [],
        folderName: '',
        msg: '',
        error: '',
        dateFormatted: '',
        uploadEnd: false
    })
    const { tripNumber, tripDate, filesNames, pdfFiles, dateFormatted, folderName } = tripState
    //change input state
    const onChange = e => { setTripState({ ...tripState, [e.target.name]: e.target.value }); }

    const filesToShow = filesNames ? filesNames.map((file, index) => {
        return <li key={index} className="files-file">{file}</li>
    }) : null;

    const handleReset = () => {
        setTripState({
            tripNumber: '',
            tripDate: '',
            pdfFiles: [],
            filesNames: [],
            folderName: '',
            msg: '',
            error: '',
            dateFormatted: '',
            uploadEnd: false
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('tripNumber', tripNumber);
        formData.append('tripDate', tripDate);
        formData.append('folderName', folderName.length > 0 ? folderName : new Date().getTime());
        if (pdfFiles) {
            pdfFiles.forEach(pdfFile => {
                formData.append('pdfFiles', pdfFile);
            })
        }
        formData.append('filesNames', filesNames);
        let currentTripState = { ...tripState }
        // dispatch(uploadFiles(formData))
        // do stuff - get passenger names from pdf files, get trip api from Kav system, save to db
        dispatch(addFlight(currentTripState, formData))
    }

    const onDrop = (newPdfFiles) => {
        Array.from(pdfFiles).forEach(file => {
            console.log(file)
            filesNames.push(file.name)
        })
        let newPdfState = [...pdfFiles, ...newPdfFiles]
        // const newPdfNames = [...filesNames, ...newPdfFiles.map(file => file.name)]

        newPdfState = newPdfState.reduce((accumulator, current) => {
            if (!accumulator.some((item) => item.name === current.name))
                accumulator.push(current);
            return accumulator;
        }, []);
        const concatFileNames = [...filesNames, ...newPdfFiles.map(file => file.name)]
        const newFilesNames = [...new Set(concatFileNames)];

        setTripState({
            ...tripState,
            filesNames: newFilesNames,
            pdfFiles: newPdfState
        })
    }

    if (!authState.isAuthenticated) {
        return <Navigate to='/login' />
    }
    // if (flightState.startUpload) {
    //     return <UploadingAnimation />
    // }
    return (
        <div className="add-trip-container">
            <form onSubmit={onSubmit}>
                <div className="right">
                    <UploadingAnimation startUpload={flightState.startUpload} />
                    <div className="input-container">
                        <input onChange={onChange} className='input form__field' id="tripNumber" name="tripNumber" type="text" value={tripNumber} />
                        <label htmlFor="email" className="label-name"> מספר טיול</label>
                    </div>

                    {/* <div className="input-container">
                        <input onChange={onChange} className='input form__field' id="tripDate" name="tripDate" type="datetime-local" value={dateFormatted[0]} placeholder="תאריך טיול" />
                        <label htmlFor="email" className="label-name">תאריך טיול"</label>
                    </div> */}
                    {/* loop of pdf files upload */}

                    <input type="submit" value="שליחה" className='btn btn-secondary' />

                    <div className="reset-files" onClick={handleReset}>נקה נתונים</div>

                    <div className="files-status">
                        {filesToShow.length > 0 ? <ul>{filesToShow}</ul> : null}
                    </div>
                </div>
                {/* <DropZone onDrop={handleFiles} accept="application/pdf" multiple /> */}

                <Dropzone onDrop={onDrop} accept={{ 'application/pdf': ['.pdf'] }} multiple >
                    {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                        <div {...getRootProps()} className="left">
                            {!isDragActive && <img src="https://thumbs.dreamstime.com/b/drag-drop-symbol-concept-icon-flat-isolated-eps-illustration-minimal-modern-design-96340345.jpg" alt="img" width={150} height={150} />}
                            {isDragActive && !isDragReject && <PlusInCircle className={'upload-form'} />}
                            {isDragReject && <XInsideSolidCircle className={'upload-form'} />}
                            <input {...getInputProps()} />
                            {!isDragActive &&
                                <div className="text">
                                    <p className='drag'>הוספ/י קבצים לפה</p>
                                    <p className='or'>או</p>
                                    <p className='click'>לחץ/י להעלאה</p>
                                    {/* <input onChange={handleFiles} type="file" name="file" id="file" className="inputfile" multiple="multiple" title="" /> */}
                                </div>}
                            {isDragActive && !isDragReject && "אפשר לשחרר כאן"}
                            {isDragReject && "טעות בקובץ"}
                        </div>
                    )}
                </Dropzone>

                {/* {tripState.msg ? <p>{tripState.msg}</p> : null} */}
                {/* {tripState.error ? <p>{tripState.error}</p> : null} */}
                <Alert />
            </form>
        </div>
    )
}

export default AddTrip