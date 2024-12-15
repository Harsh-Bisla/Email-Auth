import React, { useEffect, useState } from 'react';
import robotImage from "../assets/header_img.png";
import handImage from "../assets/hand_wave.png";
import { useOutletContext } from 'react-router-dom';
import Loader from './Loader';


function Header() {
  const { alert, baseUrl, setIsLoggedIn, isLogggedIn, loading, setLoading } = useOutletContext();
  const [user, setuser] = useState({});

  const getUserData = () => {
    try {
      setLoading(true);
      fetch(`${baseUrl}/user-data`, {
        headers: {
          authorization: localStorage.getItem("token")
        },
      })
        .then((res) => {
          res.json().then((data) => {
            setLoading(false);
            setuser(data.user);
            if (data.success) {
              setIsLoggedIn(true);
            }
          })
        })
        .catch((err) => {
          console.log(err.message)
        })
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    getUserData();
  }, [isLogggedIn])
  return (
    <section className='header-section'>
      <div className='details'>
        <img width={100} src={robotImage} alt="robot" />
        <div className='hand-image-box'>
          <h2>Hey {isLogggedIn ? user?.name : "Developer"}</h2>
          <img width={20} src={handImage} alt="hand" />
        </div>
        <h1>Welcome to our app</h1>
        <p>Let's start with a quick product tour and we will have you up and running in no time!</p>
        <button className='get-started-btn'>Get Started</button>
      </div>
    </section>
  )
}

export default Header