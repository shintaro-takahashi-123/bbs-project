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

  if (cleanStr.includes("年")) {
    return cleanStr;
  }
  
  const matchYMD = cleanStr.match(/^(\d{4})[.-](\d{2})[.-](\d{2})(?:T|\s|$)/);
  if (matchYMD) {
    return `${matchYMD[1]}年${parseInt(matchYMD[2], 10)}月${parseInt(matchYMD[3], 10)}日`;
  }
  
  const matchYM = cleanStr.match(/^(\d{4})[.-](\d{2})$/);
  if (matchYM) {
    return `${matchYM[1]}年${parseInt(matchYM[2], 10)}月`;
  }
  
  const matchY = cleanStr.match(/^(\d{4})$/);
  if (matchY) {
    return `${matchY[1]}年`;
  }

  const rangeMatch = cleanStr.match(/^(\d{4})[.-](\d{2})\s*[—-]\s*(\d{4})[.-](\d{2})$/);
  if (rangeMatch) {
    return `${rangeMatch[1]}年${parseInt(rangeMatch[2], 10)}月〜${rangeMatch[3]}年${parseInt(rangeMatch[4], 10)}月`;
  }

  const presentMatch = cleanStr.match(/^(\d{4})[.-](\d{2})\s*[—-]\s*(?:現在|Present|present)$/);
  if (presentMatch) {
    return `${presentMatch[1]}年${parseInt(presentMatch[2], 10)}月〜現在`;
  }

  if (cleanStr.includes("-") || cleanStr.includes("/")) {
    const timestamp = Date.parse(cleanStr);
    if (!isNaN(timestamp)) {
      const d = new Date(timestamp);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
  }

  return "";
}

export default function WorksArchive() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [projects, setProjects] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set page title for SEO
  useEffect(() => {
    document.title = "実績・経歴・資格一覧 | Shintaro Takahashi Portfolio";
  }, []);

  // Fetch works from the secure local API
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

  const categoryLabels: Record<string, string> = {
    Career: "経歴",
    Qualification: "資格取得",
    Workflow: "ワークフロー",
    others: "その他"
  };

  const renderPlaceholder = (project: WorkItem) => {
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
        <span className="material-symbols-outlined text-[48px] text-secondary opacity-60">{icon}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow max-w-container-max w-full mx-auto px-4 sm:px-6 md:px-margin-x py-12 md:py-16">
        {/* Title and Description */}
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="font-display text-headline-lg-mobile md:text-display text-primary" id="page-title">
            Career & Workflow 一覧
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-3xl">
            セキュリティコンサルタントを目指す高橋慎太郎のこれまでの経歴、取得資格、および実践的なセキュリティ支援のアプローチ（ワークフロー）の全履歴です。
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 sm:gap-4 items-center flex-wrap mb-10 pb-4 border-b border-secondary/10">
          <button
            id="filter-all"
            className={`font-label-md text-label-md px-3 py-1.5 rounded transition-all duration-200 ${
              activeCategory === "All"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:text-primary hover:bg-secondary/5"
            }`}
            onClick={() => setActiveCategory("All")}
          >
            すべて
          </button>
          <button
            id="filter-career"
            className={`font-label-md text-label-md px-3 py-1.5 rounded transition-all duration-200 ${
              activeCategory === "Career"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:text-primary hover:bg-secondary/5"
            }`}
            onClick={() => setActiveCategory("Career")}
          >
            経歴
          </button>
          <button
            id="filter-qualification"
            className={`font-label-md text-label-md px-3 py-1.5 rounded transition-all duration-200 ${
              activeCategory === "Qualification"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:text-primary hover:bg-secondary/5"
            }`}
            onClick={() => setActiveCategory("Qualification")}
          >
            資格
          </button>
          <button
            id="filter-workflow"
            className={`font-label-md text-label-md px-3 py-1.5 rounded transition-all duration-200 ${
              activeCategory === "Workflow"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:text-primary hover:bg-secondary/5"
            }`}
            onClick={() => setActiveCategory("Workflow")}
          >
            ワークフロー
          </button>
          <button
            id="filter-others"
            className={`font-label-md text-label-md px-3 py-1.5 rounded transition-all duration-200 ${
              activeCategory === "others"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-secondary hover:text-primary hover:bg-secondary/5"
            }`}
            onClick={() => setActiveCategory("others")}
          >
            その他
          </button>
        </div>

        {/* Results grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="block bg-surface-container-lowest rounded-lg overflow-hidden animate-pulse border border-secondary/5"
              >
                <div className="aspect-[16/9] w-full bg-surface-container-low" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 bg-surface-container-low rounded w-1/4" />
                  <div className="h-6 bg-surface-container-low rounded w-3/4" />
                  <div className="h-4 bg-surface-container-low rounded w-full" />
                  <div className="h-4 bg-surface-container-low rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                className="group block ambient-shadow bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-secondary/5 flex flex-col"
              >
                <a
                  href={project.link || "#"}
                  target={project.link ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex-grow flex flex-col"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-surface-container-low relative border-b border-secondary/5 shrink-0">
                    {project.image ? (
                      <img
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={project.image}
                      />
                    ) : (
                      renderPlaceholder(project)
                    )}
                    {project.date && (
                      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-label-md text-secondary shadow-sm">
                        {formatDate(project.date) || project.date}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-grow justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-label-md text-caption text-secondary uppercase tracking-wider truncate max-w-[150px]">
                          {project.subcategory}
                        </span>
                        <span className="text-caption font-label-md px-2 py-0.5 rounded bg-surface-container-low text-secondary border border-secondary/5 shrink-0">
                          {categoryLabels[project.category] || project.category}
                        </span>
                      </div>
                      <h2 className="text-[18px] text-primary font-semibold leading-snug group-hover:text-primary/80 transition-colors">
                        {project.title}
                      </h2>
                      {project.description && (
                        <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed line-clamp-4">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-container-lowest rounded-lg border border-dashed border-secondary/20">
            <span className="material-symbols-outlined text-[48px] text-secondary/40 mb-3">folder_open</span>
            <p className="font-body-lg text-body-lg text-secondary">該当する項目が見つかりませんでした。</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-background dark:bg-background border-t border-secondary border-opacity-15 mt-auto">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-x py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-label-md text-label-md font-bold text-primary dark:text-on-primary">STUDIO_M</span>
          <span className="font-caption text-caption text-secondary dark:text-on-secondary-container text-center md:text-left">
            © 2026 Studio M. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
