import QuizGenerator from '@/components/QuizGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto">
        <QuizGenerator />
      </div>
    </main>
  );
}