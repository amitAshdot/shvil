import React, { useState, useEffect } from 'react'
import folderImage from '../../assets/img/folder.webp'
// import Moment from 'react-moment';
// import moment from "moment";

const AddTrip = () => {
    useEffect(() => {


        return () => {
            // cleanup
        }
    }, [])

    const [tripState, setTripState] = useState({
        tripNumber: '',
        tripDate: '',
        files: [],
        filesNames: [],
        msg: '',
        error: ''
    })
    const { tripNumber, tripDate, filesNames } = tripState
    //change input state
    const onChange = e => { setTripState({ ...tripState, [e.target.name]: e.target.value }); }

    const handleFiles = (e) => {
        let filesNames = [], files = e.target.files
        Array.from(e.target.files).forEach(file => {
            console.log(file)
            filesNames.push(file.name)
        })
        setTripState({
            ...tripState,
            filesNames,
            files
        })
    }
    const filesToShow = filesNames.map((file, index) => {
        return <li key={index} className="files-file">{file}</li>
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        let currentTripState = { ...tripState }
        // delete currentTripState.msg

    }

    return (
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

                    <div className="input-container">
                        <input onChange={onChange} className='input form__field' id="tripDate" name="tripDate" type="date" value={tripDate} placeholder="תאריך טיול" />
                        {/* <label htmlFor="email" className="label-name">תאריך טיול"</label> */}
                    </div>
                    {/* loop of pdf files upload */}

                    <input type="submit" value="Submit" />

                    <div className="files-status">
                        {filesNames.length > 0 ? <ul>{filesToShow}</ul> : null}
                    </div>
                </div>
                <div className="left">
                    {/* <DropZone onDrop={handleFiles} accept="application/pdf" multiple /> */}
                    <img src="https://thumbs.dreamstime.com/b/drag-drop-symbol-concept-icon-flat-isolated-eps-illustration-minimal-modern-design-96340345.jpg" alt="img" width={150} height={150} />
                    <div className="text">
                        <p className='drag'>גרור לפה</p>
                        <p className='or'>או</p>
                        <input onChange={handleFiles} type="file" name="file" id="file" className="inputfile" multiple="multiple" title="" />
                    </div>

                </div>
                {tripState.msg ? <p>{tripState.msg}</p> : null}
                {tripState.error ? <p>{tripState.error}</p> : null}
            </form>
        </div>
    )
}

export default AddTrip