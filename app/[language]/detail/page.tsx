"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

type Roadmap = {
  title: string;
  overview?: string;
  stages: Array<{
    title: string;
    duration?: string;
    items: Array<{
      name: string;
      description?: string;
      resources?: Array<{ label: string; url: string }>;
    }>;
  }>;
};

export default function TopicDetailPage() {
  const { language } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const [studyMode, setStudyMode] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!language) return;

    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: language }),
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setRoadmap(data);
      } catch (err) {
        console.error(err ?? "Failed to load roadmap");
        setError("Could not fetch roadmap.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [language]);

  const handleStageComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    if (roadmap && currentStage < roadmap.stages.length - 1) {
      setCurrentStage(currentStage + 1);
      setCurrentLesson(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-50">
        <p className="text-lg text-indigo-600 animate-pulse">
          Generating roadmap for{" "}
          <span className="font-semibold">{language}</span>...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 text-red-700">
        <p className="text-lg font-medium">Oops! {error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!roadmap) return null;

  // --- Study Mode UI ---
  if (studyMode) {
    const stage = roadmap.stages[currentStage];
    const lesson = stage.items[currentLesson];

    return (
      <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-sky-50 to-green-50">
        {showConfetti && <Confetti />}
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-indigo-100 p-6 space-y-6">
          <h2 className="text-2xl font-bold text-indigo-700">
            {roadmap.title}
          </h2>
          <nav className="space-y-4">
            {roadmap.stages.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStage(idx);
                  setCurrentLesson(0);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                  idx === currentStage
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-sky-50 text-gray-700"
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Lesson Content */}
        <main className="flex-1 p-10">
          <h3 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-sky-500" /> {lesson.name}
          </h3>
          {lesson.description && (
            <p className="mt-4 text-gray-600">{lesson.description}</p>
          )}

          {lesson.resources && (
            <div className="mt-6 space-y-5">
              <h4 className="font-semibold text-indigo-600">Resources:</h4>
              {lesson.resources.map((r, j) => {
                return (
                  <div key={j} className="rounded-xl overflow-hidden shadow-md">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-sm px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition"
                    >
                      {r.label}
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex justify-between">
            <button
              disabled={currentLesson === 0}
              onClick={() => setCurrentLesson(currentLesson - 1)}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {currentLesson < stage.items.length - 1 ? (
              <button
                onClick={() => setCurrentLesson(currentLesson + 1)}
                className="px-5 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Next Lesson →
              </button>
            ) : (
              <button
                onClick={handleStageComplete}
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                ✅ Complete Stage
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // --- Roadmap UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-green-50 px-6 py-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10 border border-indigo-100 relative">
        <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-sky-500" />
          {roadmap.title}
        </h1>
        {roadmap.overview && (
          <p className="mt-4 text-gray-600 leading-relaxed">
            {roadmap.overview}
          </p>
        )}

        {/* Road timeline */}
        <div className="relative mt-12">
          <div className="absolute left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-indigo-400 to-sky-400 rounded-full" />
          <div className="space-y-20">
            {roadmap.stages.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex ${
                  idx % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div className="w-1/2">
                  <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        {stage.title}
                      </h2>
                      {stage.duration && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" /> {stage.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-6 w-8 h-8 bg-white border-4 border-sky-500 rounded-full shadow flex items-center justify-center z-10">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setStudyMode(true)}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-sky-500 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition transform"
          >
            Start Learning 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
