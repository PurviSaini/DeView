import { useNavigate, NavLink } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import './Login.css'
import Navbar from './Navbar'

export default function Login(){
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try{
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL+ "/login", {
            username: username,
            password: password
        },{withCredentials: true});
        alert(res.data.message);
        localStorage.setItem('username', username);
        const teamCode = res.data.teamCode;
        if(teamCode) {
            navigate('/task');
        } else {
            navigate('/team');
        }
        
       }
        catch(err){
            alert("Can't Login! Invalid Credentials.");
            console.log(err);
        }
    };
    return (
        <div>
            <form className='log_register' action="/">
                <p id='heading'>Log In</p>
                {/* input for email */}
                <label htmlFor="username"><i className="fa fa-user-o"></i> &nbsp;Username</label>
                <br/>
                <input type="username" value={username} onChange={(e) => {setUsername(e.target.value)}} name="username" id="username" placeholder="Enter your username" required/>
                <br/>
                {/* input for password */}
                <label htmlFor="password"><i className="fa fa-lock"></i> &nbsp; Password</label>
                <br/>
                <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} name="password" id="password" placeholder="Shh!!, it's secret" required/>
                <br/>

                <button onClick={handleLogin}>Log In</button>
                <p>Don't have an account? &nbsp;
                    <NavLink to="/register" className="register-btn">
                        Register
                    </NavLink>
                </p>
            </form>
        </div>
    )
}