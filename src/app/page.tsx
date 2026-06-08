"use client";

import React, { useState } from "react";

// Project Type Definition
interface Project {
  id: number;
  title: string;
  category: "UI/UX" | "Identity" | "E-Commerce" | "All";
  subcategory: string;
  image: string;
  link: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Fintech Analytics Platform",
    category: "UI/UX",
    subcategory: "Dashboard",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASUBcf_C7ki9Yima1qflJya8xHOtYv0NjXeVc2K8-U0piY9cCbulNwouO9flnvZHD41ZZl227Y47sMeQHpw-fHIbf5MIL_0lK2yGmCZADZjk9j5OgcqdZ_YF463O6aSse5QwPUn2W0wP8ISUmXgLmLiSAAR-E6oe72uy90hh5JlA14mE8OlfCApluTLkmztIEIpdfihCpmMcdKuOWBN_t9ZLciWv4rn-hz-EX2VZzAEbwzafTK_IwkmGqOVcNNkQC6fnoL0mCIPgX5",
    link: "#"
  },
  {
    id: 2,
    title: "Aura Studio Rebrand",
    category: "Identity",
    subcategory: "Identity",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwr8pGE7XwHANbLzmzcr38FWoq3nm1weflKzqgdMj2mI-0_JMRDtXih2w6NHOs8ptqnUxTU58UlHVGF1UHbYNgVHuQk3cujhX8pyLUNpnVA9i-H4vhPnaJ1Csf9velOg1idI8TTzJ-2VAVUhD33GTJzET5KhPYXga1TczEHPw8KpvpjTrwT-2gUJvJtOCIJdhf0C98w05cgIa5awVqkoS7w4jyQnRCNPl-Stbtrij5T18OfCj2-7NjmCPqac7IGDZgGZp9bNMpka8s",
    link: "#"
  },
  {
    id: 3,
    title: "Lumina Fashion Flagship",
    category: "E-Commerce",
    subcategory: "E-Commerce",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDel_u4CZwytJYLCuYlzVLqwaTgqgt_towmWNDd-n01szAM7jBf-XkjwLy2tnqPLLHVP4IJaaoRDHHTo0dFALDeWejg7K55-OAGepWhciCiOe80ONyKdIPnQp_YaIHfXWVLTHfdnDVxUOzjFtJLiyEGg_JN79kJp6M4QhbqAVp0LgE3pvRJwr3eoVfwfymx4r9dYtNyhUhT6Md8RNpy06j22psHyHcfW_EboDUXzCtXO6RpZXWSBrT517H4nNumTufdIBz5V-bp3svC",
    link: "#"
  },
  {
    id: 4,
    title: "HealthSync Mobile App",
    category: "UI/UX",
    subcategory: "UI/UX",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnKl4nbfCNkcxR6U29hgx4turXMfKj1nQV5MZ3l0BJL5nVKQy_gsyJFtkfhd-AWZ2q0YIJe86z4hRW5FzKqvK5yDH8xATZi0Iqwis15gwMHmqv9jCDD14SmaG2qIqqZisH1RoOqbJFinAljGwFWDBPEAd0VHNrfohMD7Kk9BtXSYT4vcEjP2jLllh9WTDp4nPAwuGenky6kKamEFc9NKhOkR8MqTKZbEYAR1qPY68SJ-t6YhEXpdKD9w38HFPRwhTwMTaDgDr8f8Yd",
    link: "#"
  }
];

const MORE_PROJECTS: Project[] = [
  {
    id: 5,
    title: "EcoSmart Energy Dashboard",
    category: "UI/UX",
    subcategory: "Web App",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASUBcf_C7ki9Yima1qflJya8xHOtYv0NjXeVc2K8-U0piY9cCbulNwouO9flnvZHD41ZZl227Y47sMeQHpw-fHIbf5MIL_0lK2yGmCZADZjk9j5OgcqdZ_YF463O6aSse5QwPUn2W0wP8ISUmXgLmLiSAAR-E6oe72uy90hh5JlA14mE8OlfCApluTLkmztIEIpdfihCpmMcdKuOWBN_t9ZLciWv4rn-hz-EX2VZzAEbwzafTK_IwkmGqOVcNNkQC6fnoL0mCIPgX5",
    link: "#"
  },
  {
    id: 6,
    title: "Zenith Identity System",
    category: "Identity",
    subcategory: "Branding",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwr8pGE7XwHANbLzmzcr38FWoq3nm1weflKzqgdMj2mI-0_JMRDtXih2w6NHOs8ptqnUxTU58UlHVGF1UHbYNgVHuQk3cujhX8pyLUNpnVA9i-H4vhPnaJ1Csf9velOg1idI8TTzJ-2VAVUhD33GTJzET5KhPYXga1TczEHPw8KpvpjTrwT-2gUJvJtOCIJdhf0C98w05cgIa5awVqkoS7w4jyQnRCNPl-Stbtrij5T18OfCj2-7NjmCPqac7IGDZgGZp9bNMpka8s",
    link: "#"
  }
];

