
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import ChannelSidebar from '@/components/community/ChannelSidebar';
import TextChannel from '@/components/community/TextChannel';
import VideoChannel from '@/components/community/VideoChannel';
import { toast } from 'sonner';

interface Channel {
  _id: string;
  name: string;
  type: 'text' | 'voice' | 'video';
  description?: string;
}

export default function CommunityPage() {
  const { user, isLoaded } = useUser();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string>('Guest');

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        setUsername(user.fullName || user.username || 'User');
      } else {
        // Generate random guest name
        setUsername(`Guest-${Math.floor(Math.random() * 10000)}`);
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    // Fetch channels from API
    const fetchChannels = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/channels`);
        if (!response.ok) {
          throw new Error('Failed to fetch channels');
        }
        
        const data = await response.json();
        setChannels(data);
        
        // Set default active channel to the first text channel
        if (data.length > 0 && !activeChannelId) {
          const firstTextChannel = data.find((channel: Channel) => channel.type === 'text');
          if (firstTextChannel) {
            setActiveChannelId(firstTextChannel._id);
          } else {
            setActiveChannelId(data[0]._id);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching channels:', error);
        toast.error('Failed to load channels. Please try again.');
        
        // For demo purposes, create some default channels if the API fails
        const defaultChannels = [
          { _id: '1', name: 'general', type: 'text' as const },
          { _id: '2', name: 'homework-help', type: 'text' as const },
          { _id: '3', name: 'study-room', type: 'voice' as const },
          { _id: '4', name: 'team-meeting', type: 'video' as const }
        ];
        
        setChannels(defaultChannels);
        if (!activeChannelId) {
          setActiveChannelId('1');
        }
        
        setIsLoading(false);
      }
    };
    
    fetchChannels();
  }, [activeChannelId]);

  // Find the active channel from the channels array
  const activeChannel = channels.find(channel => channel._id === activeChannelId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ChannelSidebar 
        channels={channels}
        activeChannelId={activeChannelId}
        onSelectChannel={setActiveChannelId}
        username={username}
        isGuest={!user}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeChannel?.type === 'text' && (
          <TextChannel 
            channelId={activeChannelId!}
            channelName={activeChannel.name}
            username={username}
            isGuest={!user}
            userId={user?.id}
          />
        )}
        
        {(activeChannel?.type === 'voice' || activeChannel?.type === 'video') && (
          <VideoChannel 
            channelId={activeChannelId!}
            channelName={activeChannel.name}
            username={username}
            isGuest={!user}
            userId={user?.id}
            showVideo={activeChannel.type === 'video'}
          />
        )}
      </main>
    </div>
  );
}
