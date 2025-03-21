import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QuoteIcon } from 'lucide-react';

const testimonials = [
  {
    quote:
      "EduSync has completely transformed my learning experience. The personalized study paths have helped me stay organized and focused on what matters most.",
    name: 'Alex Morgan',
    title: 'Computer Science Student',
    avatar: '/placeholder.svg',
  },
  {
    quote:
      "As a teacher, the analytics dashboard gives me real-time insights into my students' progress. I can easily identify who needs extra help and adjust my teaching strategy accordingly.",
    name: 'Sarah Johnson',
    title: 'High School Mathematics Teacher',
    avatar: '/placeholder.svg',
  },
  {
    quote:
      "The collaborative features make learning fun and engaging. I love being able to work on projects with classmates and discuss challenging concepts in real-time.",
    name: 'David Chen',
    title: 'MBA Student',
    avatar: '/placeholder.svg',
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 bg-secondary/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Students and Teachers
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from our community about how EduSync is revolutionizing the learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden"
            >
              <QuoteIcon className="absolute top-4 right-4 text-primary/10 h-12 w-12" />
              <div className="relative z-10">
                <p className="mb-6 text-foreground/80 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/5 to-blue-500/5 p-8 rounded-2xl border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-semibold mb-2">Join thousands of satisfied learners</h3>
              <p className="text-muted-foreground">
                EduSync is trusted by students and educators worldwide to enhance the learning experience.
              </p>
            </div>
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">10k+</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Teachers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">1k+</p>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
