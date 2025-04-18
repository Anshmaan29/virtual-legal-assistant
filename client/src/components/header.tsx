import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="primary-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-white p-2 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">DriveWise AI</h1>
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href="/">
            <div className="hover:text-blue-200 font-medium transition-colors cursor-pointer">Home</div>
          </Link>
          <Link href="/about">
            <div className="hover:text-blue-200 font-medium transition-colors cursor-pointer">About</div>
          </Link>
          <Link href="/resources">
            <div className="hover:text-blue-200 font-medium transition-colors cursor-pointer">Resources</div>
          </Link>
          <Link href="/contact">
            <div className="hover:text-blue-200 font-medium transition-colors cursor-pointer">Contact</div>
          </Link>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden animated-button bg-blue-700 p-2 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 py-3">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link href="/">
              <div className="text-white hover:bg-blue-700 px-3 py-2 rounded cursor-pointer">Home</div>
            </Link>
            <Link href="/about">
              <div className="text-white hover:bg-blue-700 px-3 py-2 rounded cursor-pointer">About</div>
            </Link>
            <Link href="/resources">
              <div className="text-white hover:bg-blue-700 px-3 py-2 rounded cursor-pointer">Resources</div>
            </Link>
            <Link href="/contact">
              <div className="text-white hover:bg-blue-700 px-3 py-2 rounded cursor-pointer">Contact</div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
