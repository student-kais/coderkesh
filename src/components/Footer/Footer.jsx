import React from 'react';
import './Footer.css';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <p className="copyright">
                © {new Date().getFullYear()} Kesh Manknojiya. All rights reserved.
            </p>
            <p className="made-with">
                Made with <FaHeart className="heart" /> and React
            </p>
        </footer>
    );
};

export default Footer;
