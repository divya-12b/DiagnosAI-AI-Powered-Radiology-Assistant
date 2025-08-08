import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Api from "../Api";
import { useNavigate  } from "react-router-dom";

const Report=()=>{
    const location =useLocation()
    const result=location.state || {}
    console.log('results',result)
    const [data,setData]=useState([])
    const [doc,setDoc]=useState([])
    const navigate=useNavigate()

    const handledata=async()=>{
        try{
            const response=await Api.get('viewreport/')
            console.log(response.data.data)
            setData(response.data.data)

        }catch(error){
            console.error(error.response)
        }
    }
    const handledataa=async()=>{
        const category=result.result.category
        console.log('cat',category)                                          
        try{
            const response=await Api.get(`doctor/${category}/action`)
            console.log(response.data.data)
            setDoc(response.data.data)
        }catch(error){
            console.error(error.response.data)
            alert(error)
        }
    }
    const handleclick=()=>{
        navigate('/reportmore',{state:{result:doc,data:result}})
    }
    useEffect(()=>{
        handledata()
        
        handledataa()
    },[])
    
    return (
        <div>
            <div data-aos='flip-left' className="bg-slate-100 h-full flex justify-center items-center">
                <div className="grid grid-cols-1 max-w-full gap-10">
                    <div>
                        <h1 className="text-6xl  font-thin flex justify-center ">Medical Report</h1>
                    </div>
                    <div className="border p-10 bg-slate-50 w-full max-w-4xl">
                        <div className="flex  justify-evenly">

                        <div className="">
                                <p className="font-semibold">Patient Name</p>
                                <p className="border border-slate-300 rounded-md w-72 p-1 px-3 py-2">{data.name}</p>
                        </div>
                        <div className=" ml-16 ">
                                <p className="font-semibold">Doctor</p>
                                <p className="border px-3 py-2 border-slate-300 rounded-md w-72 p-1">{doc.name}</p>
                            </div>

                        </div>
                    
                            
                        <div className="grid grid-flow-col grid-row-3 my-10 gap-4">
                           
                            
                            <div className="row-span-3">
                                <img src={result.result.uploaded_image_url} className="h-96 w-[280px] rounded-lg" alt="uploaded image error"/>
                            </div>
                            <div className="ml-10 grid grid-cols-1 gap-10 relative">

                                <div className="border border-slate-300 rounded-md w-72 p-1">
                                    <p className="border-b-2 bg-slate-200 p-1" >Detected Diseases</p>
                                    
                                    {result.result.message === "The image is irrelevant." ?<p className="py-2 px-3">{result.message}</p>:  <p className="py-2 px-3">{result.result.predicted_class}</p>}
                                 
                                </div>
                                <div  className="border border-slate-300 rounded-md w-72 p-1">
                                    <p className="border-b-2 bg-slate-200 p-1" >Additional Diseases</p>
                                    {data.additional==="" ? <p className="py-2 px-3">Null</p>:<p>{data.additional}</p>}
                                </div>
                                <div className="flex justify-center py-6">
                                    <button onClick={handleclick} className="text-center bg-gray-400 px-6 text-md font-semibold rounded-lg text-red-600 hover:bg-green-300 py-2">More</button>
                                </div>

                            </div>
                           
                            
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Report;