"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X, MessageCircle } from "lucide-react";
import Chatbot from "./Chatbot";

const Navbar = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-white tracking-tight hover:text-indigo-200 transition-colors duration-200"
          >
            Family Connect
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white font-medium hover:text-indigo-300 transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard"
              className="text-white font-medium hover:text-indigo-300 transition-colors duration-200 relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="text-white font-medium hover:text-indigo-300 transition-colors duration-200 flex items-center space-x-1 relative group"
            >
              <MessageCircle size={18} />
              <span>Chatbot</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "border-2 border-indigo-300 rounded-full",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-indigo-300 focus:outline-none transition-colors duration-200"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-900/95 backdrop-blur-md px-6 py-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white font-medium hover:text-indigo-300 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-white font-medium hover:text-indigo-300 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsChatbotOpen(true);
                  setIsMenuOpen(false);
                }}
                className="text-white font-medium hover:text-indigo-300 transition-colors duration-200 flex items-center space-x-1"
              >
                <MessageCircle size={18} />
                <span>Chatbot</span>
              </button>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 w-full text-left"
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-start">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "border-2 border-indigo-300 rounded-full",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </nav>
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
};

export default Navbar;