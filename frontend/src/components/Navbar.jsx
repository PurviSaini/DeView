import './Navbar.css'
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Navbar(){
    const navigate = useNavigate();
    const handleLogout = async (e)=>{
        e.preventDefault();
        
        try{
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL+ "/logout");
            alert(res.data.message);
            navigate("/");
        
       }
        catch(err){
            alert("Can't Log out the user")
            console.log(err);
        }
    }

    return (
        <nav className='sticky-top'>
            <span>DeView</span>

<Dropdown>
      <Dropdown.Toggle variant="primary" className="no-arrow">
      <i className="fa fa-user-o"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#/action-1">User Profile</Dropdown.Item> */}
        <Dropdown.Item href="#/action-2" onClick={handleLogout}>Log out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
      
        </nav>
    )
}