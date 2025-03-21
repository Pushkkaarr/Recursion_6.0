
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  organization: string;
  rating: number;
  reviews: number;
  enrolled: number;
  price: number;
  isPaid: boolean;
  duration: number;
  durationUnit: string;
  level: string;
  topics: string[];
  skills: string[];
  imageUrl: string;
  syllabus: CourseSyllabus[];
}

export interface CourseSyllabus {
  week: number;
  title: string;
  content: string;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface FilterOptions {
  search: string;
  level: CourseLevel | 'all';
  isPaid: boolean | null;
  duration: string | null;
  topics: string[];
}

export interface RecommendationData {
  courses: Course[];
  userPreferences?: UserPreferences;
}

export interface UserPreferences {
  interests: string[];
  level: CourseLevel;
  preferredDuration: string;
  preferredPrice: 'free' | 'paid' | 'all';
}
