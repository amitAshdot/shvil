import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom'
import logo1 from '../../assets/img/logo1.webp'
import logo2 from '../../assets/img/logo2.webp'

const Navbar = () => {
    const authState = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch({ type: 'LOGOUT' });
    }

    useEffect(() => {
    }, [authState.isAuthenticated])

    // const isActive = //
    const authLinks = (
        <ul className="navbar__links">
            <li >
                <NavLink to='/' className="navbar__link">בית</NavLink>
            </li>
            <li >
                <NavLink to='/landing' className="navbar__link" >היסטוריית פעולות</NavLink>
            </li>
            <li >
                <NavLink to='/login' onClick={onLogout} className="navbar__link">התנתק</NavLink>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul className="navbar__links">
            <li >
                <NavLink to='/login' className="navbar__link">התחבר</NavLink>
            </li>
        </ul>
    );
    return (
        <nav className="navbar bg-dark">
            {!authState.loading && (<>{authState.isAuthenticated ? authLinks : guestLinks}</>)}

            <h1 className="navbar__logo">
                {/* <NavLink to="/"> */}
                <img className='logo' src={logo1} alt="logo1" />
                <img className='logo' src={logo2} alt="logo2" />
                {/* </NavLink> */}
                {/* <a href="index.html"><i className="fas fa-code"></i> DevConnector</a> */}
            </h1>
        </nav>

    )
}

export default Navbar