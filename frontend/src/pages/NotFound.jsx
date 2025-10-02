const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100 text-gray-800 text-center">
            <h1 className="text-7xl md:text-9xl font-extrabold text-red-600">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mt-4">
                Page Not Found
            </h2>
            <p className="mt-2 text-base md:text-lg text-gray-600 max-w-md">
                Oops! The page you are looking for doesn’t exist or has been moved.
            </p>
            <a
                href="/"
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm md:text-base"
            >
                Go Back Home
            </a>
        </div>
    );
};

export default NotFound;
