"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [name, setName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setName(savedName);
  }, []);

  const exampleTopics = [
    { key: "react", label: "React" },
    { key: "java", label: "Java" },
    { key: "node", label: "Node.js" },
    { key: "python", label: "Python" },
    { key: "kubernetes", label: "Kubernetes" },
  ];

  async function handleSearch(topic?: string) {
    const t = (topic ?? query).trim();
    if (!t) return;
    router.push(`/${t}/detail`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100">
      {/* Hero */}
      <header className="bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 text-white">
        <div className="absolute top-6 right-6">
          <button
            onClick={() => router.push("/signin")}
            className="bg-white text-sky-600 px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
          >
            Sign In
          </button>
        </div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
          <h1 className="text-3xl font-bold text-gray-800">
            {name ? `Welcome, ${name}!` : "Welcome!"}
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-28 text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg">
            AI-Generated Learning Roadmaps
          </h1>
          <p className="mt-4 text-lg sm:text-2xl max-w-3xl mx-auto opacity-90">
            Type a topic, get a structured learning path, curated resources &
            next steps — instantly.
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-10 mx-auto max-w-3xl"
          >
            <div className="relative">
              <input
                aria-label="Search topic"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full rounded-full py-5 pl-6 pr-36 text-gray-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-200"
                placeholder="Search topics: e.g. React, Docker, System Design..."
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
              >
                {loading ? "Searching…" : "Explore"}
              </button>
            </div>

            {/* Suggested buttons */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-white/80 mr-2 self-center">Try:</span>
              {exampleTopics.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setQuery(t.label);
                    handleSearch(t.label);
                  }}
                  className="bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm hover:bg-white/30 transition"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </form>

          {/* Hero image */}
          <div className="mt-12 flex justify-center">
            <Image
              src="/images/learning.svg"
              alt="Learning roadmap illustration"
              width={400}
              height={280}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 -mt-12 space-y-20">
        {/* Features section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <Image src="/images/checklist.svg" alt="" width={80} height={80} />
            <h3 className="text-lg text-gray-700 font-semibold mt-4">
              What you get
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• Structured learning stages</li>
              <li>• Curated resources</li>
              <li>• Practice projects & interview prep</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <Image
              src="/images/artificial-intelligence.svg"
              alt=""
              width={80}
              height={80}
            />
            <h3 className="text-lg text-gray-700 font-semibold mt-4">
              Why AI helps
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Combines docs, tutorials & best practices into a structured path —
              saving hours of research.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <Image src="/images/growth.svg" alt="" width={80} height={80} />
            <h3 className="text-lg text-gray-700 font-semibold mt-4">
              Your Progress
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Track progress, time estimates & milestones as you grow from
              beginner to advanced.
            </p>
          </div>
        </section>

        {/* Popular Roadmaps */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Popular Roadmaps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "React Developer",
                subtitle: "Hooks, performance, testing",
                tag: "Frontend",
              },
              {
                title: "Java Backend",
                subtitle: "Spring, concurrency, microservices",
                tag: "Backend",
              },
              {
                title: "Python Data",
                subtitle: "Pandas, ML, deployment",
                tag: "Data",
              },
              {
                title: "Kubernetes & Cloud",
                subtitle: "Containers, orchestration, IaC",
                tag: "DevOps",
              },
            ].map((card) => (
              <article
                key={card.title}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
              >
                <div className="flex flex-col h-full">
                  <div className="text-sm text-sky-600 font-semibold">
                    {card.tag}
                  </div>
                  <h3 className="mt-2 text-gray-700 font-semibold text-lg">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 flex-grow">
                    {card.subtitle}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-sm font-medium"
                      onClick={() => {
                        setQuery(card.title);
                        handleSearch(card.title);
                      }}
                    >
                      Explore
                    </button>
                    <button className="px-3 py-1 rounded-full border text-sm">
                      Preview
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Roadmap viewer */}
        <section className="mt-10">
          {roadmap ? (
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold">{roadmap.title}</h3>
              {roadmap.overview && (
                <p className="mt-2 text-gray-600">{roadmap.overview}</p>
              )}

              <div className="mt-6 space-y-6">
                {roadmap.stages.map((stage, idx) => (
                  <div key={idx} className="border rounded-lg p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">
                        {stage.title}
                      </h4>
                      {stage.duration && (
                        <div className="text-sm text-gray-500">
                          {stage.duration}
                        </div>
                      )}
                    </div>
                    <ul className="mt-3 space-y-3 text-sm text-gray-700">
                      {stage.items.map((it, i) => (
                        <li key={i} className="pl-2">
                          <div className="font-medium">{it.name}</div>
                          {it.description && (
                            <div className="text-sm text-gray-600">
                              {it.description}
                            </div>
                          )}
                          {it.resources && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {it.resources.map((r, j) => (
                                <a
                                  key={j}
                                  href={r.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs underline text-sky-600"
                                >
                                  {r.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 shadow text-center text-gray-600">
              {loading
                ? "Generating roadmap — this usually takes a few seconds…"
                : "Search a topic or try one of the example roadmaps above."}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center py-10 text-sm text-gray-500">
          © {new Date().getFullYear()} Roadmap.ai — built with Next.js &
          Tailwind
        </footer>
      </main>
    </div>
  );
}
