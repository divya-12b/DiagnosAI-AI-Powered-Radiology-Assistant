import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Api from "../Api";

const Cases=()=>{
    const [data,setData]=useState([])
    const [det,setdet]=useState([])
    const handledata=async()=>{
        try{
            const response=await Api.get('viewuser/')
            console.log(response.data.data)
            setData(response.data.data)
        }catch(error){
            console.error(error.response.data)
        }
    }
    const handledet=async()=>{
        try{
            const response=await Api.get('viewreport/')
            console.log('det',response.data.data)
            setdet(response.data.data)
        }catch(error){
            console.error(error.response.data)
            alert(error.response.data.detail)
        }
    }

    
    useEffect(()=>{
        handledata()
        handledet()
    },[])

    return (
        <div>
           <div className="bg-slate-100 h-screen font-semibold flex  justify-evenly ">
                <div>
                        <div className="mt-10">
                            <div>
                                 <div className="mb-5 grid grid-cols-1 border w-60 text-center ">
                                    <NavLink to='/cases' className={({isActive})=>isActive ? "bg-blue-600 p-2 text-white":"hover:bg-white p-2 text-black"} >My Cases</NavLink>
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
                                <p className="border-b-2 mb-5 font-semibold text-xl text-center ">Current Cases</p>

                            </div>
                            <div className="flex">
                                <div className="border-2 h-40">
                                    <img className="h-40 w-54" src={data.image}/>

                                </div>
                                <div className="ml-5 grid grid-cols-1">
                                    <p className="text-xl text-blue-500">Case 1</p>
                                    <p className="text-md">{data.username}</p>
                                    <p>{det.detected}</p>
                                    <p className="text-slate-500">{det.created_at}</p>
                                </div>
                            </div>
                            

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cases;