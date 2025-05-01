import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Левая часть: Копирайт */}
                    <div className="mb-4 md:mb-0">
                        <p>&copy; {new Date().getFullYear()} Game Platform. All rights reserved.</p>
                    </div>

                    {/* Центральная часть: Навигационные ссылки */}
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <Link to="/" className="hover:text-gray-300">
                            Home
                        </Link>
                        <Link to="/about" className="hover:text-gray-300">
                            About
                        </Link>
                        <Link to="/contact" className="hover:text-gray-300">
                            Contact
                        </Link>
                        <Link to="/privacy" className="hover:text-gray-300">
                            Privacy Policy
                        </Link>
                    </div>

                    {/* Правая часть: Социальные сети */}
                    <div className="flex space-x-4">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-300"
                        >
                            Twitter
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-300"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-300"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;