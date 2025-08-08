import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'; 
import { NavLink,useNavigate } from "react-router-dom";
import Api from '../Api';
import { toast } from 'react-toastify';





const Result = () => {
    const [name,setName]=useState('')
    const [add,setAdd] = useState('')
    const [desc,setDesc]= useState('')
    const [detect,setDetect] = useState('')
    const location=useLocation()
    const { result }=location.state || {}
    const navigate=useNavigate()


    useEffect(()=>{
        if (result){
            setDetect(result.predicted_class)
            console.log('resut',result.cat)
        }

    },[result])
    

    if (!result) {
        return <div>No result data found.</div>;
    }
    
    const handledata=async(e)=>{
        e.preventDefault()
        const formdata=new FormData()
        formdata.append('name',name)
        formdata.append('additional',add)
        formdata.append('desc',desc)
        formdata.append('detected',detect)

        try{
            const response=await Api.post('editreport/',formdata)
            console.log('cate',response.data.cat)
            
            setAdd('')
            setDesc('')
            setName('')
            setDetect([])
            navigate('/report',{state:{result:result}})

        }catch(error){
            if (error.response.data.name){

                console.error(error.response.data.name)
            toast.error(error.response.data.name)

            }else{
                console.error(error.response.data)
            }
            

        }
    }


    return (
        <div className="bg-slate-100 flex justify-center items-center h-screen">
            <div>
                <div className="flex justify-evenly">
                    <div data-aos='fade-down-left' className="bg-white w-60">
                        <img 
                            src={result.uploaded_image_url} 
                            alt="Irrelevant Image" 
                            className="w-60 h-80 object-cover"
                        />
                        
                        {result.message === "The image is irrelevant." ?<p>{result.message}</p>:  <p>Detected Disease: {result.predicted_class}</p>}
                    </div>
                    <div data-aos='fade-down-right' className="ml-10">
                        <div className="text-center">
                            <p className="text-6xl">Edit Medical Report</p>
                            <p>Please edit and finalize this Report</p>
                        </div>

                        <div className="bg-white p-5">
                            <div>
                                <label>Patient Name</label><br />
                                <input required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Patient Name" className="border p-1 rounded-md w-full" />
                            </div>
                            <div>
                                <label>Enter Additional Diseases (Comma Separated)</label>
                                <input value={add} onChange={(e)=>setAdd(e.target.value)} placeholder="Disease 1,Disease 2,Disease 3" className="border p-1 rounded-md w-full" />
                            </div>
                            <div>
                                <label>Enter A General Summary and Additional Details</label>
                                <input value={desc} onChange={(e)=>setDesc(e.target.value)}  className="border p-1 rounded-md w-full" placeholder="enter a general summary and additional info/comments about the case here" />
                            </div>
                            {result.message === "The image is irrelevant." ?"": (<div className="mt-5 rounded-lg">
                                <NavLink onClick={handledata} to='/report' className="bg-blue-600 text-white py-2 px-3">
                                    Generate Report
                                </NavLink>
                            </div>)}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;



