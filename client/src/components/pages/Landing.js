import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getFlights } from '../../store/flight/flightAction'
import { Navigate } from 'react-router-dom';

window.Buffer = window.Buffer || require("buffer").Buffer;

const Landing = () => {
    const dispatch = useDispatch();
    const flightState = useSelector(state => state.flight);
    const authState = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getFlights())
        return () => {
            // cleanup
        }
    }, [dispatch])

    const [tripState, setTripState] = useState({
        tripNumber: '',
        tripDate: '',
        searchInput: '',
        pdfFiles: [],
        filesNames: [],
        searchArr: [],
        msg: '',
        error: ''
    })
    const { tripNumber, tripDate, filesNames, pdfFiles, searchInput, searchArr } = tripState

    const isFlights = flightState.flights ? flightState.flights.length > 0 ? true : false : null

    const onSearch = (e) => {
        debugger
        const searchArr = flightState.flights.filter(flight => flight.tripNumber.includes(e.target.value.toUpperCase()))
        setTripState({
            ...tripState,
            searchArr,
            searchInput: e.target.value
        })
    }

    if (!authState.isAuthenticated) {
        return <Navigate to='/login' />
    }
    return (
        <div className="landing">
            <section className="container">
                <h1 className="large text-primary">רשימת טיולים</h1>
                <div className="input-container landing__input">
                    <input className='input form__field' type="text" name='search' id="search" onChange={onSearch} value={searchInput} />
                    <label htmlFor='search' className="label-name">חיפוש מספר טיול</label>
                </div>

                <div className="flights">
                    {isFlights ?
                        searchArr.length > 0 ?
                            searchArr.map((flight, index) => {
                                return <div key={index} className="flight">
                                    < div className="flight-info" >
                                        <div className='flight-info__number'>
                                            <span>טיול מספר:</span>
                                            <p className='flight-info-text'>{flight.tripNumber}</p>
                                        </div>
                                        <div className='flight-info__date'>
                                            <span>תאריך שינוי:</span>
                                            <p className='flight-info-text'> {flight.tripDate}</p>
                                        </div>
                                    </div>
                                    <div className="flight-actions">
                                        <Link to={`/flight/${flight._id}`} className="btn btn-secondary">
                                            <p>
                                                צפייה בפרטים
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            }
                            )
                            :
                            flightState.flights.map((flight, index) => {
                                return <div key={index} className="flight">
                                    < div className="flight-info" >
                                        <div className='flight-info__number'>
                                            <span>טיול מספר:</span>
                                            <p className='flight-info-text'>{flight.tripNumber}</p>
                                        </div>
                                        <div className='flight-info__date'>
                                            <span>תאריך שינוי:</span>
                                            <p className='flight-info-text'> {flight.tripDate}</p>
                                        </div>
                                    </div>
                                    <div className="flight-actions">
                                        <Link to={`/flight/${flight._id}`} className="btn btn-secondary">
                                            <p>
                                                צפייה בפרטים
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            }
                            )
                        :
                        <h2>אין טיסות</h2>
                    }
                </div>
                {/* <input onChange={onChange} className='input form__field' id="tripNumber" name="tripNumber" type="text" value={tripNumber} />
                <label htmlFor="email" className="label-name"> מספר טיול</label> */}
                {/* <div className="flights">
                    {isFlights ? flightState.flights.map((flight, index) => {
                        return <div key={index} className="flight">
                            <div className="flight-info">
                                <div className='flight-info__number'>
                                    <span>טיול מספר:</span>
                                    <p className='flight-info-text'>{flight.tripNumber}</p>
                                </div>
                                <div className='flight-info__date'>
                                    <span>תאריך שינוי:</span>
                                    <p className='flight-info-text'> {flight.tripDate}</p>
                                </div>
                            </div>
                            <div className="flight-actions">
                                <Link to={`/flight/${flight._id}`} className="btn btn-secondary">
                                    <p>
                                        צפייה בפרטים
                                    </p>
                                </Link>
                            </div>
                        </div>
                    }) : <h2>אין טיסות</h2>} */}
                {/* </div> */}

            </section>
        </div>
    )
}

export default Landing