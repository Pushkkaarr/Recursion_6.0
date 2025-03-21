import  Link  from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-4 sm:px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] aspect-square rounded-full bg-gradient-to-br from-primary/20 to-blue-500/10 blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col space-y-8 md:pr-8 animate-slide-in">
            <div>
              <div className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
                Revolutionize Learning
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
                Learn Smarter with{' '}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Personalized
                </span>{' '}
                Paths
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                EduSync creates adaptive learning experiences tailored to your
                unique needs, goals and preferences.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2 px-6">
                  Get Started
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="gap-2 px-6">
                  Watch Demo
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">10k+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">1k+</p>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl animate-float">
              <div className="absolute inset-0 glass border border-white/20 backdrop-blur-sm">
                {/* Dashboard Mockup */}
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">Your Learning Path</h3>
                      <p className="text-xs text-muted-foreground">12 June 2023</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight size={14} className="text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-2.5 w-full rounded-full bg-secondary">
                      <div className="h-full w-2/3 rounded-full bg-primary" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg p-2 bg-white/10 flex flex-col items-center">
                        <div className="h-6 w-6 rounded-full bg-blue-500/20 mb-1" />
                        <div className="h-1.5 w-12 bg-muted rounded" />
                      </div>
                      <div className="rounded-lg p-2 bg-white/10 flex flex-col items-center">
                        <div className="h-6 w-6 rounded-full bg-green-500/20 mb-1" />
                        <div className="h-1.5 w-12 bg-muted rounded" />
                      </div>
                      <div className="rounded-lg p-2 bg-white/10 flex flex-col items-center">
                        <div className="h-6 w-6 rounded-full bg-purple-500/20 mb-1" />
                        <div className="h-1.5 w-12 bg-muted rounded" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="h-10 rounded-lg bg-white/10" />
                      <div className="h-10 rounded-lg bg-white/10" />
                      <div className="h-10 rounded-lg bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-8 -right-8 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -z-10 -bottom-8 -left-8 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
