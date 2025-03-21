
import React from 'react';
import { Course } from '@/types';
import CourseCard from './CourseCard';
import CourseCardSkeleton from './CourseCardSkeleton';

interface CourseGridProps {
  courses: Course[];
  loading?: boolean;
  emptyMessage?: string;
  columns?: number;
}

const CourseGrid = ({ 
  courses, 
  loading = false, 
  emptyMessage = 'No courses found',
  columns = 3
}: CourseGridProps) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  
  if (loading) {
    return (
      <div className={`grid ${gridClasses} gap-6`}>
        {[...Array(6)].map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className={`grid ${gridClasses} gap-6 animate-fade-stagger`}>
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
