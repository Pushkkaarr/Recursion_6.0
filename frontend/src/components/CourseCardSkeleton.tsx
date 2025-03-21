
import React from 'react';

const CourseCardSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`rounded-xl overflow-hidden h-full glass-card animate-pulse ${className}`}>
      {/* Image Placeholder */}
      <div className="h-48 bg-gray-200" />
      
      <div className="p-5">
        {/* Level Badge Placeholder */}
        <div className="w-20 h-6 bg-gray-200 rounded-full mb-3" />
        
        {/* Title Placeholder */}
        <div className="w-full h-6 bg-gray-200 rounded mb-2" />
        <div className="w-3/4 h-6 bg-gray-200 rounded mb-3" />
        
        {/* Instructor Placeholder */}
        <div className="w-1/2 h-4 bg-gray-200 rounded mb-3" />
        
        {/* Stats Row Placeholder */}
        <div className="flex justify-between mb-4">
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </div>
        
        {/* Topics Placeholder */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="w-16 h-6 bg-gray-200 rounded-full" />
          <div className="w-20 h-6 bg-gray-200 rounded-full" />
          <div className="w-12 h-6 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
