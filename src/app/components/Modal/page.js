
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    useEffect(() => {
      toast.success('Your slot is confirmed!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }, []);
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-md z-60">
          {children}
          <ToastContainer />
          <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Close
          </button>
        </div>
      </div>
    );
  };
  