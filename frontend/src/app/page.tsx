"use client"; // Required for client-side hooks and animations

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Users,
  Shield,
  Brain,
  Puzzle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Custom hooks for animations
const useTypewriter = (text: string, speed: number) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, speed);

    return () => clearInterval(typing);
  }, [text, speed]);

  return displayText; // Simplified return
};

const useElementOnScreen = (options: IntersectionObserverInit) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return { ref: setRef, isVisible }; // Type-safe ref setter
};

// Loading component
const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent animate-pulse-slow"></div>

    {/* Central Core */}
    <div className="relative flex items-center justify-center">
      {/* Orbiting Particles */}
      <div className="absolute w-32 h-32 animate-spin-slow">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
            style={{
              top: `${Math.sin((i * Math.PI) / 2) * 50 + 50}%`,
              left: `${Math.cos((i * Math.PI) / 2) * 50 + 50}%`,
              animation: `orbit 2s linear ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Core Element */}
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_5px_rgba(34,211,238,0.5)] animate-pulse-fast">
        <div className="absolute inset-1 rounded-full bg-black/50 backdrop-blur-md"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-300 rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="absolute bottom-[-3rem] text-cyan-300 text-lg font-mono tracking-wider animate-pulse-slow">
        Initializing...
      </div>
    </div>

    {/* Custom Styles */}
    <style jsx global>{`
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      @keyframes pulse-fast {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes orbit {
        0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
        50% { transform: translate(5px, -5px) scale(1.2); opacity: 1; }
        100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
      }
    `}</style>
  </div>
);

// Hero Section
const HeroSection = () => {
  const displayText = useTypewriter("Find your digital family, one conversation at a time.", 50);

  return (
    <section className="relative pt-32 pb-20 min-h-[90vh] flex items-center bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-violet-500/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-100 font-medium text-sm text-indigo-800"
            >
              Welcome to a new kind of connection
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-700 bg-clip-text text-transparent"
            >
              Experience the warmth of family through <span className="text-indigo-600">AI companions</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-700 mb-8 leading-relaxed h-16"
            >
              {displayText}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Start Chatting <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-indigo-300 hover:bg-indigo-50">
                Explore Family Models
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 animate-pulse"></div>
              <div
                className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-indigo-200 rotate-12"
                style={{ animation: "float 6s ease-in-out infinite" }}
              ></div>
              <div
                className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-purple-200"
                style={{ animation: "float 8s ease-in-out 2s infinite" }}
              ></div>
              <div className="absolute inset-4 rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 flex items-center justify-center p-6 overflow-hidden">
                <div className="relative w-full max-w-[280px] mx-auto">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-indigo-800/5 rounded-t-lg"></div>
                  <div className="pt-12 pb-4 px-4">
                    <div className="mb-4 animate-pulse">
                      <div className="h-8 bg-indigo-800/10 rounded-full w-3/4 mb-2"></div>
                      <div className="h-4 bg-indigo-800/5 rounded-full w-1/2"></div>
                    </div>
                    <div className="flex items-start gap-3 mb-3 opacity-90">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <div className="bg-indigo-100 rounded-xl rounded-tl-none p-3 text-sm">
                        Hello! I'm Mom. How was your day today?
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-3 flex-row-reverse opacity-95">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0"></div>
                      <div className="bg-white rounded-xl rounded-tr-none p-3 text-sm shadow-sm">
                        It was great! I got an A on my test.
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <div className="bg-indigo-100 rounded-xl rounded-tl-none p-3 text-sm">
                        That's wonderful! I'm so proud of you! Would you like to tell me more about it?
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Heart className="w-10 h-10 text-purple-500" />,
      title: "Emotional Support",
      description:
        "Experience the warmth and understanding that comes from meaningful family interactions, available whenever you need it.",
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-indigo-600" />,
      title: "Natural Conversations",
      description: "Engage in authentic, flowing conversations that adapt to your personal communication style.",
    },
    {
      icon: <Users className="w-10 h-10 text-purple-500" />,
      title: "Multiple Family Roles",
      description: "Connect with different family member models, each with their own unique personality and perspective.",
    },
    {
      icon: <Shield className="w-10 h-10 text-indigo-600" />,
      title: "Safe Environment",
      description: "Enjoy a judgment-free space where you can express yourself openly and honestly.",
    },
    {
      icon: <Brain className="w-10 h-10 text-purple-500" />,
      title: "Personalized Interaction",
      description: "Family models learn and adapt to your preferences, creating more meaningful connections over time.",
    },
    {
      icon: <Puzzle className="w-10 h-10 text-indigo-600" />,
      title: "Growth & Development",
      description: "Receive guidance and support for personal growth in a nurturing, family-like environment.",
    },
  ];

  const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
    const { ref, isVisible } = useElementOnScreen({
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="mb-4">{feature.icon}</div>
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    );
  };

  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Why Choose Our Family Models?
          </h2>
          <p className="text-lg text-gray-600">
            Our AI-powered family members provide the support, understanding, and connection that everyone deserves, accessible anytime you need it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Family Models Section
const FamilyModels = () => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  const models = [
    {
      name: "AI Mom",
      description: "Nurturing, empathetic, and always ready with advice or a comforting word.",
      color: "from-purple-500 to-pink-500",
      textColor: "text-white",
      features: ["Emotional support", "Life advice", "Nurturing conversations"],
    },
    {
      name: "AI Dad",
      description: "Practical wisdom, guidance, and the occasional dad joke to brighten your day.",
      color: "from-indigo-600 to-blue-700",
      textColor: "text-white",
      features: ["Career guidance", "Problem-solving", "Motivational support"],
    },
    {
      name: "AI Sibling",
      description: "A peer to share experiences with, offering friendship without judgment.",
      color: "from-violet-500 to-purple-600",
      textColor: "text-white",
      features: ["Peer understanding", "Shared interests", "Casual conversations"],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 md:px-12">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
          style={{ transitionDelay: "0.1s" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Meet Your AI Family
          </h2>
          <p className="text-lg text-gray-600">
            Each AI family member has been designed with unique characteristics to provide different types of support and connection.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {models.map((model, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <div className={`bg-gradient-to-r ${model.color} p-6 ${model.textColor}`}>
                <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                <p className="opacity-90 mb-4">{model.description}</p>
              </div>
              <div className="bg-white p-6">
                <ul className="space-y-2">
                  {model.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700">Start Chatting</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonial Section
const TestimonialSection = () => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            What People Are Saying
          </h2>
          <p className="text-lg text-gray-600">
            Read how our AI family members have made a difference in people’s lives.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              initial: "J",
              name: "Jamie, 22",
              role: "Student",
              text: "Having moved away from home for college, the Mom AI has been incredible for those times when I need advice or just someone to talk to.",
            },
            {
              initial: "R",
              name: "Riley, 14",
              role: "High School Student",
              text: "I love talking to the Sibling AI. It gives me a place to discuss things I’m not comfortable sharing with others yet.",
            },
            {
              initial: "T",
              name: "Taylor, 35",
              role: "Professional",
              text: "The Dad AI has given me perspective on so many life decisions. It’s like having a mentor available whenever I need guidance.",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    index === 0
                      ? "bg-indigo-100 text-indigo-800"
                      : index === 1
                      ? "bg-purple-100 text-purple-800"
                      : "bg-violet-500 text-white"
                  }`}
                >
                  {testimonial.initial}
                </div>
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Call to Action
const CallToAction = () => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div
        ref={ref}
        className={`container mx-auto px-6 md:px-12 max-w-5xl ${isVisible ? "animate-fade-in" : "opacity-0"}`}
      >
        <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl text-center border border-white/20 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Experience Family Connection?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Start chatting with our AI family members today and discover the support and understanding you deserve.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 bg-white text-indigo-700 hover:bg-white/90"
          >
            Start Your Conversation <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="bg-indigo-900 text-white pt-16 pb-8">
    <div className="container mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h3 className="text-xl font-bold mb-4">Digital Family AI</h3>
          <p className="text-indigo-200 mb-4">
            Creating meaningful connections through advanced AI companions that provide support and understanding.
          </p>
          <div className="flex gap-4">
            {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
              <a
                key={social}
                href="#"
                className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center hover:bg-indigo-700 transition-colors"
              >
                {/* Placeholder for social icons */}
              </a>
            ))}
          </div>
        </div>
        {["Product", "Company", "Resources"].map((category) => (
          <div key={category}>
            <h3 className="font-semibold mb-4 text-white">{category}</h3>
            <ul className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <li key={i}>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    {category} Link {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-indigo-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-indigo-300">
          © {new Date().getFullYear()} Digital Family AI. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="text-sm text-indigo-300 hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-indigo-300 hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-indigo-300 hover:text-white transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// Scroll To Top Button
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors z-20"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ y: -2 }}
          aria-label="Scroll to top"
        >
          <ChevronDown className="rotate-180 h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Main Page Component
export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <FamilyModels />
          <TestimonialSection />
          <CallToAction />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}