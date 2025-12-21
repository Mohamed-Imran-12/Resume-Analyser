import { createContext, useEffect, useState} from "react";
import { toast } from "react-toastify";

export const usercontext =createContext();

function Appcontext({children}){
    const backendURL=`${window.location.protocol}//${window.location.host}/resumeAnalyser/entry/v1`
    const serviceURL=`${window.location.protocol}//${window.location.host}/resumeAnalyserCore/service/v1`
    const [islogged,setislogged]=useState(false)
    const [isprevious,setisprevious]=useState(false)
    const [username,setusername]=useState("")
    const [isauthenticated,setisauthenticated]=useState(false)


   useEffect(() => {
        fetch(`${serviceURL}/isValid`, { method: "post", credentials: 'include' }).then(response => {
            if (response.ok) {
                return response.json()
                
            }
            else {
                setisauthenticated(true)
                return;
            }
        })
            .then(data => {
                if (data != null) {
                    setusername(data.username);
                    setisprevious(data.isPrevious)
                    setislogged(true)
                    setisauthenticated(true)
                }
            }).catch(error=> setisauthenticated(true))

    }, [])


    const arr ={islogged,setislogged,isprevious,setisprevious,username,setusername,backendURL,serviceURL,isauthenticated}

    return (
        <usercontext.Provider value={arr}>
            {children}
        </usercontext.Provider>
    )
}

export default Appcontext