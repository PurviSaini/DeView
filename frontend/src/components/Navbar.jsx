import './Navbar.css'
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar({ title }){
    const navigate = useNavigate();
    const handleLogout = async (e)=>{
        e.preventDefault();
        
        try{
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL+ "/logout",{},{withCredentials: true});
            toast.success("You are logged out!");
            localStorage.removeItem('username');
            navigate("/");
        
       }
        catch(err){
            toast.error("Can't Log out the user")
            console.log(err);
        }
    }

    const handleTeamView = (e) => {
        e.preventDefault();
        navigate('/team-profile');
    }

    return (
        <nav className='sticky-top'>
            <span>{ title || "DeView" }</span>

<Dropdown className='drop-css'>
      <Dropdown.Toggle variant="primary" className="no-arrow">
      <i className="fa fa-user-o"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#/action-1">User Profile</Dropdown.Item> */}
        <Dropdown.Item href="#" onClick={handleTeamView}>View Team Profile</Dropdown.Item>
        <Dropdown.Item href="#/action-2" onClick={handleLogout}>Log out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
      <ToastContainer />
        </nav>
    )
}