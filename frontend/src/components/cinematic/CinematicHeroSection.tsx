'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadingVideo } from './FadingVideo';
import { BlurText } from './BlurText';

const HERO_VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4';

const PARTNERS = ['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno'];

export function CinematicHeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col justify-between">
      {/* Background Video: 120% width/height, top-aligned, centered horizontally */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <FadingVideo
          src={HERO_VIDEO_SRC}
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
          style={{ width: '120%', height: '120%' }}
        />
      </div>

      {/* Hero Content (centered, pt-24 px-4 flex-1 flex flex-col items-center justify-center text-center z-10) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-28 pb-12 px-4 max-w-4xl mx-auto text-center">
        {/* Badge (delay 0.4s) */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="liquid-glass rounded-full inline-flex items-center gap-2 p-1 pr-3.5 mb-6"
        >
          <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full font-body">
            New
          </span>
          <span className="text-sm text-white/90 font-body">
            Maiden Crewed Voyage to Mars Arrives 2026
          </span>
        </motion.div>

        {/* Headline — BlurText component */}
        <BlurText
          text="Venture Past Our Sky Across the Universe"
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl justify-center tracking-[-4px]"
        />

        {/* Subheading (delay 0.8s) */}
        <motion.p
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          className="mt-6 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight text-center"
        >
          Discover the universe in ways once unimaginable. Our pioneering vessels and
          breakthrough engineering bring deep-space exploration within reach—secure and
          extraordinary.
        </motion.p>

        {/* CTAs (delay 1.1s) */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
          className="flex items-center gap-6 mt-6"
        >
          {/* Primary CTA */}
          <Link
            href="/services"
            className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform font-body"
          >
            <span>Start Your Voyage</span>
            <svg
              className="w-5 h-5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </Link>

          {/* Secondary CTA */}
          <a
            href="#capabilities"
            className="text-sm font-medium text-white flex items-center gap-2 hover:opacity-80 transition-opacity font-body"
          >
            <span>View Liftoff</span>
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </a>
        </motion.div>

        {/* Stats row (delay 1.3s) */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: 'easeOut' }}
          className="flex flex-wrap items-stretch justify-center gap-4 mt-8"
        >
          {/* Stat Card 1 */}
          <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] flex flex-col justify-between text-left">
            <div>
              <svg
                className="w-7 h-7 stroke-white mb-3"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="font-heading italic text-white text-4xl tracking-[-1px] leading-none">
                34.5 Min
              </p>
              <p className="text-xs text-white font-body font-light mt-2">
                Average Videos Watch Time
              </p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] flex flex-col justify-between text-left">
            <div>
              <svg
                className="w-7 h-7 stroke-white mb-3"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <p className="font-heading italic text-white text-4xl tracking-[-1px] leading-none">
                2.8B+
              </p>
              <p className="text-xs text-white font-body font-light mt-2">
                Users Across the Globe
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Partners (bottom of hero, delay 1.4s) */}
      <motion.div
        initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
        animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-4 pb-8"
      >
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
          Collaborating with top aerospace pioneers globally
        </span>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {PARTNERS.map((partner) => (
            <span
              key={partner}
              className="font-heading italic text-white text-2xl md:text-3xl tracking-tight select-none opacity-90 hover:opacity-100 transition-opacity"
            >
              {partner}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
