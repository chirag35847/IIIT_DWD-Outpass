import React from 'react'
import { Link } from 'react-router-dom'
import SignIn from './loginForm'

export default function LandingPage() {
    return (
        <div className="text-center m-5-auto">
            <h2>Sign in to us</h2>
            <form action="/student">

                    <SignIn/>

            </form>
            <footer>
                <p>First time? <Link to="/register">Create an account</Link>.</p>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )
}

// const HeaderStyle = {
//     width: "100%",
//     height: "100vh",      
//     background: `url(${BackgroundImage})`,
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "cover"
// }