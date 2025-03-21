
import React, { useState, useEffect } from 'react';
import { FilterOptions, CourseLevel } from '@/types';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { getAllTopics } from '@/services/courseService';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
}

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchTopics = async () => {
      const topics = await getAllTopics();
      setAvailableTopics(topics);
    };
    
    fetchTopics();
  }, []);
  
  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };
  
  const handleLevelChange = (level: CourseLevel | 'all') => {
    onFilterChange({ ...filters, level });
  };
  
  const handlePaidChange = (isPaid: boolean | null) => {
    onFilterChange({ ...filters, isPaid });
  };
  
  const handleDurationChange = (duration: string | null) => {
    onFilterChange({ ...filters, duration });
  };
  
  const handleTopicChange = (topic: string) => {
    const updatedTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic];
    
    onFilterChange({ ...filters, topics: updatedTopics });
  };
  
  return (
    <div className="animate-fade-in glass-panel rounded-xl p-5 divide-y divide-gray-200">
      <div className="pb-4">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
      </div>
      
      {/* Level Filter */}
      <div className="py-4">
        <button 
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleSection('level')}
        >
          <h4 className="font-medium">Level</h4>
          {expanded === 'level' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expanded === 'level' && (
          <div className="mt-3 space-y-2 animate-slide-down">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                className={`flex items-center w-full p-2 rounded-md transition-colors ${
                  filters.level === level
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleLevelChange(level as CourseLevel | 'all')}
              >
                <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                  filters.level === level
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300'
                }`}>
                  {filters.level === level && <Check size={12} />}
                </div>
                <span className="capitalize">{level}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Filter */}
      <div className="py-4">
        <button 
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleSection('price')}
        >
          <h4 className="font-medium">Price</h4>
          {expanded === 'price' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expanded === 'price' && (
          <div className="mt-3 space-y-2 animate-slide-down">
            {[
              { label: 'All', value: null },
              { label: 'Free', value: false },
              { label: 'Paid', value: true }
            ].map((option) => (
              <button
                key={option.label}
                className={`flex items-center w-full p-2 rounded-md transition-colors ${
                  filters.isPaid === option.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handlePaidChange(option.value)}
              >
                <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                  filters.isPaid === option.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300'
                }`}>
                  {filters.isPaid === option.value && <Check size={12} />}
                </div>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Duration Filter */}
      <div className="py-4">
        <button 
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleSection('duration')}
        >
          <h4 className="font-medium">Duration</h4>
          {expanded === 'duration' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expanded === 'duration' && (
          <div className="mt-3 space-y-2 animate-slide-down">
            {[
              { label: 'Any', value: null },
              { label: 'Short (< 4 weeks)', value: 'short' },
              { label: 'Medium (4-8 weeks)', value: 'medium' },
              { label: 'Long (> 8 weeks)', value: 'long' }
            ].map((option) => (
              <button
                key={option.label}
                className={`flex items-center w-full p-2 rounded-md transition-colors ${
                  filters.duration === option.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleDurationChange(option.value)}
              >
                <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                  filters.duration === option.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300'
                }`}>
                  {filters.duration === option.value && <Check size={12} />}
                </div>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Topics Filter */}
      <div className="py-4">
        <button 
          className="flex items-center justify-between w-full text-left"
          onClick={() => toggleSection('topics')}
        >
          <h4 className="font-medium">Topics</h4>
          {expanded === 'topics' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {expanded === 'topics' && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto animate-slide-down">
            {availableTopics.map((topic) => (
              <button
                key={topic}
                className={`flex items-center w-full p-2 rounded-md transition-colors ${
                  filters.topics.includes(topic)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleTopicChange(topic)}
              >
                <div className={`w-4 h-4 rounded mr-2 flex items-center justify-center ${
                  filters.topics.includes(topic)
                    ? 'bg-primary text-white'
                    : 'border border-gray-300'
                }`}>
                  {filters.topics.includes(topic) && <Check size={12} />}
                </div>
                <span>{topic}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Clear All Filters */}
      <div className="pt-4">
        <button
          className="text-sm text-primary font-medium hover:underline"
          onClick={() => onFilterChange({
            ...filters,
            level: 'all',
            isPaid: null,
            duration: null,
            topics: []
          })}
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
