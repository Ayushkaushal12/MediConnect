import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">MediConnect</h3>
            <p className="text-gray-400 text-sm">
              Advanced healthcare management platform for modern medical practices.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
                {/* Just link to signup/features for now as placeholders */}
              <li><a href="/register" className="hover:text-blue-400">Join as Patient</a></li>
              <li><a href="/register" className="hover:text-blue-400">Join as Doctor</a></li>
              <li><a href="/login" className="hover:text-blue-400">Admin Access</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/#about" className="hover:text-blue-400">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Get in touch</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contact@mediconnect.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} MediConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
