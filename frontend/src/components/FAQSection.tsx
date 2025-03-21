
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does EduSync personalize my learning experience?',
    answer:
      'EduSync uses advanced AI algorithms to analyze your learning habits, strengths, and areas for improvement. Based on this data, it creates tailored learning paths that adapt in real-time as you progress through the material. The system considers your preferred learning style, pace, and goals to deliver the most effective educational experience.',
  },
  {
    question: 'Can I use EduSync alongside my existing courses?',
    answer:
      'Absolutely! EduSync is designed to complement your existing educational commitments. You can import your current coursework and schedule, allowing the platform to integrate with your ongoing studies. This seamless integration helps you organize all your learning in one place while benefiting from our AI-powered recommendations.',
  },
  {
    question: 'Is EduSync suitable for both students and teachers?',
    answer:
      'Yes, EduSync offers specialized interfaces for both learners and educators. Students receive personalized learning paths, adaptive quizzes, and collaborative tools. Teachers gain access to comprehensive analytics, content management systems, and AI-powered insights to optimize their teaching strategies and better support their students.',
  },
  {
    question: 'What types of content and courses are available on EduSync?',
    answer:
      'EduSync supports a wide range of content formats including video lectures, interactive exercises, text materials, quizzes, and assignments. Our library covers diverse subjects from mathematics and sciences to humanities, languages, and professional skills. We also allow educators to create and upload custom content tailored to their specific curriculum needs.',
  },
  {
    question: 'How does the collaborative learning feature work?',
    answer:
      'Our collaborative learning tools include discussion forums, group study rooms with shared whiteboards, peer-to-peer learning sessions, and team projects. Students can connect with peers who are studying similar material, ask questions, share resources, and work together on assignments, creating a supportive community of learners.',
  },
  {
    question: 'Is my data private and secure on EduSync?',
    answer:
      'We take data privacy and security very seriously. EduSync employs industry-standard encryption protocols to protect your personal information and learning data. We have a strict privacy policy that ensures your data is never sold to third parties. Additionally, you have complete control over what information is shared within the collaborative features of the platform.',
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-40 left-0 w-[600px] aspect-square rounded-full bg-gradient-to-tr from-primary/10 to-blue-500/10 blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about EduSync's features and functionality.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <a
            href="mailto:support@edusync.com"
            className="text-primary hover:underline font-medium"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
