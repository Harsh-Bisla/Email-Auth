import React, { useRef, useState } from 'react';
import logo from "../assets/logo.svg"
import { useNavigate, useOutletContext } from 'react-router-dom';
import Loader from './Loader';

function ResetPassword() {
    const [isEmaiilSent, setIsEmailSent] = useState(true);
    const [isOtpSent, setiSOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const { baseUrl, alert, loading, setLoading } = useOutletContext();
    const inputRefs = useRef([]);


    const handleInput = (e, idx) => {
        if (e.target.value.length > 0 && idx < inputRefs.current.length - 1) {
            inputRefs.current[idx + 1].focus();
        }
    }
    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && e.target.value === "" && idx > 0) {
            inputRefs.current[idx - 1].focus();
        }
    }

    // function for send the reset password otp
    const handleSendOtp = () => {
        if (!email) {
            alert("Please enter email")
        }
        else {
            try {
                setLoading(true);
                fetch(`${baseUrl}/reset-password-otp`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("token")
                    },
                    body: JSON.stringify({ email: email })
                })
                    .then((res) => {
                        res.json().then((data) => {
                            setLoading(false);
                            alert(data.message);
                            if (data.success) {
                                setIsEmailSent(false)
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
    }

    // function for navigating to reset password page
    const handleSubmitOtp = () => {
        const otpArray = inputRefs.current.map(e => e.value)
        const otp = otpArray.join('');
        setOtp(otp);
        setiSOtpSent(true);
    }

    //methd for resseting the password
    const handleResetPassword = () => {
        console.log(email)
        try {
            fetch(`${baseUrl}/verify-reset-password-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otp: otp, newPassword: newPassword, email: email })
            })
                .then((res) => {
                    res.json().then((data) => {
                        alert(data.message);
                        if (data.success) {
                            navigate("/login");
                        }
                        else {
                            setiSOtpSent(false);
                            setIsEmailSent(false)
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
            {/* email component */}
            {isEmaiilSent && <section className='signup-wrapper'>
                <div className='signup-container verification'>
                    <h1>Reset Password</h1>
                    <p>Enter email id</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className='reset-email-box' type="email" placeholder='Email' />
                    <button onClick={handleSendOtp} className='verif-email-btn'>{loading ? <Loader /> : "Send OTP"}</button>
                </div>
            </section>}

            {/* otp component */}
            {!isEmaiilSent && !isOtpSent && <section className='signup-wrapper'>
                <div className='signup-container verification'>
                    <h1>Password reset OTP</h1>
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
                        <button onClick={handleSubmitOtp} className='verif-email-btn'>{loading ? <Loader /> : "Submit OTP"}</button>
                    </div>
                </div>
            </section>}

            {/* new password component */}
            {!isEmaiilSent && isOtpSent &&
                <section className='signup-wrapper'>
                    <div className='signup-container verification'>
                        <h1>Enter new Password</h1>
                        <p>Enter you new account password</p>
                        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='reset-email-box' type="password" placeholder='Password' />
                        <button onClick={handleResetPassword} className='verif-email-btn'>{loading ? <Loader /> : "Reset Password"}</button>

                    </div>
                </section>}
        </>
    )
}

export default ResetPassword