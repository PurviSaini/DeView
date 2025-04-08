// import './Register.css'
import { NavLink } from 'react-router-dom'
import './Login.css'
import Navbar from './Navbar'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register(){
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e)=>{
        e.preventDefault();
        
        try{
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL+ "/signup", {
            username: username,
            email: email,
            password: password
        })
        alert(res.data.message);
            navigate("/");
        
       }
        catch(err){
            alert("Can't Register the user")
            console.log(err);
        }
    }
    return (
        <div>
            <form>
                <p id='heading'>Register</p>
                {/* input for username */}
                <label htmlFor="username"><i className="fa fa-user-o"></i> &nbsp; Username</label>
                <br />
                <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} name="username" id="username" placeholder='Enter Username' required/>
                <br />
                {/* input for email */}
                <label htmlFor="email"><i className="fa fa-envelope-o"></i> &nbsp;Email Address</label>
                <br/>
                <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} name="email" id="e-mail" placeholder="example@gmail.com" required/>
                <br/>
                {/* input for password */}
                <label htmlFor="password"><i className="fa fa-lock"></i> &nbsp; Password</label>
                <br/>
                <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} name="password" id="passwd" placeholder="Shh!!, it's secret" required/>
                <br/>
                <button onClick={handleRegister}>Register</button>
                <p>Already registered? &nbsp;
                    <NavLink to="/" className="login-btn">
                    Login
                    </NavLink>
                </p>
            </form>
        </div>
    )
}