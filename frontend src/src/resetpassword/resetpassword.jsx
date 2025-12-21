import { useContext, useState, useEffect } from "react"
import Styles from "./resetpassword.module.css"
import { useNavigate } from "react-router-dom"
import { usercontext } from "../appcontext"
import { toast } from "react-toastify"

function Forgotpassword() {
    const navigate = useNavigate()
    const [email, setemail] = useState("")
    const [otp, setotp] = useState(["", "", "", "", "", ""])
    const [newpassword, setnewpassword] = useState("")
    const [confirmpassword, setconfirmpassword] = useState("")
    const [isloading, setisloading] = useState(false)
    const [isemailpresent, setisemailpresent] = useState(false)
    const [isemailverified, setisemailverified] = useState(false)
    const { backendURL, islogged } = useContext(usercontext)
    const [showpass, setshowpass] = useState(false)
    const [showconfirmpass, setshowconfirmpass] = useState(false)

    useEffect(() => {
        if (islogged) {
            navigate("/")
        }
    }, [islogged])

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



    function validateEmail(email) {
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailregex.test(email)
    }

    const verifyemail = () => {
        if (email.trim() === "") {
            toast.warn("Email must not be empty")
            return;
        }
        if (!validateEmail(email.trim())) {
            toast.warn("Invalid Email")
            return;
        }
        setisloading(true)
        fetch(`${backendURL}/resetOtpSent`, { method: "post", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "email": email }) })
            .then(response => {
                if (response.ok) {
                    toast.success("OTP sent successfully")
                    setisloading(false)
                    setisemailpresent(true)
                }
                else {
                    toast.error("Invalid email")
                    setisloading(false)
                }
            })
            .catch(error => {
                toast.error("Verification failed")
                setisloading(false)
            })
    }




    const verifyprocess = () => {
        var enteredOtp = ""
        otp.forEach((i) => enteredOtp += i)
        console.log(enteredOtp)
        if (enteredOtp.length < 6) {
            toast.error("Fill all fields")
            return;
        }
        setisloading(true)
        fetch(`${backendURL}/verifyResetOtp`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "email": email, "otp": enteredOtp })

        })
            .then(response => {
                if (response.ok) {
                    toast.success("Set new password")
                    setisloading(false)
                    setisemailverified(true)

                }
                else {
                    setotp(["", "", "", "", "", ""])
                    toast.error("Invalid OTP")
                    setisloading(false)

                }
            })
            .catch(error => { toast.error("Verification failed"); setisloading(false) })


    }




    const resetpasswordsent = () => {
        var enteredOtp = ""
        otp.forEach((i) => enteredOtp += i)
        if (newpassword.length < 6) {
            toast.warn("Password atLeast have 6 characters")
            return;
        }
        if (!(newpassword === confirmpassword)) {
            toast.warn("Passwords doesn't match")
            return;
        }
        setisloading(true)
        fetch(`${backendURL}/resetPassword`, { method: "post", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "email": email, "otp": enteredOtp, "password": newpassword }) })
            .then(response => {
                if (response.ok) {
                    toast.success("Password changed successfully")
                    setisloading(false)
                    setotp(["", "", "", "", "", ""])
                    setemail("")
                    setnewpassword("")
                    setisemailverified(false)
                    setisemailpresent(false)
                    setshowpass(false)
                    setconfirmpassword("")
                    setshowconfirmpass(false)
                    navigate("/login")

                }
                else {
                    toast.error("Error occured")
                    setisloading(false)
                }
            })
            .catch(error => {
                toast.error("Resetting failed")
                setisloading(false)
            })
    }

    return (
        <div className={Styles.container}>
            <div className={Styles.nav}>
                <h1>Resume Analyser</h1>
            </div>

            {!isemailpresent && !isemailverified ?
                <div className={Styles.mailcontainer}>
                    <h1>Email Address</h1>
                    <input className={Styles.mailcontainerinput} onChange={(event) => setemail(event.target.value)} type="email" name="email" id="email" autoComplete="off" placeholder="Email" />
                    <button onClick={verifyemail} disabled={isloading}>{isloading ? "Loading..." : "Submit"}</button>
                </div> : null}

            {isemailpresent && !isemailverified ?
                <div className={Styles.verifycontainer}>
                    <h1>Verify Email</h1>
                    <p>Enter the 6-digit OTP sent to your email address to complete your verification</p>
                    <div className={Styles.otpcontainer}>
                        {otp.map((value, index) => <input inputMode="numeric" maxLength={1} placeholder="--" key={index} value={value} autoComplete="off" type="text" className={Styles.otpinp} id={index} onChange={(e) => handleInput(index, e)} onKeyDown={(e) => { handlebck(index, e) }} />)}
                    </div>
                    <button onClick={verifyprocess} className={Styles.verbtn} disabled={isloading}  >{isloading ? "Verifying..." : "Verify"}</button>
                </div> : null}

            {isemailpresent && isemailverified ?
                <div className={Styles.mailcontainer}>
                    <h1>Reset Password</h1>
                    <div className={Styles.passdiv}>
                        <input onChange={(event) => setnewpassword(event.target.value)} type={`${showpass ? "text" : "password"}`} name="password" id="password" autoComplete="off" placeholder="New password" />
                        <i className={`fa-solid ${showpass ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setshowpass(!showpass)}></i>
                    </div>
                    <div className={Styles.passdiv}>
                        <input type={`${showconfirmpass ? "text" : "password"}`} name="confirmpassword" id="confirmpassword" onChange={(event) => setconfirmpassword(event.target.value)} placeholder="Confirm password" autoComplete="off" value={confirmpassword} />
                        <i className={`fa-solid ${showconfirmpass ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setshowconfirmpass(!showconfirmpass)}></i>
                    </div>
                    <button onClick={resetpasswordsent} disabled={isloading}>{isloading ? "Changing..." : "Change"}</button>
                </div> : null}
        </div>
    )
}

export default Forgotpassword