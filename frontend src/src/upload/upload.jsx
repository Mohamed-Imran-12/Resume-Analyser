import { toast } from "react-toastify"
import Styles from "./upload.module.css"
import { useContext, useState } from "react"
import { usercontext } from "../appcontext";
import { useNavigate } from "react-router-dom";
function Uploadpage() {


    const { serviceURL } = useContext(usercontext)
    const navigate=useNavigate()
    const validate = () => {
        var inp = document.getElementById("resume")
        var file = inp.files[0]
        if (!['application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
            toast.error("Upload a resume in pdf/doc format ")
            inp.value = "";
            document.getElementById("indication").textContent = "No file uploaded"
        }
        else if (file.size > 2 * 1024 * 1024) {
            toast.error("Upload a file less than 2MB")
            inp.value = ""
            document.getElementById("indication").textContent = "No file uploaded"
        }
        else {
            var str = file.name;
            if (str.length <= 20) {
                document.getElementById("indication").textContent = str
            }
            else {
                document.getElementById("indication").textContent = str.substring(0, 9) + "..." + str.substring(str.length - 7, str.length)
            }
        }

    }

    const analysedoc = (event) => {
        event.preventDefault()
        var uploadform = document.getElementById("upform")
        var formdata = new FormData(uploadform)
        if (formdata.get("roles").trim() === "") {
            toast.warn("Role must not be empty")
            return;
        }
        if (!formdata.get("file") || !formdata.get("file").name) {
            toast.warn("Please upload the resume")
            return;
        }
        document.getElementById("animate").style.display = "flex";
        fetch(`${serviceURL}/extract`, { method: "post", body: formdata, credentials: "include" }).then(response => {
            if (response.ok) {
                document.getElementById("upform").reset()
                document.getElementById("animate").style.display = "none";
                document.getElementById("indication").textContent = "No file uploaded"
                navigate("/analysereport")
            }
            else {
                document.getElementById("upform").reset()
                toast.error("Irrevelant resume or role")
                document.getElementById("animate").style.display = "none";
                document.getElementById("indication").textContent = "No file uploaded"

            }
        })
            .catch(error => {
                toast.error("Nerwork error")
                document.getElementById("animate").style.display = "none";
            })
    }
    return (
        <div className={Styles.container}>
            <div className={Styles.nav}>
                <h1>Resume Analyser</h1>
                <button onClick={()=>navigate("/")}>Home</button>
            </div>

            <div className={Styles.uploadcontainer}>
                <h2>Upload Resume</h2>
                <form id="upform" encType="multipart/form-data" >
                    <label className={Styles.uploadcontainerlabel} htmlFor="roles" >Role</label>
                    <input type="text" autoComplete="off" placeholder="Ex : Software Engineer " name="roles" id="roles" />
                    <label htmlFor="resume" className={Styles.fileinp}>
                        <p> Upload  your resume here</p>
                        <h5>Select File</h5>
                        <span id="indication" className={Styles.spn}>No file uploaded</span>
                    </label>
                    <input type="file" name="file" onChange={validate} id="resume" hidden accept=".pdf,.doc,.docx" />
                    <button onClick={analysedoc}>Analyse</button>
                </form>
            </div>
            <div className={Styles.guidelinescontainer} >
                <h2>Guidelines</h2>
                <ul>
                    <li><span>File Format: </span>Upload your resume in PDF or DOC/DOCX format only.</li>
                    <li><span>File Size: </span>Ensure your file size is less than 2 MB.</li>
                    <li><span>Language: </span>Upload your resume only in English</li>
                </ul>
            </div>
            <div className={Styles.loadani} id="animate">

                <div className={Styles.loadanimation}>
                    <div className={Styles.capstart}></div>
                    <div className={Styles.loadblock}></div>
                </div>
                <h1>Analysing Resume</h1>

            </div>
        </div>
    )
}

export default Uploadpage