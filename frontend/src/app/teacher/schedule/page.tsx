'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Hardcoded schedules for demo (replace with your data source)
const schedules: { [key: string]: { title: string; time: string; meetingId?: string }[] } = {
  'user1': [
    { title: 'Math Class', time: '10:00 AM', meetingId: 'math-class' },
    { title: 'Science Class', time: '11:00 AM', meetingId: 'science-class' },
  ],
  'user2': [
    { title: 'English Class', time: '9:00 AM', meetingId: 'english-class' },
    { title: 'History Class', time: '1:00 PM', meetingId: 'history-class' },
  ],
};

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string>(searchParams.get('id') || '');
  const [userSchedule, setUserSchedule] = useState<{ title: string; time: string; meetingId?: string }[]>([]);

  useEffect(() => {
    if (userId && schedules[userId]) {
      setUserSchedule(schedules[userId]);
    } else {
      setUserSchedule([]);
    }
  }, [userId]);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const joinMeeting = (meetingId: string, isInitiator: boolean) => {
    router.push(`/meeting?meetingId=${meetingId}&initiator=${isInitiator}`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Schedule</h1>
      <div className="mb-4">
        <label htmlFor="userId" className="block text-sm font-medium mb-2">
          Enter User ID:
        </label>
        <div className="flex">
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="e.g., user1 or user2"
            className="border p-2 rounded-l w-full"
          />
          <button 
            onClick={() => router.push(`/schedule?id=${userId}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
          >
            Load
          </button>
        </div>
      </div>
      
      {userSchedule.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {userSchedule.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.time}</td>
                  <td className="px-4 py-3 text-center">
                    {item.meetingId && (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => joinMeeting(item.meetingId!, true)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded"
                        >
                          Host
                        </button>
                        <button
                          onClick={() => joinMeeting(item.meetingId!, false)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded"
                        >
                          Join
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded text-center">
          <p>No schedule found for this user ID.</p>
          <p className="text-sm text-gray-500 mt-2">Try "user1" or "user2" for demo data</p>
        </div>
      )}

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Enter a user ID to view your schedule.</li>
          <li>To host a meeting, click the "Host" button next to a class.</li>
          <li>To join a meeting as a participant, click the "Join" button.</li>
          <li>Share the meeting link with others to allow them to join.</li>
        </ol>
      </div>
    </div>
  );
}