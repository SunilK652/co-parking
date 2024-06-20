
const Loader = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <div className="loader"></div>
        {/* Add your loader image here */}
        <img src="/loader.gif" alt="Loading..." className="w-20 h-20" />
      </div>
    );
  };
  
  export default Loader;
  