import React, { useState } from 'react';
import Email from "../assets/mail_icon.svg";
import lock from "../assets/lock_icon.svg";
import logo from "../assets/logo.svg";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Loader from './Loader';


function Login() {
    const navigate = useNavigate();
    const { alert, baseUrl , setIsLoggedIn, loading, setLoading} = useOutletContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (email && password) {
            try {
                setLoading(true);
                fetch(`${baseUrl}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                })
                    .then((res) => {
                        res.json().then((data) => {
                            setLoading(false);
                            localStorage.setItem("token", data.token);
                            alert(data.message);
                            if (data.success) {
                                setEmail("");
                                setPassword("");
                                navigate("/");
                                setIsLoggedIn(true)
                            }
                        })
                    })
                    .catch((err) => {
                        alert(err.message);
                    })
            } catch (error) {
                alert(error.message)
            }
        }
        else {
            alert("email and password is required");
        }
    }
    return (
        <>
            <div className='logo'>
                <img src={logo} alt="logo" />
            </div>
            <section className='login-wrapper'>
                <div className='login-container'>
                    <h1>Login</h1>
                    <p>Login to your account</p>
                    <div className='input-box'>
                        <img width={12} src={Email} alt="user-image" />
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email' />
                    </div>
                    <div className='input-box'>
                        <img width={12} src={lock} alt="user-image" />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' />
                    </div>
                    <p id='forgot-pass'><Link to="/reset-password">Forgot password?</Link></p>
                    <button onClick={handleLogin} className='login-btn'>{loading ? <Loader/> : "Login"}</button>
                    <p>Don't have an  account? <Link id='signup-path' to='/signup'>Sign up</Link></p>
                </div>
            </section>
        </>
    )
}

export default Login