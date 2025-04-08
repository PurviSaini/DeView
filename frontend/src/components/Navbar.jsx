import './Navbar.css'

export default function Navbar({loggedIn}){
    return (
        <nav className='sticky-top'>
            <span>DeView</span>
            {loggedIn && <span className='user'><i className="fa fa-user-o"></i></span>}
        </nav>
    )
}