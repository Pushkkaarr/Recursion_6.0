"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, MessageCircle, BookOpen } from "lucide-react";
import Chatbot from "./Chatbot";

const Navbar = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  // Generate dashboard link with user ID if available
  const dashboardLink = user ? `/dashboard/${user.id}` : "/dashboard";

  return (
    <>
      <nav className="bg-primary text-primary-foreground shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:text-accent-foreground transition-colors duration-200 flex items-center gap-2"
          >
            <BookOpen size={24} />
            EduSync
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="font-medium hover:text-accent transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href={dashboardLink}
              className="font-medium hover:text-accent transition-colors duration-200 relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/teacher"
              className="font-medium hover:text-accent transition-colors duration-200 relative group"
            >
              Teacher
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="font-medium hover:text-accent transition-colors duration-200 flex items-center space-x-1 relative group"
            >
              <MessageCircle size={18} />
              <span>Learning Assistant</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </button>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-all duration-200 shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "border-2 border-accent rounded-full",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:text-accent focus:outline-none transition-colors duration-200"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary/95 backdrop-blur-md px-6 py-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="font-medium hover:text-accent transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href={dashboardLink}
                onClick={() => setIsMenuOpen(false)}
                className="font-medium hover:text-accent transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/teacher"
                onClick={() => setIsMenuOpen(false)}
                className="font-medium hover:text-accent transition-colors duration-200"
              >
                Teacher
              </Link>
              
              <button
                onClick={() => {
                  setIsChatbotOpen(true);
                  setIsMenuOpen(false);
                }}
                className="font-medium hover:text-accent transition-colors duration-200 flex items-center space-x-1"
              >
                <MessageCircle size={18} />
                <span>Learning Assistant</span>
              </button>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-all duration-200 w-full text-left"
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
                        avatarBox: "border-2 border-accent rounded-full",
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