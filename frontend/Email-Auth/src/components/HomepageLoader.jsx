import React from 'react';
import loader from "../assets/loader.gif"

function HomepageLoader() {
  return (
    <div className='homepage-loader-wrapper'>
        <div className='homepage-loader'>
            <img src={loader} alt="loader" />
        </div>
    </div>
  )
}

export default HomepageLoader