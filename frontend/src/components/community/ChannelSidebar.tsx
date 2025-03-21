
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
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Server/Community Header */}
      <div className="h-14 flex items-center px-4 border-b border-gray-200">
        <h1 className="font-semibold text-lg">EduSync Community</h1>
      </div>
      
      {/* User Profile */}
      <div className="mt-1 p-3 mb-2">
        <div className="flex items-center px-2 py-2 rounded-md bg-gray-50 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2 text-sm font-medium overflow-hidden truncate">
            {username}
            {isGuest && <span className="ml-1 text-xs text-gray-500">(Guest)</span>}
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      {/* Channels List */}
      <div className="flex-1 overflow-y-auto px-2">
        {/* Text Channels */}
        <div className="mb-4">
          <div 
            className="flex items-center px-2 py-1 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={() => toggleCategory('text')}
          >
            {expandedCategories.text ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span className="ml-1">TEXT CHANNELS</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setNewChannelType('text');
                setIsCreatingChannel(true);
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {expandedCategories.text && textChannels.map(channel => (
            <div 
              key={channel._id}
              className={`flex items-center px-3 py-1.5 mt-1 rounded-md cursor-pointer text-sm ${
                activeChannelId === channel._id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => onSelectChannel(channel._id)}
            >
              {getChannelIcon(channel.type)}
              <span className="ml-2 truncate">{channel.name}</span>
            </div>
          ))}
        </div>
        
        {/* Voice Channels */}
        <div className="mb-4">
          <div 
            className="flex items-center px-2 py-1 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={() => toggleCategory('voice')}
          >
            {expandedCategories.voice ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span className="ml-1">VOICE CHANNELS</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setNewChannelType('voice');
                setIsCreatingChannel(true);
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {expandedCategories.voice && voiceChannels.map(channel => (
            <div 
              key={channel._id}
              className={`flex items-center px-3 py-1.5 mt-1 rounded-md cursor-pointer text-sm ${
                activeChannelId === channel._id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => onSelectChannel(channel._id)}
            >
              {getChannelIcon(channel.type)}
              <span className="ml-2 truncate">{channel.name}</span>
              {activeChannelId === channel._id && <Users size={16} className="ml-auto" />}
            </div>
          ))}
        </div>
        
        {/* Video Channels */}
        <div className="mb-4">
          <div 
            className="flex items-center px-2 py-1 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={() => toggleCategory('video')}
          >
            {expandedCategories.video ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span className="ml-1">VIDEO CHANNELS</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setNewChannelType('video');
                setIsCreatingChannel(true);
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {expandedCategories.video && videoChannels.map(channel => (
            <div 
              key={channel._id}
              className={`flex items-center px-3 py-1.5 mt-1 rounded-md cursor-pointer text-sm ${
                activeChannelId === channel._id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => onSelectChannel(channel._id)}
            >
              {getChannelIcon(channel.type)}
              <span className="ml-2 truncate">{channel.name}</span>
              {activeChannelId === channel._id && <Users size={16} className="ml-auto" />}
            </div>
          ))}
        </div>
      </div>
      
      {/* Create Channel Dialog */}
      {isCreatingChannel && (
        <div className="p-3 border-t border-gray-200">
          <h3 className="text-sm font-medium mb-2">Create {newChannelType} channel</h3>
          <input 
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="Channel name"
            className="w-full p-2 mb-2 text-sm border border-gray-300 rounded-md"
          />
          <div className="flex justify-between">
            <button 
              onClick={() => setIsCreatingChannel(false)}
              className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateChannel}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </div>
      )}
      
      {/* User Controls */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-around">
          <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600">
            <Mic size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600">
            <Video size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
