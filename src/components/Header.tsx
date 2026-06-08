"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-background/90 backdrop-blur-md dark:bg-background/90 border-b border-secondary/10">
      <nav className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-x flex justify-between items-center h-20 transition-all duration-200">
        {/* Brand Logo */}
        <Link 
          className="font-headline-md text-[18px] sm:text-headline-md font-bold text-primary dark:text-on-primary hover:opacity-80 transition-opacity" 
          href="/#home"
          id="header-brand-logo"
        >
          Shintaro.T's Portfolio
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-gutter">
          <Link className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-colors duration-300 transition-all duration-200 active:scale-95" href="/#home" id="nav-home">Home</Link>
          <Link className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-colors duration-300 transition-all duration-200 active:scale-95" href="/#works" id="nav-works">Works</Link>
          <Link className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-colors duration-300 transition-all duration-200 active:scale-95" href="/#about" id="nav-about">About</Link>
          <Link className="font-label-md text-label-md text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-primary transition-colors duration-300 transition-all duration-200 active:scale-95" href="/#contact" id="nav-contact">Contact</Link>
        </div>

        {/* Trailing Action */}
        <div className="hidden md:block">
          <Link 
            className="inline-flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 active:scale-95" 
            href="/#contact"
            id="nav-lets-talk"
          >
            Let's Talk
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          id="mobile-menu-trigger"
          className="md:hidden text-primary p-2 focus:outline-none rounded hover:bg-surface-container-low transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`md:hidden fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-background/95 backdrop-blur-md z-40 flex flex-col justify-center items-center pb-16 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"}`}>
        <div className="flex flex-col space-y-6 text-center w-full max-w-xs px-6">
          <Link
            className="font-display text-3xl font-semibold text-primary dark:text-on-primary py-2 transition-all duration-200 active:scale-95"
            href="/#home"
            onClick={() => setIsMobileMenuOpen(false)}
            id="mobile-nav-home"
          >
            Home
          </Link>
          <Link
            className="font-display text-3xl font-semibold text-secondary hover:text-primary dark:text-on-secondary-container py-2 transition-all duration-200 active:scale-95"
            href="/#works"
            onClick={() => setIsMobileMenuOpen(false)}
            id="mobile-nav-works"
          >
            Works
          </Link>
          <Link
            className="font-display text-3xl font-semibold text-secondary hover:text-primary dark:text-on-secondary-container py-2 transition-all duration-200 active:scale-95"
            href="/#about"
            onClick={() => setIsMobileMenuOpen(false)}
            id="mobile-nav-about"
          >
            About
          </Link>
          <Link
            className="font-display text-3xl font-semibold text-secondary hover:text-primary dark:text-on-secondary-container py-2 transition-all duration-200 active:scale-95"
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            id="mobile-nav-contact"
          >
            Contact
          </Link>
          <div className="pt-4">
            <Link
              className="inline-flex items-center justify-center bg-primary text-on-primary font-body-lg text-body-lg px-8 py-4 w-full rounded hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 active:scale-95"
              href="/#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              id="mobile-nav-lets-talk"
            >
              Let's Talk
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
