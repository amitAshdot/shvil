import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <div className="landing">
            <div className="add">
                <Link to="/add-vacation" className="btn btn-primary">
                    <p>
                        הוספת טיסה
                    </p>
                    <span>הוספת טיסה חדשה למערכת</span>
                </Link>
            </div>
            <section className="container">
                <h1 className="large text-primary">רשימת טיסות</h1>

            </section>
        </div>
    )
}

export default Landing