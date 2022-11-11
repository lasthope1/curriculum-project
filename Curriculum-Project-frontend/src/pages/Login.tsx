import React,{useState} from 'react'
import '../styles/LoginPage.css';
import LoginForm from '../components/Layout/LoginForm'

interface LoginMode {
    studentLogin: boolean
    advicerLogin: boolean
    adminLogin: boolean
}

function Login(){
    const [show, setShow] = useState<LoginMode>({
        studentLogin: true,
        advicerLogin: false,
        adminLogin: false
    });

    function handleLoginForm(event : React.MouseEvent<HTMLAnchorElement>) {
        switch(event.currentTarget.innerText){
            case 'Admin' :  setShow({
                    studentLogin: false,
                    advicerLogin: false,
                    adminLogin: true
                });
                break;
            case 'Advicer' :  setShow({
                    studentLogin: false,
                    advicerLogin: true,
                    adminLogin: false
                });
                break;
            default :  setShow({
                    studentLogin: true,
                    advicerLogin: false,
                    adminLogin: false
                });
                break;
        }
    }

    return (
        <div className='app'>
                <div className='triangle'>
                    <div className='head-wrapper'>
                        <img className="cmu-Logo" src={process.env.PUBLIC_URL+"cmuLogo.png"} />
                        <div style={{margin: 20, marginLeft: 30, color: '#fff'}}>
                            <h1 style={{marginBottom: 15}}>Visualization system for graduation requirement fulfillment</h1>
                            <div className='hor-line'></div>
                            <h3 style={{marginTop: 15}}>ระบบแสดงความคืบหน้าการสำเร็จการศึกษา</h3>
                        </div>
                    </div>
                    <div className = 'block'></div>
                    <div id="Sidenav" className="sidenav">
                        <a id={show.studentLogin ? 'student-active' : 'student'} onClick={handleLoginForm}>Student &emsp; &nbsp; & Advisor</a>
                        <a id={show.adminLogin ? 'admin-active' : 'admin'} onClick={handleLoginForm}>Admin</a>
                    </div>
                </div>
                {   show.studentLogin &&
                    // <a href='http://localhost:3000/auth/cmu'>
                    <a href='https://curriculum-backend.onrender.com/auth/cmu'>
                        <button className='btn-student'>Login with CMU account</button>
                    </a>
                }
                {
                    show.adminLogin &&
                    <LoginForm/>
                }
        </div>
    )
}

export default Login