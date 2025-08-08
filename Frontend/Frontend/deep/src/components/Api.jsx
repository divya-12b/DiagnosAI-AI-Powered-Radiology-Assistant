// import axios from 'axios';

// const Api=axios.create({
//     baseURL:"http://127.0.0.1:8000/api/deep/",
//     withCredentials:true 
// })



// export default Api;










import axios from 'axios';
import Cookies from 'js-cookie';
const Api=axios.create({
    baseURL:'http://127.0.0.1:8000/api/deep/',
    withCredentials:true,
})

Api.interceptors.request.use((con)=>{
    const csrftoken=Cookies.get('csrftoken')
    if (csrftoken){
        con.headers['X-CSRFTOKEN']=csrftoken
    }
    

    const access=Cookies.get('accesstoken')
    if (access){
        con.headers['Authorization']=`Bearer ${access}`
    }
    return con

},(error)=>{
    return Promise.reject(error)
})

export default Api;