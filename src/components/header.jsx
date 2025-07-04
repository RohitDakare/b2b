import { useState, useRef, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPlane,
  FaBlog,
  FaPhone,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import SignIn from "./signin";
import SignUp from "./signup";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showSigninPopup, setShowSigninPopup] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const popupRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleContactPopup = () => setShowContactPopup(!showContactPopup);

  const handleScrollToBlog = (e) => {
    e.preventDefault();
    const section = document.getElementById("testimonial-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false); // close mobile menu if open
    }
  };

  const navItems = [
    { name: "Flights", icon: <FaPlane className="w-5 h-5" />, link: "#" },
    { name: "Blogs", icon: <FaBlog className="w-5 h-5" />, scrollTo: "testimonial-section" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSigninPopup &&
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        setShowSigninPopup(false);
        setIsSignUpMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSigninPopup]);

  return (
    <header className="w-full bg-white shadow-md relative z-50">
      <div className="w-full mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-teal-400 p-2 rounded-lg">
              <FaMapMarkerAlt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                <span className="text-blue-600">Tripar</span>
              </h1>
              <p className="text-xs text-gray-500">THINK LESS, TRAVEL MORE</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 relative">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link || "#"}
                onClick={item.scrollTo ? handleScrollToBlog : undefined}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}

            {/* Contact with Popup */}
            <div className="relative">
              <button
                onClick={toggleContactPopup}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium"
              >
                <FaPhone className="w-5 h-5" />
                <span>Contact</span>
              </button>

              {showContactPopup && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50">
                  <p className="text-sm text-gray-700">
                    📧 <strong>Email:</strong> support@tripar.com
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    📞 <strong>Phone:</strong> +91 98765 43210
                  </p>
                </div>
              )}
            </div>
          </nav>

          {/* Account Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setShowSigninPopup(true)}
              className="text-gray-600 hover:text-blue-600 font-medium text-sm"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setShowSigninPopup(true);
                setIsSignUpMode(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full transition"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center text-gray-700"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 absolute w-full left-0 shadow-lg z-50">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-4">
            {[
              ...navItems,
              { name: "Contact", icon: <FaPhone className="w-5 h-5" /> },
            ].map((item, index) => (
              <div key={index}>
                {item.name === "Contact" ? (
                  <div className="space-y-2">
                    <button
                      onClick={toggleContactPopup}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium w-full text-left"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                    {showContactPopup && (
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
                        <p>
                          📧 <strong>Email:</strong> support@tripar.com
                        </p>
                        <p>
                          📞 <strong>Phone:</strong> +91 98765 43210
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.link || "#"}
                    onClick={item.scrollTo ? handleScrollToBlog : undefined}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                )}
              </div>
            ))}

            {/* Mobile Account Buttons */}
            <div className="flex space-x-2 pt-4">
              <button
                onClick={() => setShowSigninPopup(true)}
                className="flex-1 text-center border border-gray-300 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowSigninPopup(true);
                  setIsSignUpMode(true);
                }}
                className="flex-1 text-center bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Signin/Signup Popup */}
      {showSigninPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative" ref={popupRef}>
            <button
              onClick={() => {
                setShowSigninPopup(false);
                setIsSignUpMode(false);
              }}
              className="absolute -top-4 -right-4 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            >
              &times;
            </button>

            {isSignUpMode ? (
              <SignUp switchToSignIn={() => setIsSignUpMode(false)} />
            ) : (
              <SignIn switchToSignUp={() => setIsSignUpMode(true)} />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
