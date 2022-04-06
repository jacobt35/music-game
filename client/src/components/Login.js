import React from 'react';
import Button from 'react-bootstrap/Button'
import '../CSS/Login.css'

function Login() {

    // initialize local storage for stats

    return (
        <div className="login">
            <div className='login-btn'>
                <Button variant='dark' size='lg' href="/auth/login">Login with Spotify!</Button>
            </div>
        </div>
    );
}

export default Login;
