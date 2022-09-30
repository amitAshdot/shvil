import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom'


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
                <NavLink to='/landing' className="navbar__link" >דף הבית</NavLink>
            </li>
            <li >
                <NavLink to='/add-vacation' className="navbar__link">הוסף נופש</NavLink>
            </li>
            <li >
                <NavLink to='/' onClick={onLogout} className="navbar__link">התנתק</NavLink>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul className="navbar__links">
            <li >
                <NavLink to='/' className="navbar__link">התחבר</NavLink>
            </li>
        </ul>
    );
    return (
        <nav className="navbar bg-dark">
            <h1 className="navbar__logo">
                <Link to="/"><i className="fas fa-code"></i> לוגו המערכת</Link>
                {/* <a href="index.html"><i className="fas fa-code"></i> DevConnector</a> */}
            </h1>
            {!authState.loading && (<>{authState.isAuthenticated ? authLinks : guestLinks}</>)}

        </nav>

    )
}

export default Navbar