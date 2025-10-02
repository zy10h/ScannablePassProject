import { FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#061a27] text-white">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-[52px] h-[52px] rounded-[12px]"
                    />
                </Link>
                <div className="flex space-x-4">
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-400 rounded-md p-2 hover:bg-white hover:text-[#061a27] transition"
                    >
                        <FaLinkedin size={18} />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-400 rounded-md p-2 hover:bg-white hover:text-[#061a27] transition"
                    >
                        <FaTwitter size={18} />
                    </a>
                </div>
            </div>
            <div className="border-t border-gray-400 my-4" />
            <div className="text-center pb-6 text-sm text-gray-300 px-4">
                Copyright © {new Date().getFullYear()}{" "}
                <span className="font-semibold">Go Vibe</span>. All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;
