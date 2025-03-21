
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CourseGrid from '@/components/CourseGrid';
import SectionHeader from '@/components/SectionHeader';
import { Course } from '@/types';
import { searchCourses } from '@/services/courseService';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Course[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  useEffect(() => {
    // If there's an initial query in URL, perform search
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);
  
  const performSearch = async (term: string) => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const searchResults = await searchCourses(term);
      setResults(searchResults);
      
      // Update URL with search term
      setSearchParams({ q: term });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };
  
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <div className="pt-28 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">Search for Courses</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8 animate-fade-in">
              Find the perfect course by searching for topics, skills, or instructors
            </p>
            
            <div className="max-w-2xl mx-auto animate-slide-up">
              <SearchBar 
                onSearch={handleSearch}
                initialValue={searchTerm}
                placeholder="What would you like to learn?"
              />
            </div>
          </div>
          
          {/* Results */}
          <div className="mt-12">
            {hasSearched && (
              <SectionHeader
                title={searchTerm ? `Results for "${searchTerm}"` : "All Courses"}
                subtitle={`${results.length} courses found`}
              />
            )}
            
            {hasSearched ? (
              <CourseGrid 
                courses={results} 
                loading={loading}
                emptyMessage="No courses match your search. Try a different term."
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Enter a search term to find courses
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
