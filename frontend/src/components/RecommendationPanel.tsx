
import React, { useState } from 'react';
import { UserPreferences, CourseLevel } from '@/types';
import { getRecommendedCourses } from '@/services/courseService';
import { toast } from '@/components/ui/use-toast';
import { Check, Sparkles } from 'lucide-react';

interface RecommendationPanelProps {
  onRecommendationsReceived: (courses: any[]) => void;
}

const RecommendationPanel = ({ onRecommendationsReceived }: RecommendationPanelProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: [],
    level: 'beginner',
    preferredDuration: 'medium',
    preferredPrice: 'all'
  });
  
  const [interest, setInterest] = useState('');
  
  const handleAddInterest = () => {
    if (interest.trim() && !preferences.interests.includes(interest.trim())) {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, interest.trim()]
      });
      setInterest('');
    }
  };
  
  const handleRemoveInterest = (item: string) => {
    setPreferences({
      ...preferences,
      interests: preferences.interests.filter(i => i !== item)
    });
  };
  
  const handleLevelChange = (level: CourseLevel) => {
    setPreferences({ ...preferences, level });
  };
  
  const handleDurationChange = (duration: string) => {
    setPreferences({ ...preferences, preferredDuration: duration });
  };
  
  const handlePriceChange = (price: 'free' | 'paid' | 'all') => {
    setPreferences({ ...preferences, preferredPrice: price });
  };
  
  const handleNext = () => {
    if (step === 1 && preferences.interests.length === 0) {
      toast({
        title: "Please add at least one interest",
        description: "We need to know what you're interested in to provide recommendations.",
        variant: "destructive"
      });
      return;
    }
    
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const recommendations = await getRecommendedCourses(preferences);
      onRecommendationsReceived(recommendations);
      toast({
        title: "Recommendations ready!",
        description: "We've found some courses that match your preferences.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 max-w-md w-full mx-auto animate-scale-in">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-primary/10 p-2 rounded-full">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold ml-3">Personalized Recommendations</h2>
      </div>
      
      {step === 1 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">What are you interested in learning?</h3>
          
          <div className="flex mb-4">
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="e.g., Python, Data Science, UX Design"
              className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
            />
            <button
              onClick={handleAddInterest}
              className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>
          
          {preferences.interests.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Your interests:</p>
              <div className="flex flex-wrap gap-2">
                {preferences.interests.map((item, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {item}
                    <button 
                      onClick={() => handleRemoveInterest(item)}
                      className="ml-2 text-primary/70 hover:text-primary"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {step === 2 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">What's your experience level?</h3>
          
          <div className="space-y-3 mb-6">
            {(['beginner', 'intermediate', 'advanced'] as CourseLevel[]).map((level) => (
              <button
                key={level}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  preferences.level === level
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => handleLevelChange(level)}
              >
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  preferences.level === level
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300'
                }`}>
                  {preferences.level === level && <Check size={14} />}
                </div>
                <span className="capitalize">{level}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">How much time can you commit?</h3>
          
          <div className="space-y-3 mb-6">
            {[
              { label: 'Short courses (< 4 weeks)', value: 'short' },
              { label: 'Medium courses (4-8 weeks)', value: 'medium' },
              { label: 'Long courses (> 8 weeks)', value: 'long' }
            ].map((option) => (
              <button
                key={option.value}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  preferences.preferredDuration === option.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => handleDurationChange(option.value)}
              >
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  preferences.preferredDuration === option.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300'
                }`}>
                  {preferences.preferredDuration === option.value && <Check size={14} />}
                </div>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {step === 4 && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Do you prefer free or paid courses?</h3>
          
          <div className="space-y-3 mb-6">
            {[
              { label: 'Free courses only', value: 'free' },
              { label: 'Paid courses only', value: 'paid' },
              { label: 'Both free and paid', value: 'all' }
            ].map((option) => (
              <button
                key={option.value}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  preferences.preferredPrice === option.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => handlePriceChange(option.value as 'free' | 'paid' | 'all')}
              >
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  preferences.preferredPrice === option.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300'
                }`}>
                  {preferences.preferredPrice === option.value && <Check size={14} />}
                </div>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 bg-primary text-white rounded-lg transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            {loading ? 'Generating...' : 'Get Recommendations'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendationPanel;
