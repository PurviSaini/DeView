import './Login.css'
import Navbar from './Navbar'
export default function Login(){
    return (
        <div>
            <Navbar/>
            <form action="/">
                <p id='heading'>Log In</p>
                {/* input for email */}
                <label for="email"><i class="fa fa-envelope-o"></i> &nbsp;Email Address</label>
                <br/>
                <input type="email" name="email" id="e-mail" placeholder="example@gmail.com"/>
                <br/>
                {/* input for password */}
                <label for="password"><i class="fa fa-lock"></i> &nbsp; Password</label>
                <br/>
                <input type="password" name="password" id="passwd" placeholder="Shh!!, it's secret"/>
                <br/>

                <button>Log In</button>
                <p>Don't have an account? <a href="/">Register</a></p>
            </form>
        </div>
    )
}