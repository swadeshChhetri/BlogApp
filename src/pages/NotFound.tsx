const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        We can't seem to find the page you're looking for.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
