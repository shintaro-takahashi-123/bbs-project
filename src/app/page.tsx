"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { WorkItem } from "@/lib/cms";

interface SortValue {
  type: 1 | 2 | 3; // 1: Calendar Date, 2: Phase/Step, 3: Other/None
  value: number;
}

// Helper function to parse dates/phases for custom chronological/phase sorting
function getSortValue(dateStr?: string): SortValue {
  if (!dateStr) {
    return { type: 3, value: 0 };
  }
  
  const cleanStr = dateStr.trim();
  
  // 1. Check for calendar date pattern: YYYY.MM, YYYY-MM, YYYY/MM, or YYYY (possibly with range or "現在")
  const matchYM = cleanStr.match(/(\d{4})[./-](\d{2})/);
  if (matchYM) {
    const year = parseInt(matchYM[1], 10);
    const month = parseInt(matchYM[2], 10);
    return { type: 1, value: year * 12 + month };
  }
  
  const matchY = cleanStr.match(/^(\d{4})$/);
  if (matchY) {
    const year = parseInt(matchY[1], 10);
    return { type: 1, value: year * 12 + 1 };
  }

  // 2. Check for Phase/Step pattern
  const phaseMatch = cleanStr.match(/(?:Phase|Step|ステップ|フェーズ)\s*(\d+)/i);
  if (phaseMatch) {
    return { type: 2, value: parseInt(phaseMatch[1], 10) };
  }
  
  return { type: 3, value: 0 };
}

// Helper function to format date/range as Japanese YYYY年MM月DD日 format
function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  
  const cleanStr = dateStr.trim();

  // If it already contains Japanese characters like "年", return as is
  if (cleanStr.includes("年")) {
    return cleanStr;
  }
  
  // Try matching YYYY.MM.DD or YYYY-MM-DD
  const matchYMD = cleanStr.match(/^(\d{4})[.-](\d{2})[.-](\d{2})(?:T|\s|$)/);
  if (matchYMD) {
    return `${matchYMD[1]}年${parseInt(matchYMD[2], 10)}月${parseInt(matchYMD[3], 10)}日`;
  }
  
  // Try matching YYYY.MM or YYYY-MM
  const matchYM = cleanStr.match(/^(\d{4})[.-](\d{2})$/);
  if (matchYM) {
    return `${matchYM[1]}年${parseInt(matchYM[2], 10)}月`;
  }
  
  // Try matching YYYY
  const matchY = cleanStr.match(/^(\d{4})$/);
  if (matchY) {
    return `${matchY[1]}年`;
  }

  // Handle range like "YYYY.MM — YYYY.MM" or "YYYY-MM — YYYY-MM"
  const rangeMatch = cleanStr.match(/^(\d{4})[.-](\d{2})\s*[—-]\s*(\d{4})[.-](\d{2})$/);
  if (rangeMatch) {
    return `${rangeMatch[1]}年${parseInt(rangeMatch[2], 10)}月〜${rangeMatch[3]}年${parseInt(rangeMatch[4], 10)}月`;
  }

  // Handle present ranges like "YYYY.MM — 現在" or "YYYY-MM — 現在"
  const presentMatch = cleanStr.match(/^(\d{4})[.-](\d{2})\s*[—-]\s*(?:現在|Present|present)$/);
  if (presentMatch) {
    return `${presentMatch[1]}年${parseInt(presentMatch[2], 10)}月〜現在`;
  }

  // Try parsing general Date as fallback if it contains standard separators
  if (cleanStr.includes("-") || cleanStr.includes("/")) {
    const timestamp = Date.parse(cleanStr);
    if (!isNaN(timestamp)) {
      const d = new Date(timestamp);
      // Format as YYYY年M月D日
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
  }

  // If it's a phase/step like "Phase 01", it does not match calendar date, return empty to hide from date slots
  return "";
}

