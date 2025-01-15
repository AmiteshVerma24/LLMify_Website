import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 px-32 mt-32 border-t-gray-800 border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Left Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            {/* Placeholder for logo */}
            <div className="h-8 w-8 bg-gray-700 rounded-full" />
            <div>
              <h1 className="text-xl font-semibold">SmartSnip</h1>
              <p className="text-sm text-gray-400">Boost your productivity and make every click count</p>
            </div>
          </div>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            {/* Replace these with actual icons */}
            <div className="h-6 w-6 bg-gray-700 rounded-full" />
            <div className="h-6 w-6 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col space-y-16">
        <div className="flex space-x-12">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase text-gray-400">Product</h2>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-gray-300 hover:underline">Email Collection</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:underline">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase text-gray-400">Community</h2>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-gray-300 hover:underline">Discord</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:underline">Twitter</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:underline">Email</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase text-gray-400">Legal</h2>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-gray-300 hover:underline">Terms</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:underline">Privacy</a></li>
            </ul>
          </div>
        </div>
            {/* Copyright Section */}
        <div className="text-center md:text-right text-gray-400 text-sm">
          &copy; 2024 Magic UI. All Rights Reserved.
        </div>
        </div>
        

      </div>
    </footer>
  );
};


