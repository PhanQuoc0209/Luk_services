'use client';

import React, { useEffect, useRef } from 'react';

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55; // seconds before end of video

export function FadingVideo({ src, className = '', style = {} }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start with opacity 0
    video.style.opacity = '0';

    const cancelCurrentFade = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const fadeTo = (targetOpacity: number, durationMs = FADE_MS) => {
      cancelCurrentFade();
      const currentOpacity = parseFloat(video.style.opacity || '0') || 0;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * progress;
        video.style.opacity = String(newOpacity);

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(step);
        } else {
          video.style.opacity = String(targetOpacity);
          rafIdRef.current = null;
        }
      };

      rafIdRef.current = requestAnimationFrame(step);
    };

    const handleLoadedData = () => {
      video.style.opacity = '0';
      video.play().catch(() => {
        // Autoplay may be deferred by browser policy
      });
      fadeTo(1, FADE_MS);
    };

    const handleTimeUpdate = () => {
      if (
        !fadingOutRef.current &&
        video.duration &&
        video.duration - video.currentTime <= FADE_OUT_LEAD &&
        video.duration - video.currentTime > 0
      ) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1, FADE_MS);
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // If video is already ready
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      cancelCurrentFade();
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{
        ...style,
        opacity: 0,
        transition: 'none', // No CSS transition per specification
      }}
    />
  );
}
