import { combineReducers } from "redux";
import authReducer from '../store/auth/authReducer';
import alertReducer from '../store/alert/alertReducer';


export default combineReducers({
    auth: authReducer,
    alert: alertReducer,
    // profile: profileReducer,
    // post: postReducer

});
