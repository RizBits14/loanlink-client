import React from 'react';
// import errorImage from '../assets/404-error.jpg';
import errorImg from "../assets/errorImg/errorImg.jpg"
import { Link } from 'react-router';

const Error404Page = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10 text-center md:text-left">

            <img
                src={errorImg}
                alt="404 Error"
                className="w-full md:w-1/2 max-w-md rounded-lg shadow-lg mb-6 md:mb-0 md:mr-10 object-contain animate-bounce"
            />

            <div className="flex flex-col items-center md:items-start">

                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-3 animate-pulse">
                    Oops! You broke the Internet 😂
                </h1>

                <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6 text-sm md:text-base">
                    Looks like the page you’re looking for has gone on vacation 🏖️
                </p>

                <Link to="/" className="px-6 py-3 rounded-xl text-black font-medium bg-accent hover:opacity-90 transition duration-300">
                    Back to Home
                </Link>

            </div>
        </div>
    );
};

export default Error404Page;