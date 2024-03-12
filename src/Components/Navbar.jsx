import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateToSignIn = () => {
        navigate('/signin');
    }

    const navigateToSignUp = () => {
        navigate('/signup');
    }

    return (
        <nav className="navbar-container w-screen h-[69px] flex justify-right align-middle">
            {location.pathname !== '/signin' && (
                <button onClick={navigateToSignIn}
                        className="w-32 h-[50%] bg-gray-800 rounded d mr-5 ml-auto my-auto text-center text-white shadow-xl border-none">
                    Sign In
                </button>
            )}
            {location.pathname !== '/signup' && (
                <button onClick={navigateToSignUp}
                        className="w-32 h-[50%] bg-gray-800 rounded ml-auto mr-5 my-auto text-center text-white shadow-xl border-none">
                    Sign Up
                </button>
            )}
        </nav>
    )
}

export default Navbar;