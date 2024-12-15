import React, { useState } from 'react';
import logo from "../assets/logo.svg";
import arrow from "../assets/arrow_icon.svg";
import { useNavigate, useOutletContext } from "react-router-dom";

function Navbar() {
    const { isLogggedIn, setIsLoggedIn, baseUrl, alert } = useOutletContext();
    const navigate = useNavigate();

    const navigateLogin = () => {
        navigate("/login")
    }

    // logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    }

    // send otp for email verification
    const handleVerifyEmail = () => {
        try {
            fetch(`${baseUrl}/sendotp`, {
                method: "POST",
                headers: {
                    authorization: localStorage.getItem("token")
                },
            })
                .then((res) => {
                    res.json().then((data) => {
                        alert(data.message);
                        if (data.success) {
                            navigate("/verify-email");
                        }
                    })
                })
                .catch((err) => {
                    alert(err.messsage);
                })
        } catch (error) {
            alert(error.messsage);
        }
    }

    return (
        <div className='navbar'>
            <img src={logo} alt="logo" />
            {isLogggedIn ?
                <div className='user-profile'>
                    <p>H</p>
                    <ul>
                        <li onClick={handleVerifyEmail}>Verify Email</li>
                        <li onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
                :
                <button onClick={navigateLogin} className='login-btn-home'>Login <img src={arrow} alt="arrow" /></button>
            }
        </div>
    )
}

export default Navbar