
import React from 'react';
import  Link  from 'next/link';
import { Course } from '@/types';
import { formatNumber, formatDuration, formatPrice, getDifficultyColor } from '@/utils/formatUtils';
import { Star, Users, Clock } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard = ({ course, className = '' }: CourseCardProps) => {
  return (
    <Link 
      href={`/course/${course.id}`}
      className={`block animate-scale-in card-hover-effect card-shine ${className}`}
    >
      <div className="relative rounded-xl overflow-hidden h-full glass-card">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.imageUrl} 
            alt={course.title}
            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            loading="lazy"
          />
          {/* Price Tag */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm font-medium text-sm">
              {formatPrice(course.price)}
            </span>
          </div>
          {/* Organization Tag */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm font-medium text-xs">
              {course.organization}
            </span>
          </div>
        </div>
        
        {/* Course Content */}
        <div className="p-5">
          {/* Level Badge */}
          <div className="mb-3">
            <span className={`text-xs font-medium py-1 px-2 rounded-full ${getDifficultyColor(course.level)}`}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 h-14">{course.title}</h3>
          
          {/* Instructor */}
          <p className="text-sm text-gray-600 mb-3">
            Instructor: {course.instructor}
          </p>
          
          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span>{course.rating} ({formatNumber(course.reviews)})</span>
            </div>
            
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{formatNumber(course.enrolled)}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDuration(course.duration, course.durationUnit)}</span>
            </div>
          </div>
          
          {/* Topics */}
          <div className="flex flex-wrap gap-2 mt-3">
            {course.topics.slice(0, 3).map((topic, index) => (
              <span key={index} className="text-xs py-1 px-2 bg-gray-100 rounded-full">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
