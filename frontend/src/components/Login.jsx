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
            <Navbar loggedIn={true}/>
            <form className='log_register' action="/">
                <p id='heading'>Log In</p>
                {/* input for email */}
                <label htmlFor="username"><i className="fa fa-user-o"></i> &nbsp;Username</label>
                <br/>
                <input type="username" name="username" id="username" placeholder="Enter your username" required/>
                <br/>
                {/* input for password */}
                <label htmlFor="password"><i className="fa fa-lock"></i> &nbsp; Password</label>
                <br/>
                <input type="password" name="password" id="password" placeholder="Shh!!, it's secret" required/>
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