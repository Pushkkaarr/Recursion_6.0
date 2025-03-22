"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, List, RefreshCw, BellRing, Clock, Eye, User } from "lucide-react";
import { io } from "socket.io-client";

type Activity = {
  id: string;
  activity: string;
  timestamp: string;
  type: "INFO" | "WARNING" | "ALERT";
  confidence?: number;
};

const ActivityMonitoringComponent = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [suspiciousCount, setSuspiciousCount] = useState(0);

  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });

    socket.on("connect", () => console.log("Socket.IO connected"));
    socket.on("activity_detection", (data: Activity) => {
      setActivities((prev) => [data, ...prev].slice(0, 10));
      if (data.type === "WARNING" || data.type === "ALERT") setSuspiciousCount((prev) => prev + 1);
      setLastUpdateTime(Date.now());
    });
    socket.on("connect_error", (err) => console.error("Socket.IO error:", err));

    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => {
      clearTimeout(timer);
      socket.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    console.log("Feed loaded");
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Feed error:", e);
    setHasError(true);
    setIsLoading(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  };

  const timeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    return `${seconds}s ago`;
  };

  const renderActivityFeed = () => {
    return (
      <div className="relative w-full h-72 bg-gray-900 rounded-md overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <div className="text-center">
              <div className="border-t-4 border-blue-500 rounded-full w-8 h-8 mx-auto animate-spin mb-4"></div>
              <p className="text-blue-400 font-semibold">Loading activity feed...</p>
            </div>
          </div>
        )}
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <p className="text-red-500 font-semibold">Error loading feed. Check server or camera.</p>
          </div>
        ) : (
          <img
            src={`http://localhost:5000/activity_feed?t=${Date.now()}`}
            alt="Activity Detection Feed"
            className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE</span>
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">ACTIVITY DETECTION</div>
        {suspiciousCount > 0 && (
          <div
            className={`absolute bottom-2 right-2 ${suspiciousCount > 2 ? "bg-red-500" : "bg-yellow-500"} text-white text-xs px-2 py-1 rounded-md flex items-center ${suspiciousCount > 2 ? "animate-pulse" : ""}`}
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>{suspiciousCount > 2 ? "SUSPICIOUS ACTIVITY" : "CAUTION"}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Activity Monitoring</CardTitle>
          <div className="flex items-center text-xs text-gray-500">
            <RefreshCw className="h-3 w-3 mr-1" />
            Updated {timeSinceUpdate()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <List className="h-5 w-5" />
              <h3 className="font-medium">Activity Detection</h3>
            </div>
            {renderActivityFeed()}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center">
                <BellRing className="h-4 w-4 mr-2" />
                Detected Activities
              </h3>
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Last 30 minutes
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activities.length > 0 ? (
                activities.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center justify-between p-2 rounded-md text-sm ${
                      event.type === "ALERT" ? "bg-red-50 dark:bg-red-900/20" :
                      event.type === "WARNING" ? "bg-yellow-50 dark:bg-yellow-900/20" :
                      "bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-1 rounded mr-2 ${
                          event.type === "ALERT" ? "bg-red-100 dark:bg-red-800" :
                          event.type === "WARNING" ? "bg-yellow-100 dark:bg-yellow-800" :
                          "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {event.activity.toLowerCase().includes("multiple") ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{event.activity}</div>
                        <div className="text-xs text-gray-500">{formatTime(event.timestamp)}</div>
                      </div>
                    </div>
                    {event.confidence && (
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          event.type === "ALERT" ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200" :
                          event.type === "WARNING" ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200" :
                          "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                        }`}
                      >
                        {Math.round(event.confidence * 100)}%
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No activities detected yet</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityMonitoringComponent;