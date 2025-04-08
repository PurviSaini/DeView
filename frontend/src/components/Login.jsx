import { useNavigate, NavLink } from 'react-router-dom'
import './Login.css'
import Navbar from './Navbar'

export default function Login(){
    const navigate = useNavigate();
    const handleLogin = () => {
        const teamCode = "";
        if(teamCode) {
            navigate('/task');
        } else {
            navigate('/team');
        }
    };
    return (
        <div>
            <Navbar/>
            <form class='log_register' action="/">
                <p id='heading'>Log In</p>
                {/* input for email */}
                <label for="email"><i class="fa fa-envelope-o"></i> &nbsp;Email Address</label>
                <br/>
                <input type="email" name="email" id="e-mail" placeholder="example@gmail.com" required/>
                <br/>
                {/* input for password */}
                <label for="password"><i class="fa fa-lock"></i> &nbsp; Password</label>
                <br/>
                <input type="password" name="password" id="passwd" placeholder="Shh!!, it's secret" required/>
                <br/>

                <button onClick={handleLogin}>Log In</button>
                <p>Don't have an account? <a href="/">
                    <NavLink to="/register" className="register-btn">
                        Register
                    </NavLink>
                </a></p>
            </form>
        </div>
    )
}