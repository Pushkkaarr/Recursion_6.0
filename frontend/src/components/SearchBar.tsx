
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  onSearch, 
  initialValue = '', 
  placeholder = 'Search for courses...', 
  className = ''
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Update search term if initialValue changes
    setSearchTerm(initialValue);
  }, [initialValue]);
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    inputRef.current?.focus();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative group ${className}`}
    >
      <div className={`
        relative flex items-center transition-all duration-300
        ${isFocused ? 'scale-[1.02]' : 'scale-100'}
      `}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className={`
            search-input pr-10 pl-10
            ${isFocused ? 'ring-2 ring-primary/20 shadow-lg' : ''}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <Search 
          className={`absolute left-3 w-5 h-5 transition-colors duration-300
            ${isFocused ? 'text-primary' : 'text-gray-400'}
          `}
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
