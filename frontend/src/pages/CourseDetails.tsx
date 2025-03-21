
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Course } from '@/types';
import { fetchCourseById, getTopCourses } from '@/services/courseService';
import { formatDuration, formatPrice, formatNumber, getDifficultyColor } from '@/utils/formatUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Users, Clock, BookOpen, Award, Check, ArrowLeft } from 'lucide-react';
import CourseGrid from '@/components/CourseGrid';
import SectionHeader from '@/components/SectionHeader';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        if (id) {
          const courseData = await fetchCourseById(id);
          if (courseData) {
            setCourse(courseData);
            
            // Fetch related courses (in a real app, this would be more sophisticated)
            const topCourses = await getTopCourses();
            const filtered = topCourses.filter(c => c.id !== id).slice(0, 3);
            setRelatedCourses(filtered);
          }
        }
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <div className="pt-28 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <div className="pt-28 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Course Not Found</h1>
              <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
              <Link to="/browse">
                <Button>Browse All Courses</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <div className="pt-28 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Link to="/browse" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to courses
          </Link>
          
          {/* Course Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12 animate-fade-in">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium py-1 px-2 rounded-full ${getDifficultyColor(course.level)}`}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                
                <span className="text-xs font-medium py-1 px-2 rounded-full bg-blue-100 text-blue-800">
                  {course.organization}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-gray-600 mb-6">
                Taught by <span className="font-medium">{course.instructor}</span>
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <span>{course.rating} ({formatNumber(course.reviews)} reviews)</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{formatNumber(course.enrolled)} students</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{formatDuration(course.duration, course.durationUnit)}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Course Description:</h3>
                <p className="text-gray-700">{course.description}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Skills You'll Learn:</h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, index) => (
                    <span key={index} className="text-sm py-1.5 px-3 bg-gray-100 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <Card className="overflow-hidden glass-card animate-scale-in">
                <div className="relative h-48">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button className="px-6 py-5 text-lg" size="lg">
                      {course.isPaid ? 'Enroll Now' : 'Start Learning'}
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-bold">
                      {formatPrice(course.price)}
                    </span>
                    {course.isPaid && (
                      <span className="text-sm text-gray-500">
                        Full lifetime access
                      </span>
                    )}
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <BookOpen className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Course Content</h4>
                        <p className="text-sm text-gray-600">
                          Complete curriculum with practical exercises
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Duration</h4>
                        <p className="text-sm text-gray-600">
                          {formatDuration(course.duration, course.durationUnit)} of focused learning
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Certificate</h4>
                        <p className="text-sm text-gray-600">
                          Earn a certificate upon completion
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mb-4" size="lg">
                    {course.isPaid ? 'Enroll Now' : 'Start Learning for Free'}
                  </Button>
                  
                  {course.isPaid && (
                    <Button variant="outline" className="w-full">
                      Try for Free
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
          
          {/* Course Syllabus */}
          <div className="mb-16 animate-slide-up">
            <SectionHeader
              title="Course Syllabus"
              subtitle="What you'll learn in this course"
            />
            
            <Card className="glass-card">
              <div className="p-6">
                {course.syllabus.map((item, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex items-center mb-2">
                      <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <span className="font-semibold text-primary">{item.week}</span>
                      </div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                    
                    <div className="ml-11">
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Key Features */}
          <div className="mb-16 animate-slide-up">
            <SectionHeader
              title="What You'll Get"
              subtitle="Key features of this course"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <BookOpen className="w-6 h-6 text-blue-600" />,
                  title: "Comprehensive Curriculum",
                  description: "Well-structured content designed for maximum learning efficiency"
                },
                {
                  icon: <Users className="w-6 h-6 text-green-600" />,
                  title: "Community Support",
                  description: "Connect with peers and get help when you need it"
                },
                {
                  icon: <Check className="w-6 h-6 text-teal-600" />,
                  title: "Practical Exercises",
                  description: "Apply what you learn with hands-on projects and assignments"
                }
              ].map((feature, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-start">
                    <div className="bg-white rounded-full p-3 shadow-sm mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Related Courses */}
          {relatedCourses.length > 0 && (
            <div className="animate-slide-up">
              <SectionHeader
                title="You Might Also Like"
                subtitle="Similar courses you may be interested in"
              />
              
              <CourseGrid 
                courses={relatedCourses} 
                columns={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
