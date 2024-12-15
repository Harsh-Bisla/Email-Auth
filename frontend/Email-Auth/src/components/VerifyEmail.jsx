import React, { useRef, useState } from 'react';
import logo from "../assets/logo.svg";
import { useNavigate, useOutletContext } from "react-router-dom";
import Loader from "../components/Loader"

function VerifyEmail() {

    const navigate = useNavigate();
    const { baseUrl, alert, loading, setLoading } = useOutletContext();
    const inputRefs = useRef([]);

    // function for handle the one number in one input
    const handleInput = (e, idx) => {
        if (e.target.value.length > 0 && idx < inputRefs.current.length - 1) {
            inputRefs.current[idx + 1].focus();
        }
    }

    // function for backspace key for removing the number
    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && e.target.value === "" && idx > 0) {
            inputRefs.current[idx - 1].focus();
        }
    }

    // function for submitting the otp
    const handleSubmitOtp = () => {
        const otpArray = inputRefs.current.map(e => e.value)
        const otp = otpArray.join('');
        console.log(otp)
        try {
            setLoading(true);
            fetch(`${baseUrl}/verifyotp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("token")
                },
                body: JSON.stringify({ otp: otp })
            })
                .then((res) => {
                    res.json().then((data) => {
                        setLoading(false);
                        alert(data.message);
                        if (data.success) {
                            navigate("/");
                        }
                    })
                })
                .catch((err) => {
                    alert(err.message);
                })
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <>
            <div className='logo'>
                <img src={logo} alt="logo" />
            </div>
            <section className='signup-wrapper'>
                <div className='signup-container verification'>
                    <h1>Email verify OTP</h1>
                    <p>Enter 6-digit code sent to your email id</p>
                    <div className='otp-box'>
                        {Array(6).fill(0).map((_, idx) => {
                            return (
                                <input key={idx} ref={e => inputRefs.current[idx] = e}
                                    onInput={(e) => handleInput(e, idx)}
                                    onKeyDown={(e) => handleKeyDown(e, idx)}
                                    className='otp-input' type="text" />
                            )
                        })}
                    </div>
                    <button onClick={handleSubmitOtp} className='verif-email-btn'>{loading ? <Loader /> : "Verify Email"}</button>
                </div>
            </section>
        </>
    )
}

export default VerifyEmail