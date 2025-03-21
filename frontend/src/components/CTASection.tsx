
import  Link  from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-blue-500/5" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-30" />

      <div className="container mx-auto max-w-5xl relative">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 blur-2xl opacity-70" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-500/20 to-primary/20 blur-2xl opacity-70" />

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
                  Ready to Transform Your Learning Experience?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join thousands of students and teachers already using EduSync to revolutionize their educational journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2 px-6">
                      Get Started Free
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="gap-2 px-6">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-primary/10 p-0.5">
                <div className="bg-card rounded-lg p-6">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-semibold mb-2">Free Plan Includes</h3>
                    <ul className="space-y-3 text-left">
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Personalized learning paths
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Access to basic courses
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Progress tracking
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Community forums
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
