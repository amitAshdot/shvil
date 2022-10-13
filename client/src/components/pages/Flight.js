import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFlight } from '../../store/flight/flightAction';
import { Navigate } from 'react-router-dom';
import AddTrip from './AddTrip';

const Flight = (props) => {

    const dispatch = useDispatch();
    const flightState = useSelector(state => state.flight);
    const authState = useSelector(state => state.auth);

    const { id } = useParams()

    useEffect(() => {
        const onload = () => {
            const currentFlight = dispatch(getFlight(id))
            const newStateObject = {
                tripNumber: currentFlight.tripNumber,
                tripDate: currentFlight.tripDate,
                pdfFiles: currentFlight.pdfFiles,
                filesNames: currentFlight.filesNames,
                msg: '',
                error: '',
                date: currentFlight.date,
                dateFormatted: ''
            }
            setTripState({
                ...newStateObject
            })
        }
        onload()
        return () => { }
    }, [dispatch, id])

    useEffect(() => {
        debugger
        if (flightState.date) {
            let dateFormatted = date.replace('T', ' ').slice(0, 16)
            dateFormatted = dateFormatted.split(' ')

            setTripState({
                ...flightState,
                dateFormatted: dateFormatted
            })
        } else {
            setTripState({
                ...flightState,
            })
        }
        return () => { }
    }, [flightState])


    const [tripState, setTripState] = useState({
        tripNumber: '',
        tripDate: '',
        pdfFiles: [],
        filesNames: [],
        msg: '',
        error: '',
        date: '',
        dateFormatted: ''
    })
    const { tripNumber, tripDate, filesNames, date, dateFormatted } = tripState

    if (!authState.isAuthenticated) {
        return <Navigate to='/login' />
    }
    return (
        <div className='singleFlight'>
            <div className="singleFlight-flightInfo">
                <h1>טיסה מספר {tripNumber}</h1>
            </div>

            <div className="flight">
                <div className="flight-info">
                    <div className="flight-info__number">
                        <span>טיול מספר:</span>
                        <p className="flight-info-text">{tripNumber}</p>
                    </div>
                    <div className="flight-info__date">
                        <span>תאריך שינוי:</span>
                        <p className="flight-info-text">{dateFormatted[0]}</p>
                    </div>


                    <div className="flight-info__time">
                        <span>שעת שינוי:</span>
                        <p className="flight-info-text">{dateFormatted[1]}</p>
                    </div>
                </div>
            </div>
            <div className="singleFlight-files">
                <h2>רשימת קבצים</h2>
                <div className="singleFlight-files-list">
                    {filesNames.length > 0 ? filesNames.map((file, index) => {
                        return <div key={index} className="singleFlight-file">
                            <p>{file}</p>
                        </div>
                    }) : <p>אין קבצים</p>}
                </div>

            </div>

            {
                tripNumber ? <AddTrip currentTripState={tripState} setCurrentTripState={setTripState} /> : null}
        </div>
    )
}

export default Flight