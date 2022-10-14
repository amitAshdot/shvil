import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import FlightCard from '../layout/FlightCard'
import { getFlights } from '../../store/flight/flightAction'
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
    const { searchInput, searchArr } = tripState

    const isFlights = flightState.flights ? flightState.flights.length > 0 ? true : false : null

    const onSearch = (e) => {

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
                                return <FlightCard key={index} index={index} tripNumber={flight.tripNumber} tripDate={flight.tripDate} _id={flight._id} />
                            }
                            )
                            :
                            flightState.flights.map((flight, index) => {
                                return <FlightCard key={index} index={index} tripNumber={flight.tripNumber} tripDate={flight.tripDate} _id={flight._id} />
                            }
                            )
                        :
                        <h2>אין טיסות</h2>
                    }
                </div>
            </section>
        </div>
    )
}

export default Landing