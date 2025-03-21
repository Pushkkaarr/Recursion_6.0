
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { FolderX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-36 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="bg-primary/10 rounded-full p-6 mb-6">
              <FolderX className="w-16 h-16 text-primary" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">404</h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-md">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link to="/">
              <Button size="lg" className="px-6">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
