// Navbar.jsx
import Sidebar from '../SideBar/SideBar';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navbarStyle = {
    marginLeft: sidebarOpen ? "16rem" : "4rem",
    width: sidebarOpen ? "calc(100% - 16rem)" : "calc(100% - 4rem)",
    transition: "margin-left 500ms ease, width 500ms ease",
  };

  return (
    <div
      id="navbar"
      className="col-span-12 h-[3.75rem] bg-gray-700 px-4 flex items-center"
      style={navbarStyle}
    >
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Title />
    </div>
  );
};

const Title = () => <h5 className='title-text text-white'>Liquid Dispenser Client</h5>;

export default Navbar;
