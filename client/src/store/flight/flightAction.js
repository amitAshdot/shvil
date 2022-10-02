import {
    GET_FLIGHTS,
    GET_FLIGHT,
    ADD_FLIGHT,
    DELETE_FLIGHT,
    FLIGHT_ERROR,
    CLEAR_FLIGHT
} from './flightTypes';
import axios from 'axios';
import { setAlert } from '../alert/alertAction';


export const getFlights = () => async dispatch => {
    try {
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
        const res = await axios.get(`/api/flight/${id}`);
        dispatch({
            type: GET_FLIGHT,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FLIGHT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const addFlight = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token
        }
    };
    try {
        debugger
        const res = await axios.post('/api/flight', formData, config);
        dispatch({
            type: ADD_FLIGHT,
            payload: res.data
        });
        dispatch(setAlert('Flight Created', 'success'));
    } catch (err) {
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

export const clearFlight = () => dispatch => {
    dispatch({ type: CLEAR_FLIGHT });
}