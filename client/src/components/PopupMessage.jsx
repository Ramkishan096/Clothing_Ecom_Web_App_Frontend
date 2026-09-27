import React, { useState, useEffect } from 'react';
import './PopupMessage.css';

const PopupMessage = ({ message }) => {  // Destructure props to get message
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        setShowPopup(true);

        const timer = setTimeout(() => {
            setShowPopup(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {showPopup && (
                <div className="otp-popup">
                    {message}
                </div>
            )}
        </>
    );
};

export default PopupMessage;