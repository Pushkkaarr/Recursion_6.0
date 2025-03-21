"use client"; // Required for client-side hooks

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { User, UserIcon, Mail, AlertCircle, LayoutDashboard, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  const handleAction = () => {
    alert("Coming Soon: This feature will be available in the next update!");
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 opacity-30 animate-pulse"></div>
          <LayoutDashboard className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
        </div>
        <p className="text-indigo-700 mt-4 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="w-16 h-16 relative mb-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-red-500">Please sign in to access the dashboard</p>
        <Button variant="destructive" className="mt-6">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-purple-100">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <div className="flex items-center space-x-2 bg-white/80 p-2 px-4 rounded-full shadow-sm border border-purple-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700">{user?.firstName || "User"}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Profile Overview</h3>
              <User className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-gray-600">
                  {user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-gray-600">{user?.emailAddresses[0]?.emailAddress || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Account Details</h3>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-sm text-gray-500 mb-3">User ID</p>
            <div className="p-3 bg-indigo-50 rounded-lg text-xs font-mono text-indigo-700 break-all">
              {userId}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Quick Actions</h3>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              onClick={handleAction}
            >
              Perform Action
            </Button>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-purple-100">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            Welcome, {user?.firstName || "User"}!
          </h2>
          <p className="text-gray-600 mb-3">
            This is your personal dashboard where you can manage your account and access various features.
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-700">
              <span className="font-medium">Pro Tip:</span> Explore the quick actions panel to discover more functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}