import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import Api from "./Api";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login=()=>{
    const [email,setEmail] =useState('')
    const [password,setPassword]=useState('')
    const navigate=useNavigate()

    const handleLogin=async(e)=>{
        e.preventDefault()
        try{
            const response=await Api.post('login/',{
                email,
                password
            }) 
            console.log(response.data);

            toast.success('Login Successfully');
            
            Cookies.set('id',response.data.user_id)
            Cookies.set('accesstoken',response.data.access_token)
            Cookies.set('refreshtoken',response.data.refresh_token)
            navigate('/')
            window.location.reload()

        
            

        }catch(error){  
            console.error(error.response?.data)
            if (error.response.data.non_field_errors){
                
                alert(error.response.data.non_field_errors)
            }else if (error.response.data.detail) {

                alert(error.response.data.detail)
            }
        }

    }
    return (
        <div className="bg-slate-100 h-screen flex items-center justify-center">
            <div data-aos='fade-right'>
                <div className="bg-white max-w-5xl  m-auto ">
                    <div className="w-full ">
                        <div className="flex bg-slate-200 w-full space-x-5 p-5">
                        <NavLink to='/login' className={({isActive})=>isActive ? "bg-white p-2 " : "hover:bg-white p-2"}>Login</NavLink>
                        <NavLink to='/register' className={({isActive})=>isActive ? "bg-white p-2 ": "hover:bg-white p-2"}>Register</NavLink>
                        </div>

                        <div className="p-5">
                            <div>
                                <p className="text-4xl font-thin flex justify-center  mb-4">For Login Here</p>
                            </div>

                            
                            <form onSubmit={handleLogin}>
                            <div>
                                    <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="enter email" className="border-2  mb-4 p-1 rounded-md w-full"/>
                                </div> 

                                <div>
                                     <input type="password" required value={password}  onChange={(e)=>setPassword(e.target.value)} placeholder="password" className="border-2 mb-4 p-1 rounded-md w-full"/>
                                </div>
                               

                                <div>
                                    <button type="sumbit" className="bg-blue-700 hover:bg-blue-500 rounded-lg text-white px-3 py-2">Login</button>
                                </div>
                                

                            </form>
                               
                        </div>

                    </div>
                   
                    

                </div>
            </div>
        </div>
    )
}

export default Login;

