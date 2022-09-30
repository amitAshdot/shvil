import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REM_ALERT } from './alertTypes';


export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: REM_ALERT, payload: id }), timeout);
}

export const removeAlert = id => dispatch => {

    dispatch({
        type: REM_ALERT,
        payload: id
    });
}

// Compare this snippet from client/src/store/alert/alertReducer.js:
