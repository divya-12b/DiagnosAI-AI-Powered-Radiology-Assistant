import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Api from "../Api";
import { toast } from "react-toastify";


const Update=()=>{
    const [first,setFirst]=useState('')
    const [last,setLast]=useState('')
    const [user,setUser]=useState('')
    const [email,setEmail]=useState('')
    const [age,setAge]= useState('')

    const handledata=async(e)=>{
        e.preventDefault()
        try{
            const response=await Api.put('update/',{
                first_name:first,
                last_name:last,
                username:user,
                email:email,
                age:age,
            })
            console.log(response.data)
            toast.success(response.data.res)
            setAge('')
            setEmail('')
            setFirst('')
            setLast('')
            setUser('')

        }catch(error){
            console.error(error.response.data)
            alert(error.response.data)
        }
    }
    
    return (
        <div>
            <div className="bg-slate-100 h-screen font-semibold flex  justify-evenly ">
                <div>
                        <div className="mt-10">
                            <div>
                                 <div className="mb-5 grid grid-cols-1 border w-60 text-center ">
                                    <NavLink to='/cases' className={({isActive})=> isActive ? "bg-blue-600 p-2 text-white":"hover:bg-white p-2 text-black"} >My Cases</NavLink>
                                    <NavLink to='/update' className={({isActive})=>isActive ? "bg-blue-600 p-2 text-white":"hover:bg-white text-black p-2"} >Account settings</NavLink>
                                    
                                </div>
                               
                            </div>
                            <div>

                            </div>
                            
                        </div>
                    
                </div>

                <div className="w-2/5 mt-10">
                    <div className="border-2  bg-white p-5 ">
                        <div>
                            <div>
                                <p className="border-b-2 mb-5 font-semibold text-xl text-center ">Update Account Settings</p>

                            </div>
                            
                                <div className="mb-5">
                                    <label className="mb-2">Update Name</label>
                                    <div className=" flex justify-around  ">
                                        <input value={first} onChange={(e)=>setFirst(e.target.value)} placeholder="first name"className="border-2  p-1 rounded-md "/>
                                        <input value={last} onChange={(e)=>setLast(e.target.value)} placeholder="last name" className="border-2    rounded-md "/>

                                    </div>
                                </div>
                                <div>
                                    <label>Username</label>
                                    <input value={user} onChange={(e)=>setUser(e.target.value)} type="text" placeholder="username" className="border-2 mb-4  p-1 rounded-md w-full"/>
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="enter email" className="border-2  mb-4 p-1 rounded-md w-full"/>
                                </div>
                                <div>
                                    <label>Age</label>
                                    <input value={age} onChange={(e)=>setAge(e.target.value)} type="number" placeholder="enter email" className="border-2  mb-4 p-1 rounded-md w-full"/>
                                </div>
                                                                <div>
                                    <button onClick={handledata} className="px-3 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded-md">Update Account</button>
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Update;