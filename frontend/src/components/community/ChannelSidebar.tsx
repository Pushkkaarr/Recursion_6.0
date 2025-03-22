
'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Video, Mic, Users, ChevronDown, ChevronRight, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Channel {
  _id: string;
  name: string;
  type: 'text' | 'voice' | 'video';
  description?: string;
}

interface ChannelSidebarProps {
  channels: Channel[];
  activeChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
  username: string;
  isGuest: boolean;
}

export default function ChannelSidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  username,
  isGuest
}: ChannelSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState({
    text: true,
    voice: true,
    video: true,
  });
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice' | 'video'>('text');

  // Group channels by type
  const textChannels = channels.filter(channel => channel.type === 'text');
  const voiceChannels = channels.filter(channel => channel.type === 'voice');
  const videoChannels = channels.filter(channel => channel.type === 'video');

  const toggleCategory = (category: 'text' | 'voice' | 'video') => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) {
      toast.error('Please enter a channel name');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newChannelName.trim(),
          type: newChannelType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create channel');
      }

      const newChannel = await response.json();
      toast.success(`${newChannelName} channel created!`);
      
      // Reset form
      setNewChannelName('');
      setIsCreatingChannel(false);
      
      // Select the new channel
      onSelectChannel(newChannel._id);
    } catch (error) {
      console.error('Error creating channel:', error);
      toast.error('Failed to create channel. Please try again.');
    }
  };

  const getChannelIcon = (type: 'text' | 'voice' | 'video') => {
    switch (type) {
      case 'text': return <MessageSquare size={18} />;
      case 'voice': return <Mic size={18} />;
      case 'video': return <Video size={18} />;
    }
  };

  return (
    <aside className="w-72 h-full bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200/60 flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.05)]">
      {/* Server/Community Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <h1 className="font-semibold text-xl text-gray-800 tracking-tight">EduSync Community</h1>
      </div>
  
      {/* User Profile */}
      <div className="mt-3 px-4 mb-3">
        <div className="flex items-center px-4 py-3.5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-medium shadow-sm border-2 border-white">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 text-sm font-medium overflow-hidden truncate">
            <span className="text-gray-800">{username}</span>
            {isGuest && <span className="ml-1.5 text-xs py-0.5 px-1.5 bg-gray-100 rounded-full text-gray-500">(Guest)</span>}
          </div>
          <div className="ml-auto w-3 h-3 rounded-full bg-green-500 shadow-sm ring-2 ring-green-100"></div>
        </div>
      </div>
  
      {/* Channels List */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {/* Text Channels */}
        <div className="mb-6">
          <div
            className="flex items-center px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
            onClick={() => toggleCategory('text')}
          >
            {expandedCategories.text ? <ChevronDown size={18} className="text-blue-500" /> : <ChevronRight size={18} className="text-blue-500" />}
            <span className="ml-2 tracking-wide">TEXT CHANNELS</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNewChannelType('text');
                setIsCreatingChannel(true);
              }}
              className="ml-auto p-1.5 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            >
              <Plus size={16} />
            </button>
          </div>
  
          {expandedCategories.text &&
            textChannels.map((channel) => (
              <div
                key={channel._id}
                className={`flex items-center px-3 py-2.5 mt-1 rounded-xl cursor-pointer text-sm transition-all duration-200 ${
                  activeChannelId === channel._id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm border border-blue-100'
                    : 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => onSelectChannel(channel._id)}
              >
                {getChannelIcon(channel.type)}
                <span className="ml-2.5 truncate font-medium">{channel.name}</span>
              </div>
            ))}
        </div>
  
        {/* Voice Channels */}
        <div className="mb-6">
          <div
            className="flex items-center px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
            onClick={() => toggleCategory('voice')}
          >
            {expandedCategories.voice ? <ChevronDown size={18} className="text-blue-500" /> : <ChevronRight size={18} className="text-blue-500" />}
            <span className="ml-2 tracking-wide">VOICE CHANNELS</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNewChannelType('voice');
                setIsCreatingChannel(true);
              }}
              className="ml-auto p-1.5 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            >
              <Plus size={16} />
            </button>
          </div>
  
          {expandedCategories.voice &&
            voiceChannels.map((channel) => (
              <div
                key={channel._id}
                className={`flex items-center px-3 py-2.5 mt-1 rounded-xl cursor-pointer text-sm transition-all duration-200 ${
                  activeChannelId === channel._id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm border border-blue-100'
                    : 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => onSelectChannel(channel._id)}
              >
                {getChannelIcon(channel.type)}
                <span className="ml-2.5 truncate font-medium">{channel.name}</span>
                {activeChannelId === channel._id && <Users size={16} className="ml-auto text-blue-500" />}
              </div>
            ))}
        </div>
  
        {/* Video Channels */}
        <div className="mb-6">
          <div
            className="flex items-center px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
            onClick={() => toggleCategory('video')}
          >
            {expandedCategories.video ? <ChevronDown size={18} className="text-blue-500" /> : <ChevronRight size={18} className="text-blue-500" />}
            <span className="ml-2 tracking-wide">VIDEO CHANNELS</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNewChannelType('video');
                setIsCreatingChannel(true);
              }}
              className="ml-auto p-1.5 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            >
              <Plus size={16} />
            </button>
          </div>
  
          {expandedCategories.video &&
            videoChannels.map((channel) => (
              <div
                key={channel._id}
                className={`flex items-center px-3 py-2.5 mt-1 rounded-xl cursor-pointer text-sm transition-all duration-200 ${
                  activeChannelId === channel._id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm border border-blue-100'
                    : 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => onSelectChannel(channel._id)}
              >
                {getChannelIcon(channel.type)}
                <span className="ml-2.5 truncate font-medium">{channel.name}</span>
                {activeChannelId === channel._id && <Users size={16} className="ml-auto text-blue-500" />}
              </div>
            ))}
        </div>
      </div>
  
      {/* Create Channel Dialog */}
      {isCreatingChannel && (
        <div className="p-4 border-t border-gray-200/80 bg-white/90 backdrop-blur-md">
          <h3 className="text-sm font-semibold mb-3 text-gray-800">
            Create {newChannelType} channel
          </h3>
          <input
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="Channel name"
            className="w-full p-2.5 mb-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setIsCreatingChannel(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChannel}
              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
            >
              Create
            </button>
          </div>
        </div>
      )}
  
      {/* User Controls */}
      <div className="p-4 border-t border-gray-200/80 bg-white/90 backdrop-blur-md">
        <div className="flex items-center justify-around">
          <button className="p-2.5 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-500 transition-colors duration-200">
            <Mic size={20} />
          </button>
          <button className="p-2.5 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-500 transition-colors duration-200">
            <Video size={20} />
          </button>
          <button className="p-2.5 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-500 transition-colors duration-200">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
  