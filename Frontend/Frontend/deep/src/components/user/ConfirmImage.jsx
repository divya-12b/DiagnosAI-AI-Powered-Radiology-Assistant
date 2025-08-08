import React, { useEffect, useState } from "react";
import {useLocation} from 'react-router-dom';
import Api from '../Api';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const ConfirmImage=()=>{
  const location =useLocation()
  const {image,category}=location.state || {}
  const data=localStorage.getItem('image')
  const [imageurl,setImageUrl]=useState('')
  const navigate=useNavigate()

  useEffect(()=>{
    if (data){
      setImageUrl(data)
    }else if (image){

      
      const img=URL.createObjectURL(image)
      

      console.log('image is',img)
      setImageUrl(img)
    }
  },[data,image])

  const [file,setFile]=useState('')

  // const handledata=(e)=>{
  //   const input=e.target.files[0]
  //   if (input){
  //     const in_data=URL.createObjectURL(input)
  //     setFile(input)
  //     setImageUrl(in_data)
  //     localStorage.setItem('image',in_data)
  //   }
  // }
  const handlesend=async(e)=>{
    e.preventDefault()
    const form=file || (image ? image : data)
    localStorage.setItem('images',form.name)
    console.log('sending image',form.name)
  
      const formdata=new FormData()
      formdata.append('image',form)
      formdata.append('category',category)
      console.log('form',formdata)
    try{
      const response=await Api.post('upload/',formdata)
      if (response.data.message === "The image is irrelevant."){
        toast.error(response.data.message)
      }else{
        toast.success(response.data.message)
      }
      
      setFile('')
      setImageUrl("")
      localStorage.removeItem('image')
      navigate('/result',{state:{result:response.data}})


    }catch(error){
      console.log(error)
    }
  }

    return (
        <div className="bg-slate-100 h-screen flex justify-center items-center">
                     <div data-aos='fade-up-left' className="text-center p-4 space-y-4 bg-white rounded-lg shadow-lg">
                         <div className="text-2xl font-semibold text-gray-800">Confirm Image</div>
                         <div className="flex">
                             <div>
                                 {imageurl ? (
                                    <div>
                                        <img
                                            src={imageurl}
                                            alt="Uploaded"
                                            className="max-w-full max-h-96 object-cover rounded-lg shadow-md"
                                        />
                                        <p>{category}</p>
                                    </div>
                                ) : (
                                    <div className="text-lg text-gray-600">No image uploaded.</div>
                                )}
                            </div>
                            <div>
                                <div className="w-96">
                                    <div>
                                        <p>Is this the correct image?</p>
                                        <p>If this is the correct image, run the detection. If not, upload again.</p>
                                    </div>
        
                                    <div className="mt-10">
                                        <button onClick={handlesend} className="bg-blue-600 text-white py-2 px-3 rounded-md">
                                            Run Detection
                                        </button>
        
                                        <Link to='/' className="bg-slate-400 py-2 px-3 ml-5 w-40 text-white rounded-md cursor-pointer mt-5">
                                            Upload New Image
                                            {/* <input 
                                                type="file"
                                                className="hidden"
                                                onChange={handledata}
                                            /> */}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    )
}

export default ConfirmImage;



