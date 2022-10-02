import React, { useEffect, useState } from 'react'
import { login } from '../../../store/auth/authAction';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../../layout/Alert';

const Login = () => {
    const dispatch = useDispatch();
    // const alertStat = useSelector(state => state.alert);
    const authState = useSelector(state => state.auth);
    useEffect(() => {
        // }, [authState.isAuthenticated]);
    }, []);

    const [auth, setAuth] = useState({
        email: '',
        password: ''
    });

    const onChange = e => {
        // 
        e.target.setAttribute('value', e.target.value);
        setAuth({ ...auth, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ ...auth }));
    }

    if (authState.isAuthenticated) {
        return <Navigate to='/landing' />
    } else
        return (
            <div className="login">
                <Alert />
                <form >
                    <div className="input-container">
                        <input onChange={onChange} type="text" name='email' id="email" className='input email' ></input>
                        <label htmlFor="email" className="label-name" >שם משתמש</label>
                    </div>
                    <div className="input-container">
                        <input onChange={onChange} type="password" name='password' id="password" className='input password' />
                        <label htmlFor="password" className="label-name" >סיסמה</label>
                    </div>
                    <p className='submit' onClick={handleSubmit} >התחבר</p>
                </form>
            </div>
        )
}

export default Login
// export default connect()(Login) 