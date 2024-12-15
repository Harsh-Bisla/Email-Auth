import React from 'react';
import Navbar from "../components/Navbar";
import Header from "../components/Header"
import { useOutletContext } from 'react-router-dom';
import HomepageLoader from './HomepageLoader';

function Homepage() {
  const { loading } = useOutletContext();
  return (
    <div className='homepage-wrapper'>
      {loading ? <HomepageLoader /> : <Navbar />}
      <Header />
    </div>
  )
}

export default Homepage