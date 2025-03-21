
import coursesData from '../data/courses.json';
import { Course, CourseLevel, FilterOptions, UserPreferences } from '../types';

// Simulating API calls with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCourses = async (): Promise<Course[]> => {
  // Simulate API delay
  await delay(800);
  return coursesData.courses;
};

export const fetchCourseById = async (id: string): Promise<Course | undefined> => {
  // Simulate API delay
  await delay(500);
  return coursesData.courses.find(course => course.id === id);
};

export const searchCourses = async (searchTerm: string): Promise<Course[]> => {
  // Simulate API delay
  await delay(600);
  if (!searchTerm.trim()) return coursesData.courses;
  
  const term = searchTerm.toLowerCase();
  return coursesData.courses.filter(course => 
    course.title.toLowerCase().includes(term) ||
    course.description.toLowerCase().includes(term) ||
    course.topics.some(topic => topic.toLowerCase().includes(term)) ||
    course.skills.some(skill => skill.toLowerCase().includes(term))
  );
};

export const filterCourses = async (options: FilterOptions): Promise<Course[]> => {
  // Simulate API delay
  await delay(700);
  
  return coursesData.courses.filter(course => {
    // Filter by search term
    const searchMatch = !options.search || 
      course.title.toLowerCase().includes(options.search.toLowerCase()) ||
      course.description.toLowerCase().includes(options.search.toLowerCase()) ||
      course.topics.some(topic => topic.toLowerCase().includes(options.search.toLowerCase())) ||
      course.skills.some(skill => skill.toLowerCase().includes(options.search.toLowerCase()));
    
    // Filter by level
    const levelMatch = options.level === 'all' || course.level === options.level;
    
    // Filter by paid/free
    const paidMatch = options.isPaid === null || course.isPaid === options.isPaid;
    
    // Filter by duration
    let durationMatch = true;
    if (options.duration) {
      if (options.duration === 'short' && (course.duration > 4 && course.durationUnit === 'weeks' || course.duration > 20 && course.durationUnit === 'hours')) {
        durationMatch = false;
      } else if (options.duration === 'medium' && (course.duration < 4 || course.duration > 8) && course.durationUnit === 'weeks') {
        durationMatch = false;
      } else if (options.duration === 'long' && (course.duration < 8 && course.durationUnit === 'weeks')) {
        durationMatch = false;
      }
    }
    
    // Filter by topics
    const topicsMatch = options.topics.length === 0 || 
      options.topics.some(topic => course.topics.includes(topic));
    
    return searchMatch && levelMatch && paidMatch && durationMatch && topicsMatch;
  });
};

export const getRecommendedCourses = async (preferences: UserPreferences): Promise<Course[]> => {
  // Simulate API delay for AI recommendation processing
  await delay(1000);
  
  // Simple recommendation logic based on user preferences
  // In a real app, this would use more sophisticated algorithms
  const allCourses = coursesData.courses;
  
  // Score each course based on matching preferences
  const scoredCourses = allCourses.map(course => {
    let score = 0;
    
    // Match interests with course topics and skills
    preferences.interests.forEach(interest => {
      if (course.topics.some(topic => topic.toLowerCase().includes(interest.toLowerCase()))) {
        score += 3;
      }
      if (course.skills.some(skill => skill.toLowerCase().includes(interest.toLowerCase()))) {
        score += 2;
      }
    });
    
    // Match level
    if (course.level === preferences.level) {
      score += 2;
    }
    
    // Match duration preference
    if (preferences.preferredDuration === 'short' && 
        ((course.durationUnit === 'hours' && course.duration <= 20) || 
         (course.durationUnit === 'weeks' && course.duration <= 4))) {
      score += 2;
    } else if (preferences.preferredDuration === 'medium' && 
               (course.durationUnit === 'weeks' && course.duration >= 4 && course.duration <= 8)) {
      score += 2;
    } else if (preferences.preferredDuration === 'long' && 
               (course.durationUnit === 'weeks' && course.duration > 8)) {
      score += 2;
    }
    
    // Match price preference
    if (preferences.preferredPrice === 'free' && !course.isPaid) {
      score += 2;
    } else if (preferences.preferredPrice === 'paid' && course.isPaid) {
      score += 1;
    }
    
    return { course, score };
  });
  
  // Sort by score (descending)
  scoredCourses.sort((a, b) => b.score - a.score);
  
  // Return top matches (max 6)
  return scoredCourses.slice(0, 6).map(item => item.course);
};

export const getTopCourses = async (): Promise<Course[]> => {
  // Simulate API delay
  await delay(600);
  
  // Return courses sorted by rating and number of reviews
  return [...coursesData.courses]
    .sort((a, b) => {
      // Weighted score based on rating and popularity
      const scoreA = a.rating * 0.7 + (Math.log(a.reviews) / Math.log(10000)) * 0.3;
      const scoreB = b.rating * 0.7 + (Math.log(b.reviews) / Math.log(10000)) * 0.3;
      return scoreB - scoreA;
    })
    .slice(0, 6);
};

export const getCoursesByTopic = async (topic: string): Promise<Course[]> => {
  // Simulate API delay
  await delay(600);
  
  return coursesData.courses.filter(course => 
    course.topics.some(t => t.toLowerCase() === topic.toLowerCase())
  );
};

export const getAllTopics = async (): Promise<string[]> => {
  // Simulate API delay
  await delay(300);
  
  // Extract all unique topics from courses
  const topicsSet = new Set<string>();
  coursesData.courses.forEach(course => {
    course.topics.forEach(topic => {
      topicsSet.add(topic);
    });
  });
  
  return Array.from(topicsSet).sort();
};
