import React, { useState } from 'react';
import userImage from "../assets/person_icon.svg";
import Email from "../assets/mail_icon.svg";
import lock from "../assets/lock_icon.svg";
import logo from "../assets/logo.svg";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Loader from './Loader';


function SignUp() {
    const { alert, baseUrl, loading, setLoading } = useOutletContext();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // signup function
    const handleSignUp = () => {
        if (name && email && password) {
            try {
                setLoading(true);
                fetch(`${baseUrl}/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, password })
                })
                    .then((res) => {
                        res.json().then((data) => {
                            setLoading(false)
                            alert(data.message)
                            if (data.success) {
                                setName('');
                                setEmail('');
                                setPassword('');
                                navigate("/login")
                            }
                        })
                    })
                    .catch((err) => console.log(err))
            } catch (error) {
                console.log(error)
            }
        }
        else {
            alert("name, email and password is required")
        }
    }


    return (
        <>
            <div className='logo'>
                <img src={logo} alt="logo" />
            </div>
            <section className='signup-wrapper'>
                <div className='signup-container'>
                    <h1>Create Account</h1>
                    <p>Create your account</p>
                    <div className='input-box'>
                        <img width={12} src={userImage} alt="user-image" />
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Full Name' />
                    </div>
                    <div className='input-box'>
                        <img width={12} src={Email} alt="user-image" />
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email' />
                    </div>
                    <div className='input-box'>
                        <img width={12} src={lock} alt="user-image" />
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' />
                    </div>
                    <p id='forgot-pass'>Forgot password?</p>
                    <button onClick={handleSignUp} className='sign-up-btn'>{loading ? <Loader /> : "Sign Up"}</button>
                    <p>Already have an account? <Link id='login-path' to='/login'>Login here</Link></p>
                </div>
            </section>
        </>
    )
}

export default SignUp