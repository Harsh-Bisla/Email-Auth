import { Outlet } from 'react-router-dom';
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';


function App() {
  const [loading, setLoading] = useState(false);
  const [isLogggedIn, setIsLoggedIn] = useState(false);
  const baseUrl = "http://localhost:3000/api"
  const alert = (msg) => {
    toast(msg)
  }

  return (
    <>
      <ToastContainer autoClose={1500} />
      <Outlet context={{ alert, baseUrl, isLogggedIn, setIsLoggedIn, setLoading, loading }} />
    </>
  )
}

export default App
