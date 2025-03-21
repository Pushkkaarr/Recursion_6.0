
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import CourseGrid from '@/components/CourseGrid';
import SectionHeader from '@/components/SectionHeader';
import { FilterOptions, Course } from '@/types';
import { fetchCourses, filterCourses } from '@/services/courseService';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Browse = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    level: 'all',
    isPaid: null,
    duration: null,
    topics: []
  });
  
  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      try {
        const allCourses = await fetchCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllCourses();
  }, []);
  
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      try {
        const filteredCourses = await filterCourses(filters);
        setCourses(filteredCourses);
      } catch (error) {
        console.error('Failed to filter courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    applyFilters();
  }, [filters]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const handleSearch = (term: string) => {
    setFilters({ ...filters, search: term });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Calculate if any filters are applied
  const hasActiveFilters = 
    filters.level !== 'all' || 
    filters.isPaid !== null || 
    filters.duration !== null || 
    filters.topics.length > 0;
  
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <div className="pt-28 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Search Bar and Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <SearchBar 
              onSearch={handleSearch} 
              initialValue={filters.search}
              className="flex-1"
            />
            
            {isMobile && (
              <Button 
                variant={hasActiveFilters ? "default" : "outline"} 
                onClick={toggleFilters}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-primary text-xs">
                    {filters.topics.length + 
                     (filters.level !== 'all' ? 1 : 0) + 
                     (filters.isPaid !== null ? 1 : 0) + 
                     (filters.duration !== null ? 1 : 0)}
                  </span>
                )}
              </Button>
            )}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Panel */}
            {showFilters && (
              <div className="lg:w-1/4">
                <FilterPanel 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
            
            {/* Course Grid */}
            <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
              <SectionHeader
                title="Browse Courses"
                subtitle={`${courses.length} courses available`}
              />
              
              <CourseGrid 
                courses={courses} 
                loading={loading}
                emptyMessage="No courses match your filters. Try adjusting your search criteria."
                columns={showFilters ? 2 : 3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
