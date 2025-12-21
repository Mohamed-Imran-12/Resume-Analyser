import { useContext, useState, useEffect } from "react";
import Styles from "./login.module.css";
import { toast } from "react-toastify";
import { usercontext } from "../appcontext";
import { useNavigate, Link } from "react-router-dom";
import GoogleButton from "../googlebtn.jsx"
function Login() {
    const navigate = useNavigate()
    const [islogin, setislogin] = useState(true)
    const { backendURL, setisprevious, setusername, setislogged, islogged } = useContext(usercontext)
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmpassword, setconfirmpassword] = useState("")
    const [isloading, setisloading] = useState(false)
    const [isemailverified, setemailverified] = useState(false)
    const [otp, setotp] = useState(["", "", "", "", "", ""])
    const [showpass, setshowpass] = useState(false)
    const [showconfirmpass, setshowconfirmpass] = useState(false)

    useEffect(() => {
        if (islogged) {
            navigate("/")
        }
    }, [islogged])

    function validateEmail(email) {
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailregex.test(email)
    }


    const submit = (event) => {
        event.preventDefault()
        if (!islogin) {
            if (name.trim() === "") {
                toast.warn("Username must not be empty")
                return;
            }
            if (email.trim() === "") {
                toast.warn("Email must not be empty")
                return;
            }
            if (!validateEmail(email.trim())) {
                toast.warn("Invalid Email")
                return;
            }
            if (password.length < 6) {
                toast.warn("Password atLeast have 6 characters")
                return;
            }
            if (!(password === confirmpassword)) {
                toast.warn("Passwords doesn't match")
                return;
            }
            setisloading(true)
            fetch(`${backendURL}/verifyEmail`, {
                method: "post", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: name.trim(), email: email.trim() })
            })
                .then(response => {
                    if (response.ok) {
                        setemailverified(true)
                        setisloading(false)
                    }
                    else {
                        toast.error("Email already registered")
                        setisloading(false)
                    }
                })
                .catch(error => {
                    toast.error("Signup Failed");
                    setisloading(false)
                })

        }
        else {
            if (email.trim() === "") {
                toast.warn("Email must not be empty")
                return;
            }
            if (!validateEmail(email.trim())) {
                toast.warn("Invalid Email")
                return;
            }
            if (password.length < 6) {
                toast.warn("Password atLeast have 6 characters")
                return;
            }
            setisloading(true)
            fetch(`${backendURL}/login`, {
                method: "post", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password: password }), credentials: 'include'
            })
                .then(response => {
                    if (response.ok) {
                        setemail("")
                        setpassword("")
                        setisloading(false)
                        setshowpass(false)
                        toast.success("Successfully loggedIn");
                        return response.json()

                    }
                    else {
                        setisloading(false)
                        toast.error("Invalid credentials")
                        return;
                    }
                })
                .then(data => {
                    if (data != null) {
                        setislogged(true)
                        setusername(data.username)
                        setisprevious(data.isPrevious)
                        navigate("/")
                    }
                })
                .catch(error => {
                    toast.error("Login Failed");
                    setisloading(false)
                })

        }


    }

    function switchmth() {
        setname("")
        setemail("")
        setpassword("")
        setshowpass(false)
        setshowconfirmpass(false)
        setconfirmpassword("")
        if (islogin) {
            setislogin(false)

        }
        else {
            setislogin(true)
        }
    }


    const handleInput = (index, event) => {
        if (index < 5 && event.target.value != "" && event.target.value.replace(/\D/, "") != "") {
            document.getElementById(index + 1).focus()
        }
        if (event.target.value.replace(/\D/, "") != "") {
            var tem = [...otp]
            tem[index] = event.target.value
            setotp(tem)

        }
        if (event.target.value.replace(/\D/, "") == "") {
            event.target.value = ""
        }

    }
    const handlebck = (index, event) => {
        if (event.key === "Backspace") {
            if (index > 0) {
                event.target.value = ""
                document.getElementById(index - 1).focus()
                event.preventDefault()
            }
            var tem = [...otp]
            tem[index] = ""
            event.target.value = ""
            setotp(tem)
        }
        else {
            if (event.target.value.length === 1 && index < 5 && event.target.value.replace(/\D/, "") != "") {
                document.getElementById(index + 1).focus()
            }

        }
    }


    const verifyprocess = () => {
        var enteredOtp = ""
        otp.forEach((i) => enteredOtp += i)
        if (enteredOtp.length < 6) {
            toast.error("Fill all fields")
            return;
        }
        setisloading(true)
        fetch(`${backendURL}/register`, {
            method: "post",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": name.trim(), "email": email.trim(), "password": password, "verifyotp": enteredOtp })

        })
            .then(response => {
                if (response.ok) {
                    setotp(["", "", "", "", "", ""])
                    setname("")
                    setemail("")
                    setpassword("")
                    toast.success("Account created successfully")
                    setisloading(false)
                    setemailverified(false)
                    setshowpass(false)
                    setshowconfirmpass(false)
                    setconfirmpassword("")
                    setislogin(true)

                }
                else {
                    setotp(["", "", "", "", "", ""])
                    toast.error("Invalid OTP")
                    setisloading(false)

                }
            })
            .catch(error => { toast.error("Net error"); setisloading(false) })


    }


    return (
        <div className={Styles.container}>
            <div className={Styles.nav}>
                <h1>Resume Analyser</h1>
            </div>
            {!isemailverified ? <div className={Styles.logincontainer}>
                <h1>{islogin ? "Login" : "Signup"}</h1>
                {
                    islogin ? null : <>
                        <input className={Styles.logincontainerinput} onChange={(event) => setname(event.target.value)} type="text" name="username" id="username" maxLength={20} autoComplete="off" value={name} placeholder="Username" /></>
                }
                <input type="email" className={Styles.logincontainerinput} onChange={(event) => setemail(event.target.value)} name="email" id="email" value={email} autoComplete="off" placeholder="Email" />
                <div className={Styles.passdiv}>
                    <input type={`${showpass ? "text" : "password"}`} onChange={(event) => setpassword(event.target.value)} name="password" id="password" value={password} autoComplete="off" placeholder="Password" />
                    <i className={`fa-solid ${showpass ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setshowpass(!showpass)}></i>
                </div>
                {islogin ? null :
                    <>
                        <div className={Styles.passdiv}>
                            <input type={`${showconfirmpass ? "text" : "password"}`} name="confirmpassword" id="confirmpassword" onChange={(event) => setconfirmpassword(event.target.value)} placeholder="Confirm password" autoComplete="off" value={confirmpassword} />
                            <i className={`fa-solid ${showconfirmpass ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setshowconfirmpass(!showconfirmpass)}></i>
                        </div></>}
                {islogin ? <Link className={Styles.linkdis} to={"/forgotpassword"}> <p className={Styles.forgetpass} disabled={isloading} >Forgot password ?</p></Link> : null}
                <button className={Styles.logincontainerbutton} onClick={submit} disabled={isloading} >{isloading ? "Loading..." : islogin ? "Login" : "Signup"}</button>
                <p>{islogin ? "Doesn't have an account ? " : "Already have an account ? "} <span className={Styles.logincontainerspan} onClick={switchmth}>{islogin ? "Signup" : "Login"}</span></p>
                <hr className={Styles.ghr} />

                <  GoogleButton />

            </div> : null
            }
            {isemailverified ? <div className={Styles.verifycontainer}>
                <h1>Verify Email</h1>
                <p>Enter the 6-digit OTP sent to your email address to complete your registration</p>
                <div className={Styles.otpcontainer}>
                    {otp.map((value, index) => <input inputMode="numeric" maxLength={1} placeholder="--" key={index} value={value} autoComplete="off" type="text" className={Styles.otpinp} id={index} onChange={(e) => handleInput(index, e)} onKeyDown={(e) => { handlebck(index, e) }} />)}
                </div>
                <button className={Styles.verbtn} disabled={isloading} onClick={verifyprocess} >{isloading ? "Verifying..." : "Verify"}</button>
            </div> : null}
        </div>
    )
}
export default Login