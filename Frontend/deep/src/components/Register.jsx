import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Api from "./Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register=()=>{
    const [first,setFirst]=useState('')
    const [last,setLast] = useState('')
    const [name,setName]= useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirm,setConfirm]=useState('')
    const [image,setImage]=useState(null)
    const navigate=useNavigate()
   

    const handleRegister=async(e)=>{
        e.preventDefault();
        if (password !== confirm){
            toast.error("Both Password Mismatch")
        }
        const formdata=new FormData()
        formdata.append('first_name',first)
        formdata.append('last_name',last)
        formdata.append('password',password)
        formdata.append('confirm',confirm)
        formdata.append('username',name)
        formdata.append('email',email)
        formdata.append('confirm',confirm)
        formdata.append('image',image)
        try{
            const response=await Api.post('register/',formdata)
            toast.success('Registeration Successfully')
            console.log(response.data);
            navigate('/login')
            setFirst('')
            setLast('')
            setName('')
            setEmail('')
            setPassword('')
            setConfirm('')
            
        }catch(error) {
            console.error(error.response.data);
            if (error.response.data.username){
                error.response.data.username.forEach((message)=>{
                    toast.error(message)
                })
            }
            if (error.response.data.email){
                error.response.data.email.forEach((message)=>{
                    toast.error(message)
                })
            }
    
        }

    }
    return (
        <div className="bg-slate-100 h-screen flex items-center justify-center">
            <div data-aos='fade-left'>
                <div className="bg-white max-w-5xl  m-auto ">
                    <div className="w-full ">
                        <div className="flex bg-slate-200 w-full space-x-5 p-5">
                        <NavLink
                to="/login"
               className={({isActive})=>isActive ? "bg-white p-2 " : "hover:bg-white p-2"}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive })=>isActive ? "bg-white p-2 ": "hover:bg-white p-2"}
              >
                Register
              </NavLink>
                        </div>

                        <div className="p-5">
                            <div>
                                <p className="text-4xl font-thin flex justify-center mb-4">Create an Account</p>
                            </div>
                            <form onSubmit={handleRegister}>

                                <div className=" flex justify-around mb-4 ">
                                    <input value={first} onChange={(e)=>setFirst(e.target.value)} placeholder="first name"className="border-2  p-1 rounded-md "/>
                                    <input value={last} onChange={(e)=>setLast(e.target.value)} placeholder="last name" className="border-2    rounded-md "/>
                                </div>

                                <div>
                                    <input value={name} onChange={(e)=>setName(e.target.value)}  placeholder="username" className="border-2 mb-4  p-1 rounded-md w-full"/>
                                </div>
                                <div>
                                    <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="enter email" className="border-2  mb-4 p-1 rounded-md w-full"/>
                                </div>

                                <div>
                                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" className="border-2 mb-4 p-1 rounded-md w-full"/>
                                </div>
                                <div>
                                    <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="confirm password" className="border-2  mb-4 p-1 rounded-md w-full"/>
                                </div>
                                <div>
                                    <label>Profile</label>
                                    <input type="file"   onChange={(e)=>setImage(e.target.files[0])} placeholder="confirm password" className="border-2  mb-4 p-1 rounded-md w-full"/>
                                </div>

                                <div>
                                    <button type="submit" className="bg-blue-700 hover:bg-blue-500 rounded-lg text-white px-3 py-2">Register</button>
                                </div>
                                </form>
                                
                        </div>

                    </div>
                   
                    

                </div>
            </div>
        </div>
    )
}
export default Register;


// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import Api from "./Api";

// const Register = () => {
//     const [first, setFirst] = useState('');
//     const [last, setLast] = useState('');
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirm, setConfirm] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     const handleRegister = async (e) => {
//         e.preventDefault();

//         if (password !== confirm) {
//             setErrorMessage("Passwords do not match");
//             return;
//         }
        
//         if (!email || !/\S+@\S+\.\S+/.test(email)) {
//             setErrorMessage("Please enter a valid email");
//             return;
//         }

//         if (password.length < 6) {
//             setErrorMessage("Password must be at least 6 characters");
//             return;
//         }

//         try {
//             const response = await Api.post('register/', {
//                 first_name: first,
//                 last_name: last,
//                 username: name,
//                 email: email,
//                 password,
//                 confirm
//             });
//             setSuccessMessage("Registration successful!");
//             setErrorMessage('');
//             setFirst('');
//             setLast('');
//             setName('');
//             setEmail('');
//             setPassword('');
//             setConfirm('');
//         } catch (error) {
//             setErrorMessage("An error occurred during registration.");
//             console.error(error);
//         }
//     }

//     return (
//         <div className="bg-slate-100 h-screen flex items-center justify-center">
//             <div>
//                 <div className="bg-white max-w-5xl m-auto">
//                     <div className="w-full">
//                         <div className="flex bg-slate-200 w-full space-x-5 p-5">
//                             <NavLink to="/login" className={({ isActive }) => isActive ? "bg-white p-2" : "hover:bg-white p-2"}>Login</NavLink>
//                             <NavLink to="/register" className={({ isActive }) => isActive ? "bg-white p-2" : "hover:bg-white p-2"}>Register</NavLink>
//                         </div>
//                         <div className="p-5">
//                             <p className="text-4xl font-thin flex justify-center mb-4">Create an Account</p>
//                             {errorMessage && <div className="text-red-500">{errorMessage}</div>}
//                             {successMessage && <div className="text-green-500">{successMessage}</div>}
//                             <form onSubmit={handleRegister}>
//                                 <div className="flex justify-around mb-4">
//                                     <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First Name" className="border-2 p-1 rounded-md" />
//                                     <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last Name" className="border-2 p-1 rounded-md" />
//                                 </div>
//                                 <div>
//                                     <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" className="border-2 mb-4 p-1 rounded-md w-full" />
//                                 </div>
//                                 <div>
//                                     <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter Email" className="border-2 mb-4 p-1 rounded-md w-full" />
//                                 </div>
//                                 <div>
//                                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border-2 mb-4 p-1 rounded-md w-full" />
//                                 </div>
//                                 <div>
//                                     <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm Password" className="border-2 mb-4 p-1 rounded-md w-full" />
//                                 </div>
//                                 <div>
//                                     <button type="submit" className="bg-blue-700 hover:bg-blue-500 rounded-lg text-white px-3 py-2">Register</button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Register;