export default function Home() {
  // State variables
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isLoadedMore, setIsLoadedMore] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handlers
  const handleLoadMore = () => {
    if (!isLoadedMore) {
      setProjects((prev) => [...prev, ...MORE_PROJECTS]);
      setIsLoadedMore(true);
    }
  };

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
    if (activeCategory === "UI/UX") return project.category === "UI/UX";
    if (activeCategory === "Identity") return project.category === "Identity";
    return true;
  });

  return (
    <>
      {/* TopNavBar Component */}
      <header className="w-full sticky top-0 z-50 bg-background/90 backdrop-blur-md dark:bg-background/90 border-b border-secondary/10">
        <nav className="max-w-container-max mx-auto px-margin-x flex justify-between items-center h-20 transition-all duration-200">
          {/* Brand Logo */}
          <a className="font-headline-md text-headline-md font-bold text-primary dark:text-on-primary hover:opacity-80 transition-opacity" href="#home">
            STUDIO_M
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-gutter">
            <a 
              className={`font-label-md text-label-md pb-1 transition-all duration-200 active:scale-95 border-b-2 ${
                activeCategory === "Home" ? "text-primary dark:text-on-primary font-bold border-primary dark:border-on-primary" : "text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary border-transparent"
              }`} 
              href="#home"
            >
              Home
            </a>
            <a className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-colors duration-300 transition-all duration-200 active:scale-95" href="#works">Works</a>
            <a className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-colors duration-300 transition-all duration-200 active:scale-95" href="#about">About</a>
            <a className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-colors duration-300 transition-all duration-200 active:scale-95" href="#contact">Contact</a>
          </div>

          {/* Trailing Action */}
          <div className="hidden md:block">
            <a className="inline-flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 active:scale-95" href="#contact">
              Let's Talk
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            className="md:hidden text-primary p-2 focus:outline-none rounded hover:bg-surface-container-low transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-secondary/15 animate-fade-in z-40">
            <div className="flex flex-col p-6 space-y-4">
              <a 
                className="font-label-md text-label-md text-primary dark:text-on-primary font-bold py-2 border-b border-surface-container"
                href="#home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary py-2 border-b border-surface-container"
                href="#works"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Works
              </a>
              <a 
                className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary py-2 border-b border-surface-container"
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary py-2 border-b border-surface-container"
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <a 
                className="inline-flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md py-3 rounded hover:-translate-y-0.5 transition-all duration-200" 
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Let's Talk
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Home Section */}
        <section className="max-w-container-max mx-auto px-margin-x pt-section-gap pb-section-gap flex flex-col items-start justify-center min-h-[716px]" id="home">
          <h1 className="font-display text-display md:text-[80px] leading-tight text-primary max-w-4xl mb-stack-lg">
            Crafting digital experiences with precision.
          </h1>
          <div className="flex flex-col md:flex-row gap-stack-md md:gap-gutter items-start md:items-center w-full max-w-2xl border-l-2 border-outline-variant pl-stack-md">
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Based in Tokyo, specializing in UI/UX and visual identity. I build interfaces that prioritize clarity, performance, and editorial aesthetics for modern web platforms.
            </p>
            <div className="flex items-center gap-2 text-secondary shrink-0">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Tokyo, JP</span>
            </div>
          </div>
        </section>

        {/* Works Gallery Section */}
        <section className="max-w-container-max mx-auto px-margin-x py-section-gap" id="works">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-stack-lg gap-stack-md">
            <div>
              <h2 className="font-display text-headline-lg-mobile md:text-display text-primary mb-stack-sm">Selected Works</h2>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl">A curated collection of digital experiences, brand identities, and interfaces designed for modern businesses.</p>
            </div>
            <div className="flex gap-4 items-center">
              <button 
                className={`font-label-md text-label-md pb-1 transition-colors ${
                  activeCategory === "All" ? "text-primary border-b border-primary" : "text-secondary hover:text-primary"
                }`}
                onClick={() => setActiveCategory("All")}
              >
                All
              </button>
              <button 
                className={`font-label-md text-label-md pb-1 transition-colors ${
                  activeCategory === "UI/UX" ? "text-primary border-b border-primary" : "text-secondary hover:text-primary"
                }`}
                onClick={() => setActiveCategory("UI/UX")}
              >
                UI/UX
              </button>
              <button 
                className={`font-label-md text-label-md pb-1 transition-colors ${
                  activeCategory === "Identity" ? "text-primary border-b border-primary" : "text-secondary hover:text-primary"
                }`}
                onClick={() => setActiveCategory("Identity")}
              >
                Identity
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {filteredProjects.map((project, index) => {
              // Replicate the staggered margin for columns in desktop view: "md:mt-12" for even elements
              const staggerClass = index % 2 === 1 ? "md:mt-12" : "";
              return (
                <a 
                  key={project.id}
                  className={`group block ambient-shadow bg-surface-container-lowest rounded-DEFAULT overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${staggerClass} animate-fade-in`} 
                  href={project.link}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-low relative">
                    <img 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={project.image}
                    />
                  </div>
                  <div className="p-6">
                    <span className="font-label-md text-label-md text-secondary mb-2 block uppercase tracking-wider">{project.subcategory}</span>
                    <h3 className="font-headline-md text-headline-md text-primary">{project.title}</h3>
                  </div>
                </a>
              );
            })}
          </div>

          {!isLoadedMore && (activeCategory === "All" || activeCategory === "UI/UX" || activeCategory === "Identity") && (
            <div className="mt-stack-lg flex justify-center">
              <button 
                className="font-label-md text-label-md bg-transparent border border-outline text-primary px-8 py-3 rounded hover:bg-surface-container-low transition-colors duration-200"
                onClick={handleLoadMore}
              >
                Load More Works
              </button>
            </div>
          )}
        </section>

        {/* About Me Section */}
        <section className="max-w-container-max mx-auto px-margin-x py-section-gap" id="about">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center mb-section-gap">
            <div className="md:col-span-7 flex flex-col gap-stack-md order-2 md:order-1">
              <h2 className="font-display text-display text-primary">Crafting digital clarity.</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-8 bg-surface-container-lowest rounded-lg p-stack-lg ambient-shadow flex flex-col gap-stack-md">
              <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2 border-b border-outline-variant pb-4">
                <span className="material-symbols-outlined">work</span> Experience
              </h3>
              <div className="flex flex-col">
                <div className="py-stack-md border-b border-outline-variant/30 last:border-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="font-label-md text-label-md text-secondary">2020 — Present</div>
                  <div className="md:col-span-2">
                    <h4 className="font-headline-md text-body-lg text-primary font-medium">Design Director</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Studio Minimal</p>
                    <p className="font-body-md text-body-md text-secondary mt-2">Leading design strategy and execution for premium tech clients, focusing on rigorous design systems and brand consistency.</p>
                  </div>
                </div>
                <div className="py-stack-md border-b border-outline-variant/30 last:border-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="font-label-md text-label-md text-secondary">2016 — 2020</div>
                  <div className="md:col-span-2">
                    <h4 className="font-headline-md text-body-lg text-primary font-medium">Senior Product Designer</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Fintech Corp</p>
                    <p className="font-body-md text-body-md text-secondary mt-2">Designed complex financial dashboards. Streamlined user workflows resulting in a 40% reduction in task completion time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-gutter">
              <div className="bg-surface-container-lowest rounded-lg p-stack-md ambient-shadow">
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

              <div className="bg-primary text-on-primary rounded-lg p-stack-md flex-grow flex flex-col justify-center">
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
        <section className="bg-surface-container-low py-section-gap" id="contact">
          <div className="max-w-[720px] mx-auto w-full px-margin-x flex flex-col gap-stack-lg">
            <div className="text-center flex flex-col gap-stack-sm">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Get in touch.</h2>
              <p className="font-body-lg text-body-lg text-secondary max-w-lg mx-auto">
                Have a project in mind or just want to say hi? Fill out the form below and I'll get back to you shortly.
              </p>
            </div>
            
            <div className="bg-surface-container-lowest p-8 md:p-12 ambient-shadow rounded-xl border border-secondary border-opacity-[0.08] relative overflow-hidden">
              {formStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                  <span className="material-symbols-outlined text-primary text-[64px] mb-4">check_circle</span>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">Thank you!</h3>
                  <p className="font-body-md text-body-md text-secondary">Your message has been sent successfully. I will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-stack-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
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

            <div className="flex flex-col items-center gap-stack-sm pt-stack-md border-t border-secondary border-opacity-15">
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
        <div className="max-w-container-max mx-auto px-margin-x py-stack-lg flex flex-col md:flex-row justify-between items-center gap-stack-md">
          {/* Brand Logo */}
          <span className="font-label-md text-label-md font-bold text-primary dark:text-on-primary">STUDIO_M</span>
          {/* Footer Links */}
          <div className="flex gap-gutter items-center">
            <a className="font-caption text-caption text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-opacity duration-200 hover:opacity-80" href="#">LinkedIn</a>
            <a className="font-caption text-caption text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-opacity duration-200 hover:opacity-80" href="#">Twitter</a>
            <a className="font-caption text-caption text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-opacity duration-200 hover:opacity-80" href="#">Dribbble</a>
            <a className="font-caption text-caption text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-opacity duration-200 hover:opacity-80" href="#">Email</a>
          </div>
          {/* Copyright */}
          <span className="font-caption text-caption text-secondary dark:text-on-secondary-container">© 2024 Studio M. All rights reserved.</span>
        </div>
      </footer>

      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-primary text-on-primary px-6 py-4 rounded-lg shadow-xl animate-slide-in flex items-center gap-3 z-50">
          <span className="material-symbols-outlined">info</span>
          <span className="font-body-md text-body-md">{toastMessage}</span>
        </div>
      )}
    </>
  );
}
