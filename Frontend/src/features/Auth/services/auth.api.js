import axios from 'axios'

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials: true
})

export async function register({username, email, password}){
    try{
        const response = await api.post("/api/auth/register",{
            username,email,password
        })
        return response.data
    }
    catch(err){
        console.log(err)
    }
}

export async function login({email,password}){
    try{
        const resposnse = await api.post("/api/auth/login",{
            email,password
        })

        return resposnse.data
    }
    catch(err){
        console.log(err)
    }
}

export async function logout(){
    try{
        const respose = await api.get("/api/auth/logout")

        return respose.data
    }
    catch(err){
        console.log(err)
    }
}

export async function getme(){
    try{
        const response = await api.get("/api/auth/get-me")

        return response.data
    }
    catch(err){
        console.log(err)
    }
}