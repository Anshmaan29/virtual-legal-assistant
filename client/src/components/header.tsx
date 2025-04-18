import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-primary-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-2xl font-bold">DriveWise AI</h1>
          </a>
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/">
            <a className="hover:text-neutral-100 font-medium">Home</a>
          </Link>
          <Link href="/about">
            <a className="hover:text-neutral-100 font-medium">About</a>
          </Link>
          <Link href="/resources">
            <a className="hover:text-neutral-100 font-medium">Resources</a>
          </Link>
          <Link href="/contact">
            <a className="hover:text-neutral-100 font-medium">Contact</a>
          </Link>
        </div>
        <button className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
