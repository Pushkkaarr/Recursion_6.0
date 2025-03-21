
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BookOpen, Users, Award } from 'lucide-react';
import Header from '@/components/Header';
import CourseGrid from '@/components/CourseGrid';
import SectionHeader from '@/components/SectionHeader';
import RecommendationPanel from '@/components/RecommendationPanel';
import { Course } from '@/types';
import { getTopCourses, getCoursesByTopic } from '@/services/courseService';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [topCourses, setTopCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [showRecommendationPanel, setShowRecommendationPanel] = useState(false);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const courses = await getTopCourses();
        setTopCourses(courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  const handleRecommendationsReceived = (courses: Course[]) => {
    setRecommendedCourses(courses);
    setShowRecommendationPanel(false);
  };
  
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 animate-fade-in">
              <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>AI-Powered Course Recommendations</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover your perfect learning path
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Explore top-rated courses tailored to your interests, skill level, and learning preferences with our AI recommendation system.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="px-6 text-base transition-all hover:translate-y-[-2px]"
                  onClick={() => setShowRecommendationPanel(true)}
                >
                  Get personalized recommendations
                </Button>
                
                <Link to="/browse">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-6 text-base flex items-center gap-2 transition-all hover:translate-y-[-2px]"
                  >
                    Browse all courses
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 animate-slide-up">
              {showRecommendationPanel ? (
                <RecommendationPanel onRecommendationsReceived={handleRecommendationsReceived} />
              ) : (
                <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-lg backdrop-blur-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card rounded-xl p-5 text-center">
                      <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-6 h-6 text-blue-700" />
                      </div>
                      <h3 className="font-semibold mb-1">Expert-Led Courses</h3>
                      <p className="text-sm text-gray-600">Learn from industry leaders</p>
                    </div>
                    
                    <div className="glass-card rounded-xl p-5 text-center">
                      <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-green-700" />
                      </div>
                      <h3 className="font-semibold mb-1">Community Learning</h3>
                      <p className="text-sm text-gray-600">Join peers on your journey</p>
                    </div>
                    
                    <div className="glass-card rounded-xl p-5 text-center">
                      <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6 text-purple-700" />
                      </div>
                      <h3 className="font-semibold mb-1">AI Recommendations</h3>
                      <p className="text-sm text-gray-600">Personalized learning paths</p>
                    </div>
                    
                    <div className="glass-card rounded-xl p-5 text-center">
                      <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <Award className="w-6 h-6 text-orange-700" />
                      </div>
                      <h3 className="font-semibold mb-1">Certified Skills</h3>
                      <p className="text-sm text-gray-600">Earn recognized credentials</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Recommended Courses Section */}
      {recommendedCourses.length > 0 && (
        <section className="py-12 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader
              title="Recommended for You"
              subtitle="Based on your preferences"
              action={
                <Button
                  variant="outline"
                  onClick={() => setShowRecommendationPanel(true)}
                  className="flex items-center gap-2"
                >
                  Adjust Preferences
                  <Sparkles className="w-4 h-4" />
                </Button>
              }
            />
            
            <CourseGrid courses={recommendedCourses} />
          </div>
        </section>
      )}
      
      {/* Top Courses Section */}
      <section className="py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="Popular Courses"
            subtitle="Highly rated by our learners"
            action={
              <Link to="/browse">
                <Button variant="outline" className="flex items-center gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            }
          />
          
          <CourseGrid 
            courses={topCourses} 
            loading={loading}
          />
        </div>
      </section>
    </div>
  );
};

export default Index;