export default function Home() {
  // State variables
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [projects, setProjects] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch projects from secure Next.js API Route
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/works");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        } else {
          console.error("Failed to fetch works:", res.statusText);
        }
      } catch (error) {
        console.error("Error loading works:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Simulate API request
    setTimeout(() => {
      setFormStatus("success");
      setToastMessage("Message sent successfully! Thank you.");

      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();

      // Clear toast after 4 seconds
      setTimeout(() => {
        setToastMessage(null);
        setFormStatus("idle");
      }, 4000);
    }, 1500);
  };

  // Filter projects based on active category
  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "All") return true;
    return project.category === activeCategory;
  });

  // Sort projects: calendar dates newest first (descending), phase/step items ascending at the end
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const valA = getSortValue(a.date);
    const valB = getSortValue(b.date);
    
    if (valA.type !== valB.type) {
      return valA.type - valB.type;
    }
    
    if (valA.type === 1) {
      return valB.value - valA.value; // newest first
    }
    
    if (valA.type === 2) {
      return valA.value - valB.value; // Phase 1 -> Phase 4 ascending
    }
    
    return 0;
  });

  // Display only the top 10 projects on the homepage timeline
  const displayedProjects = sortedProjects.slice(0, 10);

  return (
    <>
      {/* TopNavBar Component */}
      <Header />

      <main>
        {/* Home Section */}
        <section className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-x pt-12 pb-12 sm:pt-16 sm:pb-16 md:pt-section-gap md:pb-section-gap flex flex-col items-center md:items-start justify-center min-h-[calc(100vh-80px)]" id="home">
          <h1 className="font-display text-[42px] xs:text-[56px] sm:text-[96px] md:text-[160px] leading-[0.9] tracking-tighter font-semibold text-primary max-w-4xl mb-8 sm:mb-12 md:mb-stack-lg text-center md:text-left">
            Shintaro <br /> Takahashi.
          </h1>
          <div className="flex flex-col md:flex-row gap-3 md:gap-gutter items-center justify-center md:justify-start w-full max-w-2xl border-l-0 md:border-l-2 border-outline-variant pl-0 md:pl-stack-md text-center md:text-left">
            <p className="font-body-lg text-body-lg text-on-surface-variant text-center md:text-left">
              My dream is security consultant.
            </p>
            <div className="flex items-center gap-2 text-secondary shrink-0 justify-center md:justify-start">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Tokyo, JP</span>
            </div>
          </div>
        </section>

        {/* Career & Workflow Section */}
        <section className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-x py-12 sm:py-16 md:py-section-gap" id="works">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 md:mb-stack-lg gap-stack-md">
            <div>
              <h2 className="font-display text-headline-lg-mobile md:text-display text-primary mb-stack-sm">Career & Workflow</h2>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl">セキュリティコンサルタントとしてのキャリア、取得資格、およびセキュリティ支援における実践的なアプローチ手法です。</p>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <button
                className={`font-label-md text-label-md pb-1 transition-colors ${activeCategory === "All" ? "text-primary border-b border-primary" : "text-secondary hover:text-primary"
                  }`}
                onClick={() => setActiveCategory("All")}
              >
                すべて
              </button>
              <button
                className={`font-label-md text-label-md pb-1 transition-colors ${activeCategory === "Career" ? "text-primary border-b border-primary" : "text-secondary hover:text-primary"
                  }`}
                onClick={() => setActiveCategory("Career")}
              >
                経歴
              </button>
              <button
                className={`font-label-md text-label-md pb-1 transition-colors ${activeCategory === "Qualification" ? "text-primary border-b border-primary" : "text-secondary hover:text-primary"
                  }`}
                onClick={() => setActiveCategory("Qualification")}
              >
                資格
              </button>
              <button
                className={`font-label-md text-label-md pb-1 transition-colors ${activeCategory === "Workflow" ? "text-primary border-b border-primary" : "text-secondary hover:text-primary"
                  }`}
                onClick={() => setActiveCategory("Workflow")}
              >
                ワークフロー
              </button>
              <button
                className={`font-label-md text-label-md pb-1 transition-colors ${activeCategory === "others" ? "text-primary border-b border-primary" : "text-secondary hover:text-primary"
                  }`}
                onClick={() => setActiveCategory("others")}
              >
                その他
              </button>
            </div>
          </div>

          <div className="relative w-full">
            {isLoading ? (
              // Loading Skeleton loader
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => {
                  return (
                    <div
                      key={index}
                      className="block ambient-shadow bg-surface-container-lowest rounded-DEFAULT overflow-hidden animate-pulse"
                    >
                      <div className="aspect-[16/9] w-full bg-surface-container-low" />
                      <div className="p-5">
                        <div className="h-4 bg-surface-container-low rounded w-1/4 mb-2" />
                        <div className="h-6 bg-surface-container-low rounded w-3/4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : displayedProjects.length > 0 ? (
              <>
                {/* Desktop Horizontal Timeline (md and above) */}
                <div className="hidden md:block w-full overflow-x-auto pb-10 scrollbar-none relative">
                  <div className="flex gap-8 items-start min-w-max px-6 pt-16 relative">
                    {/* Axis Line */}
                    <div className="absolute top-[148px] left-0 right-0 h-[2px] bg-secondary/15 z-0" />
                    
                    {displayedProjects.map((project) => {
                      const categoryLabels: Record<string, string> = {
                        Career: "経歴",
                        Qualification: "資格取得",
                        Workflow: "ワークフロー",
                        others: "その他"
                      };

                      const renderPlaceholder = () => {
                        let gradient = "from-blue-500/20 to-purple-500/20";
                        let icon = "shield";

                        if (project.category === "Qualification") {
                          gradient = "from-teal-500/10 to-blue-600/10 dark:from-teal-500/20 dark:to-blue-600/20";
                          icon = "verified";
                        } else if (project.category === "Workflow") {
                          gradient = "from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20";
                          icon = "settings";
                        } else {
                          gradient = "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20";
                          icon = "work";
                        }

                        return (
                          <div className={`w-full h-full bg-gradient-to-tr ${gradient} flex flex-col items-center justify-center gap-2 relative p-4 text-center`}>
                            <span className="material-symbols-outlined text-[32px] text-secondary opacity-60">{icon}</span>
                          </div>
                        );
                      };

                      return (
                        <div key={project.id} className="relative w-[320px] pt-12 group flex flex-col items-center">
                          {/* Date label above the dot */}
                          {formatDate(project.date) && (
                            <div className="absolute top-0 text-caption font-bold text-secondary uppercase tracking-widest bg-background px-2 z-10 text-center">
                              {formatDate(project.date)}
                            </div>
                          )}
                          
                          {/* Timeline Dot */}
                          <div className="absolute top-[76px] w-4 h-4 rounded-full border-2 border-primary bg-background z-10 transition-all duration-300 group-hover:scale-125 group-hover:bg-primary" />
                          
                          {/* Vertical Connector Line from Dot to Card */}
                          <div className="absolute top-[92px] w-[2px] h-[36px] bg-secondary/15 group-hover:bg-primary/50 transition-colors" />

                          {/* Card */}
                          <a
                            className="w-full block ambient-shadow bg-surface-container-lowest rounded-DEFAULT overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-secondary/5 text-left"
                            href={project.link}
                          >
                            <div className="aspect-[16/9] w-full overflow-hidden bg-surface-container-low relative border-b border-secondary/5">
                              {project.image ? (
                                <img
                                  alt={project.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  src={project.image}
                                />
                              ) : (
                                renderPlaceholder()
                              )}
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="font-label-md text-secondary uppercase tracking-wider truncate max-w-[140px]">{project.subcategory}</span>
                                <span className="font-label-md px-1.5 py-0.5 rounded bg-surface-container-low text-secondary border border-secondary/5 text-center shrink-0">
                                  {categoryLabels[project.category] || project.category}
                                </span>
                              </div>
                              <h3 className="text-[16px] text-primary font-semibold group-hover:text-primary/80 transition-colors leading-snug line-clamp-2 min-h-[44px]">{project.title}</h3>
                              {project.description && (
                                <p className="font-body-md text-[13px] text-on-surface-variant line-clamp-3 leading-relaxed mt-1">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </a>
                        </div>
                      );
                    })}

                    {/* Desktop "more" Card at the very end of the scroll list */}
                    {sortedProjects.length > 10 && (
                      <div className="relative w-[320px] pt-12 group flex flex-col items-center shrink-0">
                        {/* Timeline Dot */}
                        <div className="absolute top-[76px] w-4 h-4 rounded-full border-2 border-primary bg-background z-10 transition-all duration-300 group-hover:scale-125 group-hover:bg-primary" />
                        
                        {/* Vertical Connector Line from Dot to Card */}
                        <div className="absolute top-[92px] w-[2px] h-[36px] bg-secondary/15 group-hover:bg-primary/50 transition-colors" />

                        {/* Card */}
                        <Link
                          href="/works"
                          className="w-full block ambient-shadow bg-surface-container-lowest rounded-DEFAULT border border-secondary/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center group/more"
                          id="btn-more-horizontal"
                        >
                          <div className="aspect-[16/9] w-full bg-primary/5 flex flex-col items-center justify-center gap-2 group-hover/more:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-[32px] text-primary group-hover/more:translate-x-1 transition-transform">arrow_forward</span>
                            <span className="font-label-md text-label-md text-primary font-bold">more</span>
                          </div>
                          <div className="p-4 flex flex-col items-center justify-center min-h-[120px]">
                            <p className="font-body-md text-[13px] text-secondary leading-relaxed">
                              すべての経歴・資格・ワークフローを見る
                            </p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Vertical Timeline (less than md) */}
                <div className="block md:hidden relative pl-8 pr-2 py-4">
                  {/* Vertical Line */}
                  <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-secondary/15" />

                  <div className="flex flex-col gap-8">
                    {displayedProjects.map((project) => {
                      const categoryLabels: Record<string, string> = {
                        Career: "経歴",
                        Qualification: "資格取得",
                        Workflow: "ワークフロー",
                        others: "その他"
                      };

                      const renderPlaceholder = () => {
                        let gradient = "from-blue-500/20 to-purple-500/20";
                        let icon = "shield";

                        if (project.category === "Qualification") {
                          gradient = "from-teal-500/10 to-blue-600/10 dark:from-teal-500/20 dark:to-blue-600/20";
                          icon = "verified";
                        } else if (project.category === "Workflow") {
                          gradient = "from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20";
                          icon = "settings";
                        } else {
                          gradient = "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20";
                          icon = "work";
                        }

                        return (
                          <div className={`w-full h-full bg-gradient-to-tr ${gradient} flex items-center justify-center relative p-4`}>
                            <span className="material-symbols-outlined text-[32px] text-secondary opacity-60">{icon}</span>
                          </div>
                        );
                      };

                      return (
                        <div key={project.id} className="relative group">
                          {/* Timeline Dot on the left */}
                          <div className="absolute -left-[25px] top-[24px] w-4 h-4 rounded-full border-2 border-primary bg-background z-10 transition-all duration-300 group-hover:scale-125 group-hover:bg-primary" />

                          {/* Card */}
                          <a
                            className="w-full block ambient-shadow bg-surface-container-lowest rounded-DEFAULT overflow-hidden transition-all duration-300 border border-secondary/5 text-left"
                            href={project.link}
                          >
                            <div className="aspect-[16/9] w-full overflow-hidden bg-surface-container-low relative border-b border-secondary/5">
                              {project.image ? (
                                <img
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                  src={project.image}
                                />
                              ) : (
                                renderPlaceholder()
                              )}
                              {project.date && formatDate(project.date) && (
                                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-label-md text-secondary shadow-sm">
                                  {formatDate(project.date)}
                                </div>
                              )}
                            </div>
                            <div className="p-5 flex flex-col gap-2.5">
                              <div className="flex justify-between items-center">
                                <span className="font-label-md text-caption text-secondary uppercase tracking-wider">{project.subcategory}</span>
                                <span className="text-caption font-label-md px-2 py-0.5 rounded bg-surface-container-low text-secondary border border-secondary/5">
                                  {categoryLabels[project.category] || project.category}
                                </span>
                              </div>
                              <h3 className="text-[18px] text-primary font-semibold leading-snug">{project.title}</h3>
                              {project.description && (
                                <p className="font-body-md text-[14px] text-on-surface-variant line-clamp-3 leading-relaxed">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              // Empty State
              <div className="text-center py-12">
                <p className="font-body-lg text-body-lg text-secondary">該当する項目が見つかりませんでした。</p>
              </div>
            )}
          </div>

          {!isLoading && sortedProjects.length > 10 && (
            <div className="mt-8 sm:mt-12 md:mt-stack-lg flex justify-center">
              <Link
                href="/works"
                className="font-label-md text-label-md bg-transparent border border-outline text-primary px-8 py-3 rounded hover:bg-surface-container-low transition-colors duration-200 inline-block text-center"
              >
                もっと表示する
              </Link>
            </div>
          )}
        </section>

        {/* About Me Section */}
        <section className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-x py-12 sm:py-16 md:py-section-gap" id="about">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-gutter items-center mb-12 md:mb-section-gap">
            <div className="md:col-span-7 flex flex-col gap-stack-md order-2 md:order-1">
              <h2 className="font-display text-headline-lg-mobile md:text-display text-primary">Crafting digital clarity.</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                I am a senior web designer focused on creating minimalist, high-performance digital experiences. My approach blends rigorous grid systems with editorial typography to build interfaces that are both beautiful and brutally effective. I believe in reduction over decoration.
              </p>
              <div className="pt-stack-sm flex gap-4">
                <span className="inline-flex items-center gap-2 font-label-md text-label-md text-secondary">
                  <span className="material-symbols-outlined text-xl">location_on</span> Based in New York (Tokyo Native)
                </span>
              </div>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <div className="aspect-[4/5] bg-surface-container-highest rounded-lg overflow-hidden ambient-shadow relative group">
                <img
                  alt="Portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvacmMJZulHyWYx0u5yb0npn5faISNkKhMurk_HWj9z14mx9rKTQMa1s_W7gLtp84EOFc6eFvSrtObxdy3JWnX9Z7yTv7Mu3WP82KwicnQSHnlLBSBuun9geJFRg4h_rgc1HIKQxokdPXIi4-uX-cxAefC_xi-Bbj4of_HLHCIIAxnE_E8gy6VvSPZuvFxwZwxh4hvFSMl7auyU8wHi2JP-6n955iiBgQiFB-5msULQWt84D8tmC4JayOpBbMQmTargrOCmtYl7GTp"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-gutter">
            <div className="md:col-span-8 bg-surface-container-lowest rounded-lg p-5 sm:p-8 md:p-stack-lg ambient-shadow flex flex-col gap-stack-md">
              <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2 border-b border-outline-variant pb-4">
                <span className="material-symbols-outlined">work</span> Experience
              </h3>
              <div className="flex flex-col">
                <div className="py-4 md:py-stack-md border-b border-outline-variant/30 last:border-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="font-label-md text-label-md text-secondary">2020 — Present</div>
                  <div className="md:col-span-2">
                    <h4 className="font-headline-md text-body-lg text-primary font-medium">Design Director</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Studio Minimal</p>
                    <p className="font-body-md text-body-md text-secondary mt-2">Leading design strategy and execution for premium tech clients, focusing on rigorous design systems and brand consistency.</p>
                  </div>
                </div>
                <div className="py-4 md:py-stack-md border-b border-outline-variant/30 last:border-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="font-label-md text-label-md text-secondary">2016 — 2020</div>
                  <div className="md:col-span-2">
                    <h4 className="font-headline-md text-body-lg text-primary font-medium">Senior Product Designer</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Fintech Corp</p>
                    <p className="font-body-md text-body-md text-secondary mt-2">Designed complex financial dashboards. Streamlined user workflows resulting in a 40% reduction in task completion time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6 md:gap-gutter">
              <div className="bg-surface-container-lowest rounded-lg p-5 sm:p-6 md:p-stack-md ambient-shadow">
                <h3 className="font-headline-md text-body-lg text-primary mb-stack-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">code</span> Capabilities
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface font-label-md text-caption rounded">UI/UX Design</span>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface font-label-md text-caption rounded">Design Systems</span>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface font-label-md text-caption rounded">Prototyping</span>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface font-label-md text-caption rounded">Figma</span>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface font-label-md text-caption rounded">HTML/CSS</span>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface font-label-md text-caption rounded">Art Direction</span>
                </div>
              </div>

              <div className="bg-primary text-on-primary rounded-lg p-5 sm:p-6 md:p-stack-md flex-grow flex flex-col justify-center">
                <h3 className="font-headline-md text-body-lg mb-stack-sm flex items-center gap-2 opacity-80">
                  <span className="material-symbols-outlined text-lg">psychology</span> My Philosophy
                </h3>
                <p className="font-body-md text-body-md opacity-90 leading-relaxed italic">
                  &ldquo;Good design is as little design as possible. It concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-surface-container-low py-12 sm:py-16 md:py-section-gap" id="contact">
          <div className="max-w-[720px] mx-auto w-full px-4 sm:px-6 md:px-margin-x flex flex-col gap-8 md:gap-stack-lg">
            <div className="text-center flex flex-col gap-stack-sm">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Get in touch.</h2>
              <p className="font-body-lg text-body-lg text-secondary max-w-lg mx-auto">
                Have a project in mind or just want to say hi? Fill out the form below and I'll get back to you shortly.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-5 sm:p-8 md:p-12 ambient-shadow rounded-xl border border-secondary border-opacity-[0.08] relative overflow-hidden">
              {formStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                  <span className="material-symbols-outlined text-primary text-[64px] mb-4">check_circle</span>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">Thank you!</h3>
                  <p className="font-body-md text-body-md text-secondary">Your message has been sent successfully. I will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 sm:gap-stack-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-stack-md">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-secondary" htmlFor="name">Name</label>
                      <input
                        className="w-full bg-background border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-4 py-3 font-body-md text-body-md text-primary outline-none transition-colors duration-300 placeholder:text-outline-variant rounded-t-DEFAULT"
                        id="name"
                        name="name"
                        placeholder="Jane Doe"
                        required
                        type="text"
                        disabled={formStatus === "submitting"}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-secondary" htmlFor="email">Email</label>
                      <input
                        className="w-full bg-background border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-4 py-3 font-body-md text-body-md text-primary outline-none transition-colors duration-300 placeholder:text-outline-variant rounded-t-DEFAULT"
                        id="email"
                        name="email"
                        placeholder="jane@example.com"
                        required
                        type="email"
                        disabled={formStatus === "submitting"}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-secondary" htmlFor="message">Message</label>
                    <textarea
                      className="w-full bg-background border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-4 py-3 font-body-md text-body-md text-primary outline-none transition-colors duration-300 placeholder:text-outline-variant resize-none rounded-t-DEFAULT"
                      id="message"
                      name="message"
                      placeholder="Tell me about your project..."
                      required
                      rows={5}
                      disabled={formStatus === "submitting"}
                    ></textarea>
                  </div>
                  <div className="pt-4 flex justify-center md:justify-start">
                    <button
                      className="bg-primary text-on-primary font-label-md text-label-md px-10 py-4 rounded-DEFAULT hover:-translate-y-[2px] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2 group"
                      type="submit"
                      disabled={formStatus === "submitting"}
                    >
                      {formStatus === "submitting" ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          Send Message
                          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="flex flex-col items-center gap-stack-sm pt-6 md:pt-stack-md border-t border-secondary border-opacity-15">
              <p className="font-label-md text-label-md text-secondary">Or find me on</p>
              <div className="flex gap-gutter">
                <a className="font-body-md text-body-md text-primary hover:text-secondary transition-colors duration-200 underline decoration-1 underline-offset-4" href="#">LinkedIn</a>
                <a className="font-body-md text-body-md text-primary hover:text-secondary transition-colors duration-200 underline decoration-1 underline-offset-4" href="#">Dribbble</a>
                <a className="font-body-md text-body-md text-primary hover:text-secondary transition-colors duration-200 underline decoration-1 underline-offset-4" href="#">Twitter</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="w-full bg-background dark:bg-background border-t border-secondary border-opacity-15">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-x py-stack-lg flex flex-col md:flex-row justify-between items-center gap-stack-md">
          {/* Brand Logo */}
          <span className="font-label-md text-label-md font-bold text-primary dark:text-on-primary">STUDIO_M</span>
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-gutter items-center">
            <a className="font-caption text-caption text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-opacity duration-200 hover:opacity-80" href="#">LinkedIn</a>
            <a className="font-caption text-caption text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-opacity duration-200 hover:opacity-80" href="#">Twitter</a>
            <a className="font-caption text-caption text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-opacity duration-200 hover:opacity-80" href="#">Dribbble</a>
            <a className="font-caption text-caption text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-opacity duration-200 hover:opacity-80" href="#">Email</a>
          </div>
          {/* Copyright */}
          <span className="font-caption text-caption text-secondary dark:text-on-secondary-container text-center md:text-left">© 2024 Studio M. All rights reserved.</span>
        </div>
      </footer>

      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-8 sm:right-8 bg-primary text-on-primary px-6 py-4 rounded-lg shadow-xl animate-slide-in flex items-center gap-3 z-50">
          <span className="material-symbols-outlined">info</span>
          <span className="font-body-md text-body-md">{toastMessage}</span>
        </div>
      )}
    </>
  );
}
