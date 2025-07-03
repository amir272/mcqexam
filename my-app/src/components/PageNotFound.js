import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => (
    <div className="flex items-center justify-center min-h-screen text-center">
        <div>
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
            <Link to="/manage" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700">
                Go to Dashboard
            </Link>
        </div>
    </div>
);

export default PageNotFound;