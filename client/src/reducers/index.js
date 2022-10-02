import { combineReducers } from "redux";
import authReducer from '../store/auth/authReducer';
import alertReducer from '../store/alert/alertReducer';
// import vacationReducer from '../store/vacation/vacationReducer';
import FlightReducer from '../store/flight/flightReducer';

export default combineReducers({
    auth: authReducer,
    alert: alertReducer,
    flight: FlightReducer,
    // profile: profileReducer,
    // post: postReducer

});
