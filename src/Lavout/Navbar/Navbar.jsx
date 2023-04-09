const Navbar = () => {
    return (
        <div
            id="navbar"
            className="col-span-12 h-[3.75rem] bg-green-400 px-4 flex items-center" 
        >
            <div>Navbar</div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Click me
            </button>
        </div>
    );
};

export default Navbar;
