import Styles from "./home.module.css";
import { useContext, useEffect, useState } from "react";
import { usercontext } from "../appcontext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Home(){
    const navigate=useNavigate()
    const {islogged,username,isprevious,serviceURL,setusername,setislogged,setisprevious}=useContext(usercontext)
    const [isshow,setshow]=useState(false)
    const [isloading,setisloading]=useState(false)
    const [delloading,setdelloading]=useState(false)
    useEffect(()=>{
        
       
        const func =(event)=>{
            if(event.target.id != "menu" ){
                setshow(false)
            }
        }

        window.addEventListener("click",func)


        return ()=> window.removeEventListener("click",func)
        


    },[])



    const logout =()=>{
        setisloading(true)
        fetch(`${serviceURL}/logout`,{ method: "post", credentials: 'include' }).then(response => {
            if (response.ok){
                setusername("")
                setislogged(false)
                setisprevious(false)
                toast.success("Successfully Loggedout")
                setisloading(false)
                navigate("/login")
            }
            else{
                toast.error("unauthorised access")
                setisloading(false)
            }
        }).catch(error => {toast.error("Logout failed");setisloading(false)});
    }

    function toggle(){
            if( isshow){
                setshow(false)
               
            }
            else{
                setshow(true)
                 
            }
        }
        const confirmagain=()=>{
        document.getElementById("confirmdivdel").style.display="flex"
    }
        const closedeldiv=()=>{
        document.getElementById("confirmdivdel").style.display="none"
    }

        const delaccount=()=>{
        setdelloading(true)
        fetch(`${serviceURL}/deleteAccount`,{method:"post",credentials:'include'})
        .then(response => {
            if(response.ok){
                setislogged(false)
                document.getElementById("confirmdivdel").style.display="none"
                setdelloading(false)
                setusername("")
                setisprevious(false)
                navigate("/login")
                toast.success("Account Deleted Successfully")
            }
            else{
                toast.error("Couldn't detele try again !!!")
                setdelloading(false)
            }
        })
        .catch(error => {toast.error("Network Error"); setdelloading(false)})
    }

    const upnavigate=()=>{
        if(islogged){
            navigate("/uploaddoc")
        }
        else{
            navigate("/login")
        }
    }

    return (
        <div className={Styles.container}>
            <div className={Styles.nav}>
                <h1>Resume Analyser</h1>
                { ! islogged ?<Link to={"/login"}><button>Login</button></Link>: <h3 id="menu" onClick={toggle} className={Styles.profile}>{username[0].toUpperCase()}</h3>}
            </div>
           {isshow && islogged? <div id="menu" className={Styles.profilemenu}>
                <h2 id="menu">{username}</h2>
                <hr id="menu" />
                <div id="menu"className={Styles.pmenusec}>
                    <button id="menu" onClick={logout} disabled={isloading} >Logout</button>
                    <button onClick={confirmagain} id="menu" disabled={isloading}><span id="menu" className={Styles.del}>Delete account</span></button>
                </div>
            </div>: null}
            <img  className={Styles.bg} src="https://cdn.jsdelivr.net/gh/Mohamed-Imran-34/Datahub@main/Analysis.png" alt="AnalysisBg" />
            <div className={Styles.core}>
                <h1>Hello Welcome!</h1>
                <p>Boost your career with our Resume Analyser. Upload your resume and get instant insights on ATS score, keywords, skills, and formatting to make your resume stand out and land your dream job!</p>
                <div className={Styles.btncontainer} >
                    <button disabled={isloading} onClick={upnavigate} >Analyse Resume</button>
                    {isprevious?<button disabled={isloading} onClick={()=>navigate("/analysereport")}>Previous Analysis</button>:null}
                </div>
            </div>
            <div className={Styles.delcontainer} id='confirmdivdel'>
                <div className={Styles.confirmcontainer}>
                    <p>Are you sure want to delete your account ? <br/><br/>It will permanently removes all your data and can't be recovered. <br />  </p>
                    <div className={Styles.confirmationbtns}>
                        <button className={Styles.confirmdel} disabled={delloading}  onClick={delaccount} >{delloading?"Deleting ...":"Delete"}</button>
                        <button className={Styles.notnow} disabled={delloading} onClick={closedeldiv}>Not now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home