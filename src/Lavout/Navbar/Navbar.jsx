//Navbar.jsx

// import {
//     FaSearch,
//     FaHashtag,
//     FaRegBell,
//     FaUserCircle,
//     FaMoon,
//     FaSun,
//   } from 'react-icons/fa';

import Sidebar from '../SideBar/SideBar';

const Navbar = ( {sidebarOpen, setSidebarOpen} ) => {
    return (
        <div
            id="navbar"
            className="col-span-12 h-[3.75rem] bg-gray-700 px-4 flex items-center" 
        >
            
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <Title />
        </div>
    );
};



const Title = () => <h5 className='title-text text-white'>Liquid Dispenser Client</h5>;


export default Navbar;
