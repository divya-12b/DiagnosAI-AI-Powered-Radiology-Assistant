import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Api from '../Api';
import { toast } from "react-toastify";



const ReportMore=()=>{
    const location=useLocation()
    const data=location.state || {}
    console.log('data',data)
    const category=data.result.category
    console.log('cate',category)
    const image=data.data.result.uploaded_image_url
    console.log('img',image)
    const [profile,setProfile]=useState([])
    const [detail,setDetails]=useState([])
    const [history,setHistory]=useState([])

    const handledetails=async()=>{
        try{
            const response=await Api.get(`/detailreport/${category}/action`)
            console.log( 'details for ',response.data)
            setDetails(response.data.data)
        }catch(error){
            console.error(error.response.data)
            
        }
    }

    useEffect(()=>{
        handledetails()
    },[])
    const handledata=async()=>{
        try{
            const response=await Api.get('viewuser/')
            console.log('user',response.data.data)
            setProfile(response.data.data)
        }catch(error){
            console.error(error.response.data)
            if (error.response.data.detail){
                alert(error.response.data.detail)
                
            }
        }
    }



    const handlesend=async(e)=>{
        e.preventDefault()
        try{
            const response=await Api.post('history/',{
                name:profile.username,
                image:image,
                predict:data.data.result.predicted_class  ,
                sym:detail.symptoms,
            })
            console.log(response.data)
            toast.success('Report Saved Successfully')
        }catch(error){
            console.error(error.response.data)
        }
    }
    const handlehistory=async()=>{
        try{
            const response=await Api.get('viewhistory/')
            console.log('history',response.data)
            setHistory(response.data.data)
        }catch(error){
            console.error(error.response.data)
        }
    }

    useEffect(()=>{
        handledata()
        handlehistory()
           
    },[])
    return(
        <div data-aos='zoom-out-up'>
            <div className="bg-gray-300 h-screen flex justify-center items-center ">
                
                <div >
                    <h1 className="text-6xl text-center font-serif -mt-40 mb-20 text-slate-600">Report Details</h1>
                    <div className="grid grid-cols-3 gap-6">
                        <div >
                            <h1 className="text-slate-600 font-semibold">Name</h1>
                            <div className="bg-slate-50 w-80 p-2 text-xl font-semibold  ">
                                <p>{profile.username}</p>
                            </div>
                        </div>
                        <div >
                            <h1 className="text-slate-600 font-semibold">Age</h1>
                            <div className="bg-slate-50 w-80 p-2 text-xl font-semibold  ">
                                <p>{profile.age}</p>
                            </div>
                        </div>

                        <div >
                            <h1 className="text-slate-600 font-semibold">Symptoms</h1>
                            <div className="bg-slate-50 w-80 p-2 text-xl font-semibold  ">
                                <p>{detail.symptoms}</p>
                            </div>
                        </div>

                        <div >
                            <h1 className="text-slate-600 font-semibold">Diagnosis</h1>
                            <div className="bg-slate-50 w-80 p-2 text-xl font-semibold  ">
                                <p>{detail.diagnosis}</p>
                            </div>
                        </div>

                        

                        <div >
                            <h1 className="text-slate-600 font-semibold" >Medication</h1>
                            <div className="bg-slate-50 w-80 p-2 text-xl font-semibold  ">
                                <p>{detail.medication                                }</p>
                            </div>
                        </div>

                        <div >
                            <h1 className="text-slate-600 font-semibold">Home remedies</h1>
                            <div className="bg-slate-50 w-80 p-2 text-xl font-semibold  ">
                                <p>{detail.home}</p>
                            </div>
                        </div>

                        <div >
                            <h1 className="text-slate-600 font-semibold">Doctor consultation</h1>
                            <div className="bg-slate-50 w-80 p-2 text-xl font-semibold  ">
                              { data.result ?   <p>{data.result.name}</p>: <p>Null</p>} 
                            </div>
                        </div>

                        <div >
                            <h1 className="text-slate-600 font-semibold">Description</h1>
                            <div className="bg-slate-50 w-80 p-2 h-20 text-xl font-semibold overflow-y-scroll ">
                                <p>{detail.desc}</p>
                            </div>
                        </div>

                        <div >
                            <h1 className="text-slate-600 font-semibold">Treatment</h1>
                            <div className="bg-slate-50 w-80 h-20 p-2 text-xl font-semibold  overflow-y-scroll ">
                            <p>{detail.treat}</p>
                            
                            </div>
                        </div>
                        <button className="bg-red-400 w-20 py-2 px-3 rounded-lg text-white font-semibold hover:bg-red-500" onClick={handlesend}>save</button>
                        
                        
                    </div>
                </div>


                
            </div>
            <div data-aos='zoom-out' className="bg-slate-200">
                <div className="flex justify-center items-center">
                    
                    <div><h1 className=" mb-20 font-semibold text-6xl flex justify-center text-slate-400 font-serif">Medical History</h1>
                        <table className="border-2 mb-20 max-w-5xl border-gray-700 ">
                            <thead className="border-b-2 border-gray-700" >
                                <tr>
                                    <th className="px-10 py-3">Name</th>
                                    <th  className="px-10 py-3">Image</th>
                                    <th className="px-10 py-3">Predication Result</th>
                                    <th className="px-10 py-3">Symptoms</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {history.length>0 ? (history.map((items,index)=>(
                                <tr key={index} className="border-b-2 border-gray-700">
                                <th className="px-10 py-3">
                                {items.name}
                                </th>
                                <a href={items.image} target="_blank" className="text-blue-600 px-10 py-3 underline">
                                    View Image
                                </a>
                                <th className="px-10 py-3">
                                    {items.predict  }
                                </th>
                                <th className="px-10 py-3">
                                    {items.sym}
                                </th>
                            </tr>
                             ))   ) : (<p>History Data Not Found</p>)}
                             
                               
                            </tbody>

                            
                       
                        </table>                
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportMore;