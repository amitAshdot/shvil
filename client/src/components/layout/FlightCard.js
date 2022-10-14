import React from 'react'
import { Link } from 'react-router-dom'
const FlighCard = (props) => {
  const { index, tripNumber, tripDate, _id } = props
  return (
    <div key={index} className="flight">
      < div className="flight-info" >
        <div className='flight-info__number'>
          <span>טיול מספר:</span>
          <p className='flight-info-text'>{tripNumber}</p>
        </div>
        <div className='flight-info__date'>
          <span>תאריך שינוי:</span>
          <p className='flight-info-text'> {tripDate}</p>
        </div>
      </div>
      <div className="flight-actions">
        <Link to={`/flight/${_id}`} className="btn btn-secondary">
          <p>
            צפייה בפרטים
          </p>
        </Link>
      </div>
    </div>
  )
}

export default FlighCard