import React, { useState, useEffect } from 'react'
import folderImage from '../../assets/img/folder.webp'
// import Moment from 'react-moment';
// import moment from "moment";
import Dropzone from 'react-dropzone'
import XInsideSolidCircle from '../icons/XInsideSolidCircle.js'
import PlusInCircle from '../icons/PlusInCircle.js'
import { useDispatch, useSelector } from 'react-redux'
import { editFlight } from '../../store/flight/flightAction'
// import PdfTest from '../layout/PdfTest'
import { Navigate } from 'react-router-dom';
import Loader from '../layout/Loader'

const EditTrip = (props) => {

  const dispatch = useDispatch();
  // const flightState = useSelector(state => state.flight);
  const authState = useSelector(state => state.auth);
  const flightState = useSelector(state => state.flight);

  useEffect(() => {

    if (props) {
      if (props.currentTripState) {
        if (props.currentTripState.tripNumber) {
          setTripState({
            ...props.currentTripState
          })
        }
      }
    }
    return () => {
      // cleanup
    }
  }, [props])

  // var tzoffset = (new Date()).getTimezoneOffset() * 7200000; //offset in milliseconds
  var tzoffset = (new Date(0)).getTimezoneOffset() - 7200000; //offset in milliseconds

  const [tripState, setTripState] = useState({
    tripNumber: '',
    tripDate: '',
    pdfFiles: [],
    pdfName: [],
    folderName: '',
    msg: '',
    error: '',
    dateFormatted: ''
  })
  const { tripNumber, tripDate, pdfName, pdfFiles, folderName } = tripState

  const filesToShow = tripState?.pdfName?.length > 0 ? tripState.pdfName.map((file, index) => {
    return <li key={index} className="files-file">{file}</li>
  }) : null;

  //change input state

  const onChange = e => { setTripState({ ...tripState, [e.target.name]: e.target.value }); }

  const handleReset = () => {
    setTripState({
      tripNumber: '',
      tripDate: '',
      pdfFiles: [],
      pdfName: [],
      folderName: '',
      msg: '',
      error: ''
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('tripNumber', tripNumber);
    formData.append('tripDate', tripDate);
    if (folderName?.length > 0)
      formData.append('folderName', folderName.length > 0 ? folderName : new Date().getTime());
    if (pdfFiles) {
      pdfFiles.forEach(pdfFile => {
        formData.append('pdfFiles', pdfFile);
      })
    }
    formData.append('pdfName', pdfName);
    debugger
    let currentTripState = {
      ...tripState, tripDate: (new Date(Date.now() - tzoffset)).toISOString()
    }
    dispatch(editFlight(currentTripState, formData))
  }

  const onDrop = (newPdfFiles) => {

    const newPdfState = [...new Set([...pdfFiles, ...newPdfFiles])]; //   => remove duplication
    const newPdfNames = [...new Set([...pdfName, ...newPdfFiles.map(file => file.name)])]

    setTripState({
      ...tripState,
      pdfName: newPdfNames,
      pdfFiles: newPdfState
    })
  }


  if (!authState.isAuthenticated) {
    return <Navigate to='/login' />
  }
  return (
    flightState.loading ? <Loader /> :

      <div className="add-trip-container">
        <form onSubmit={onSubmit}>
          <div className="right">
            <picture>
              <source media="(max-width: 1025px)" srcSet={folderImage} defer width="110" height="42" />
              <img defer src={folderImage} alt="לוגו" title="לוגו" className="logo" width="320" height="236.812" />
            </picture>
            <div className="input-container">
              <input onChange={onChange} className='input form__field' id="tripNumber" name="tripNumber" type="text" value={tripNumber} />
              <label htmlFor="email" className="label-name"> מספר טיול</label>
            </div>
            <input type="submit" value="שליחה" className='btn btn-secondary' />

            <div className="reset-files" onClick={handleReset}>נקה נתונים</div>

            <div className="files-status">
              {filesToShow?.length > 0 ? <ul>{filesToShow.reverse()}</ul> : null}
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
                  </div>}
                {isDragActive && !isDragReject && "אפשר לשחרר כאן"}
                {isDragReject && "טעות בקובץ"}
              </div>
            )}
          </Dropzone>

          {/* {tripState.msg ? <p>{tripState.msg}</p> : null} */}
          {/* {tripState.error ? <p>{tripState.error}</p> : null} */}
        </form>
      </div>
  )
}

export default EditTrip