import axios from 'axios'
import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext()

export const server = "http://localhost:5000"


export const AppContextProvider = ({children}) => {
    const [user, setUser] = useState([])

    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)

   

    async function fetchUser (){
        try {
            const {data} = await axios.get(`${server}/api/v1/me`,{
                headers:{
                    accesstoken: Cookies.get("accesstoken")
                }
            })

            setUser(data.user)
            setLoading(false)
            setIsAuth(true)
        } catch (error) {
            console.log("Please Login")
            setLoading(false)
            setIsAuth(false)
        }
    }

    useEffect(() => {
      fetchUser()
    }, [])
    
    return <AppContext.Provider value={{user,setUser,isAuth,setIsAuth,loading}}>{children}</AppContext.Provider>
}

export const AppValues = () => useContext(AppContext)