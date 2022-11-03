import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { getFlight } from '../../store/flight/flightAction';
import { Navigate } from 'react-router-dom';
// import AddTrip from './AddTrip';
import EditTrip from './EditTrip';
import { downloadReport, setCurrentFlight, formatDate } from '../../store/flight/flightAction';
import Loader from '../layout/Loader';
const Flight = () => {

    const dispatch = useDispatch();
    const flightState = useSelector(state => state.flight);
    const authState = useSelector(state => state.auth);

    const { id } = useParams()

    useEffect(() => {

        const onload = async () => {
            const newStateObject = flightState.flights.find(fligt => fligt._id === id)
            dispatch(setCurrentFlight(newStateObject));
            setTripState({
                ...newStateObject
            })
        }
        onload()
        return () => { }
    }, [dispatch, id, flightState.flights])

    useEffect(() => {
        if (flightState.date) {
            const dateFormatted = formatDate(flightState.tripDate)
            setTripState({
                ...flightState,
                dateFormatted
            })
        }
        return () => { }
    }, [flightState])

    const [tripState, setTripState] = useState({
        tripNumber: '',
        tripDate: '',
        pdfFiles: [],
        pdfName: [],
        msg: '',
        error: '',
        date: '',
        dateFormatted: ''
    })
    const { tripNumber, dateFormatted } = tripState

    if (!authState.isAuthenticated) {
        return <Navigate to='/login' />
    }
    return (
        flightState.loading ? <Loader /> :
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
                            <p className="flight-info-text">{dateFormatted ? dateFormatted[0] : null}</p>
                        </div>


                        <div className="flight-info__time">
                            <span>שעת שינוי:</span>
                            <p className="flight-info-text">{dateFormatted ? dateFormatted[1] : null}</p>
                        </div>
                    </div>
                    <div className="singleFlight-buttons">
                        <p className='btn btn-primary' onClick={() => dispatch(downloadReport(flightState.folderName))}>הורד/י דוח</p>
                    </div>
                </div>
                {tripNumber ? <EditTrip currentTripState={tripState} setCurrentTripState={setTripState} /> : null}
            </div>
    )
}

export default Flight