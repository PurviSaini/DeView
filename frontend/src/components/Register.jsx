// import './Register.css'
import './Login.css'
import Navbar from './Navbar'
export default function Register(){
    return (
        <div>
            <Navbar/>
            <form action="/">
                <p id='heading'>Register</p>
                {/* input for username */}
                <label for="username"><i class="fa fa-user-o"></i> &nbsp; Username</label>
                <br />
                <input type="text" name="username" id="username" placeholder='Enter Username' required/>
                <br />
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
                <button>Register</button>
                <p>Already registered? <a href="/">Login</a></p>
            </form>
        </div>
    )
}