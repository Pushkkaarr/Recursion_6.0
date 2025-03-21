import { ArrowRight, BookOpen, BrainCircuit, Calendar, BarChart2, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link  from 'next/link';

const features = [
  {
    title: 'AI-Powered Learning Paths',
    description:
      'Personalized curriculum that adapts to your learning style, pace, and goals for maximum efficiency.',
    icon: BrainCircuit,
    color: 'bg-blue-500/20',
    textColor: 'text-blue-500',
  },
  {
    title: 'Interactive Course Content',
    description:
      'Engage with dynamic content, interactive exercises, and real-time feedback to enhance comprehension.',
    icon: BookOpen,
    color: 'bg-emerald-500/20',
    textColor: 'text-emerald-500',
  },
  {
    title: 'Smart Study Planner',
    description:
      'AI-generated schedules optimized for your learning habits, availability, and course deadlines.',
    icon: Calendar,
    color: 'bg-purple-500/20',
    textColor: 'text-purple-500',
  },
  {
    title: 'Advanced Analytics',
    description:
      'Comprehensive insights into your progress, strengths, and areas for improvement with actionable recommendations.',
    icon: BarChart2,
    color: 'bg-orange-500/20',
    textColor: 'text-orange-500',
  },
  {
    title: 'Collaborative Learning',
    description:
      'Connect with peers through discussion forums, group study rooms, and collaborative projects.',
    icon: Users,
    color: 'bg-pink-500/20',
    textColor: 'text-pink-500',
  },
  {
    title: 'Achievement System',
    description:
      'Earn badges, track streaks, and compete on leaderboards to stay motivated throughout your learning journey.',
    icon: Star,
    color: 'bg-amber-500/20',
    textColor: 'text-amber-500',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[600px] aspect-square rounded-full bg-gradient-to-bl from-blue-500/10 to-primary/10 blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Smarter Learning
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            EduSync combines cutting-edge technology with proven learning methods to create a revolutionary educational experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 rounded-full ${feature.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
              />
              
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon size={24} className={feature.textColor} />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                
                <Link href="/features" className="inline-flex items-center text-sm font-medium text-primary">
                  Learn more
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/features">
            <Button size="lg" variant="outline" className="gap-2">
              Explore All Features
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
