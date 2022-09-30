import React from 'react'
import notFoundImg from '../../assets/img/404.jpeg'
const NotFound404 = () => {

    const imgStyle = {
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: '-1',
    }
    const mainDivStyle = {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px #000000',
    }
    return (
        <div style={mainDivStyle}>
            <img defer src={notFoundImg} alt="404 - not found" title="404 - not found" className="notFound-bg" style={imgStyle} />
            <h1>איזו שממה...</h1>
        </div>
    )
}

export default NotFound404