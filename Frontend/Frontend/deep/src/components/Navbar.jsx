import React,{useState,useEffect} from "react";
import { Link, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";



const Navbar=()=>{
    const [logged,setLogged] = useState('')
    const navigate=useNavigate()

    useEffect(()=>{
        const id=Cookies.get('id')
    if (id){
        setLogged(id)
        console.log('id is ',id)

    }

    },[])
    const handlelogout=()=>{
        Cookies.remove('id')
        Cookies.remove('accesstoken')
        Cookies.remove('refreshtoken')
        navigate('/')
        window.location.reload()
    }
    return(
        <div data-aos='zoom-out'>
            {logged ? ( <nav className="bg-black p-5">
                <div className="text-white flex justify-between font-semibold">
                    <div >DiagnosAI</div>
                    <ul className="flex space-x-6">
                        <Link to='/'>Home</Link>
                        <NavLink to='/cases' activeClassName="active-link">Accounts</NavLink>
                        <button onClick={handlelogout}>Logout</button>
                    </ul>


                </div>
                
            
            </nav>
                ):(<nav className="bg-black p-5">
                    <div className="text-white flex justify-between font-semibold">
                        <div >DiagnosAI</div>
                        <ul className="flex space-x-6">
                            <Link to='/'>Home</Link>
                            <Link to='/login'>Login</Link>
                            <Link to='/register'>Register</Link>
                        </ul>
    
    
                    </div>
                    
                
                </nav>)}

           
        </div>
        
    )
}
export default Navbar;