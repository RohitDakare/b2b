import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Company */}

          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-teal-400 p-2 rounded-lg">
                <MdLocationOn className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">
                <span className="text-blue-400">Tripar</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-6">
              We help travelers discover amazing destinations, create
              personalized itineraries, and book their dream trips with ease.
              With our extensive network of partners and local experts, we
              ensure authentic and unforgettable travel experiences.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition"
              >
                <FaInstagram className="h-5 w-5" />
              </a>

              <a
                href="#"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Contact Us",
                "FAQ",
                "Privacy Policy",
                "Terms of Service",
                "Careers",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Featured</h4>
            <ul className="space-y-3">
              {[
                "Top Destinations",
                "Travel Deals",
                "Trip Ideas",
                "Travel Guides",
                "Travel Blog",
                "Travel Tips",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MdLocationOn className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-gray-400">
                  789 Travel Avenue, Adventure City, AC 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <MdPhone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">1-800-TRIP-NOW</span>
              </li>
              <li className="flex items-center space-x-3">
                <MdEmail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">support@tripplanning.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TripPlanning. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-500 hover:text-blue-400 text-sm transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-400 text-sm transition"
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-400 text-sm transition"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
