import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-12 px-8 md:px-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-2xl font-extrabold text-red-600 italic">PizzaSaaS</div>
          <p className="text-sm text-gray-400">
            © 2024 PizzaSaaS Kitchen Systems. All rights reserved.
          </p>
        </div>
        
        <div className="flex gap-8">
          {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((link) => (
            <a 
              key={link} 
              href="#" 
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;