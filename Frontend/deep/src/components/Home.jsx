import React, { useEffect,useRef ,useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
    const [logged, setLogged] = useState('');
    const [category,setCategory]= useState('')
    const [image, setImage] = useState(null);
    const navigate = useNavigate(); 
    const reference=useRef(null)

    const handleref=()=>{
        reference.current.click();
    }
    const handleSubmit=()=>{
        if (category ===""){
            alert('Select The Category')
            return
        }
        navigate('/confirmimage',{state:{category,image}})
    }


    useEffect(() => {
        const id = Cookies.get('id');
        if (id) {
            setLogged(id);
            console.log('id is', id);
        }
    }, []);

    return (
        <div className="h-screen flex justify-center items-center">
            <div data-aos='zoom-in'>
                <div className="text-7xl text-center">
                    Hello!
                </div>
                <div className="text-center">
                    Welcome to the DiagnosAI.
                </div>

                {logged ? (
                    <div>
                        <div className="text-md text-gray-500">
                            Please click the button below to select an image and get started!
                        </div>

                        <div className="ml-40 mt-5">
                            <select onChange={(e)=>setCategory(e.target.value)}>
                                <option value={""}>Select</option>
                                <option value={"brain"}>Brain</option>
                                <option value={"kidney"}>Kidney</option>
                                <option value={"lung"}>Lung</option>
                            </select>
                            <button
                                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition duration-300"
                               onClick={handleref}
                               >
                                Upload Image
                            </button>

                            <input
                                type="file"
                                className="hidden"
                                ref={reference}
                                
                                
                               onChange={(e)=>setImage(e.target.files[0])}
                            />
                        </div>

                        {image && (
                            <div className="mt-5 text-center">
                                <button onClick={handleSubmit}
                                    className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition duration-300"
                                     
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                ) : ('')}
            </div>
        </div>
    );
};

export default Home;


