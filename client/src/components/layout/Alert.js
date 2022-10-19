import React from 'react'
// import { connect } from 'react-redux'
import { setAlert, removeAlert } from '../../store/alert/alertAction';
import { useSelector, useDispatch } from 'react-redux';
const Alert = () => {
    const dispatch = useDispatch();
    const alertStat = useSelector(state => state.alert);
    return (
        alertStat.length > 0 ?
            <div className="alert-container">
                {alertStat.length > 0 && alertStat.map(alert => (
                    <div key={alert.id} className={`alert alert-${alert.alertType}`} onClick={() => dispatch(removeAlert(alert.id))}>
                        <span className="closebtn" >&times;</span>
                        {alert.msg}
                    </div>
                ))}
            </div>
            :
            null
    )
}

export default Alert