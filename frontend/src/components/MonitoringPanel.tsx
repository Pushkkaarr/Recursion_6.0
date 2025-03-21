"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Camera, List, AlertTriangle, RefreshCw } from 'lucide-react';
import { io } from 'socket.io-client';

interface MonitoringPanelProps {
  quizActive: boolean;  // Indicates if a quiz is ongoing
}

type Malpractice = {
  type: 'object' | 'movement';
  description: string;
  confidence: number;
  timestamp: string;
};

type ViewType = 'object' | 'activity';

const MonitoringPanel = ({ quizActive }: MonitoringPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [malpractices, setMalpractices] = useState<Malpractice[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<ViewType>('object');

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('malpractice_detection', (data: Malpractice) => {
      setMalpractices((prev) => [data, ...prev].slice(0, 10));
      setLastUpdateTime(Date.now());
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (quizActive) {
      setIsLoading(true);
      setHasError(false);
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [quizActive, activeTab]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const timeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
    return `${seconds}s ago`;
  };

  const renderFeed = (viewType: ViewType) => {
    const feeds: Record<ViewType, { src: string; alt: string; label: string }> = {
      object: {
        src: "http://localhost:5000/object_feed",
        alt: "Object Detection Feed",
        label: "OBJECT • CAM-01"
      },
      activity: {
        src: "http://localhost:5000/activity_feed",
        alt: "Activity Tracking Feed",
        label: "ACTIVITY • CAM-01"
      }
    };

    const currentFeed = feeds[viewType];

    return (
      <div className="relative w-full h-full bg-gray-900">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
            <div className="text-center">
              <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 mx-auto animate-spin mb-4"></div>
              <p className="text-blue-400 font-semibold">Loading {viewType} Feed...</p>
            </div>
          </div>
        )}
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <p className="text-red-500 font-semibold">Error loading feed. Check camera source.</p>
          </div>
        ) : (
          <img
            src={currentFeed.src}
            alt={currentFeed.alt}
            className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
        )}
        <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE</span>
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
          {currentFeed.label}
        </div>
        <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded-md">
          {new Date().toLocaleTimeString()}
        </div>
        {malpractices.length > 0 && (
          <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center animate-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>MALPRACTICE DETECTED</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Proctoring Monitor</h2>
        <div className="flex items-center text-xs text-gray-500">
          <RefreshCw className="h-3 w-3 mr-1" />
          Updated {timeSinceUpdate()}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ViewType)} className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="object" className="flex items-center">
            <Camera className="h-3 w-3 mr-1" />
            <span>Object Detection</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <List className="h-3 w-3 mr-1" />
            <span>Activity Tracking</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="object" className="focus-visible:outline-none focus-visible:ring-0 flex-1 flex flex-col">
          {quizActive && (
            <div className="space-y-2 flex-1 flex flex-col">
              {renderFeed('object')}
              <div className="mt-2">
                <h3 className="text-sm font-medium mb-2">Malpractice Log</h3>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2">
                  {malpractices.map((mal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md text-sm"
                    >
                      <div>
                        <div className="font-medium">{mal.description}</div>
                        <div className="text-xs text-gray-500">{formatTime(mal.timestamp)}</div>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded">
                        {Math.round(mal.confidence * 100)}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="focus-visible:outline-none focus-visible:ring-0 flex-1 flex flex-col">
          {quizActive && (
            <div className="space-y-2 flex-1 flex flex-col">
              {renderFeed('activity')}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringPanel;