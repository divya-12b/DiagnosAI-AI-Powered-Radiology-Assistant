import React, { useEffect } from 'react'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Register from './components/Register';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Update from './components/user/Update';
import Cases from './components/user/Cases';
import ConfirmImage from './components/user/ConfirmImage';
import Home from './components/Home';
import Result from './components/user/Result';
import Report from './components/user/Report';
import ReportMore from './components/user/ReportMore';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AOS from 'aos';
import 'aos/dist/aos.css';




const App=()=>{
  useEffect(()=>{
    AOS.init()
  },[])
  return (
    <Router>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/update' element={<Update/>}/>
        <Route path='/cases' element={<Cases/>}/>
        <Route path='/confirmimage' element={<ConfirmImage/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/result' element={<Result/>}/>
        <Route path='/report' element={<Report/>}/>
        <Route path='/reportmore' element={<ReportMore/>}/>
        
      </Routes>
    </Router>
  )
}
export default App;