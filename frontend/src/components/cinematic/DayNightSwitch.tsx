// Lucian UX/UI Prompt #021 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#021
'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/components/providers/AppProvider';

interface DayNightSwitchProps {
  className?: string;
}

export function DayNightSwitch({ className = '' }: DayNightSwitchProps) {
  const { theme, toggleTheme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isNight = theme === 'dark';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`u021-wrapper relative inline-flex items-center select-none ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Switch styles scoped strictly to .u021 */}
      <style jsx>{`
        .u021-sw {
          position: relative;
          width: 82px;
          height: 38px;
          border: 0;
          padding: 0;
          border-radius: 999px;
          overflow: hidden;
          isolation: isolate;
          background: linear-gradient(180deg, #5db7ff, #9ed8ff);
          box-shadow: inset 0 2px 5px rgba(0, 30, 80, 0.28),
            inset 0 -1px 2px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(40, 110, 200, 0.5);
          transition: box-shadow 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
        }
        .u021-sw::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(180deg, #141a3a, #232c5c);
          opacity: 0;
          transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .u021-sw:focus-visible {
          outline: 2px solid #b7a4ff;
          outline-offset: 3px;
        }
        .is-night .u021-sw::before {
          opacity: 1;
        }
        .is-night .u021-sw {
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6),
            inset 0 -1px 2px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(20, 24, 70, 0.7);
        }

        .u021-halo {
          position: absolute;
          z-index: 1;
          left: 19px;
          top: 19px;
          width: 0;
          height: 0;
          transition: transform 0.9s cubic-bezier(0.34, 1.45, 0.64, 1);
        }
        .u021-halo i {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
        }
        .u021-halo i:nth-child(1) {
          width: 50px;
          height: 50px;
          margin: -25px;
        }
        .u021-halo i:nth-child(2) {
          width: 68px;
          height: 68px;
          margin: -34px;
        }
        .u021-halo i:nth-child(3) {
          width: 86px;
          height: 86px;
          margin: -43px;
        }
        .is-night .u021-halo {
          transform: translateX(44px);
        }

        .u021-knob {
          position: absolute;
          z-index: 3;
          left: 4px;
          top: 4px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          background: radial-gradient(circle at 35% 30%, #fff1a8, #ffd23f 45%, #f8a91e);
          box-shadow: 0 2px 6px -1px rgba(140, 80, 0, 0.5),
            inset -2px -3px 5px rgba(200, 110, 0, 0.35), inset 2px 2px 4px rgba(255, 255, 255, 0.5);
          transition: transform 0.9s cubic-bezier(0.34, 1.45, 0.64, 1);
        }
        .u021-moon {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #f4f6fb, #c9cfdd 60%, #a9b0c2);
          opacity: 0;
          transform: translateX(100%);
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
            opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .u021-moon i {
          position: absolute;
          border-radius: 50%;
          background: #a3aabc;
          box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.18);
        }
        .u021-moon i:nth-child(1) {
          left: 8px;
          top: 6px;
          width: 8px;
          height: 8px;
        }
        .u021-moon i:nth-child(2) {
          left: 17px;
          top: 15px;
          width: 6px;
          height: 6px;
        }
        .u021-moon i:nth-child(3) {
          left: 9px;
          top: 18px;
          width: 4px;
          height: 4px;
        }
        .is-night .u021-knob {
          transform: translateX(44px) rotate(200deg);
        }
        .is-night .u021-moon {
          opacity: 1;
          transform: none;
        }

        .u021-clouds {
          position: absolute;
          z-index: 2;
          inset: 0;
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
            opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .u021-clouds i {
          position: absolute;
          border-radius: 999px;
          background: #fff;
        }
        .u021-clouds i:nth-child(1) {
          right: -4px;
          bottom: -8px;
          width: 48px;
          height: 24px;
          box-shadow: -18px 3px 0 -2px #fff, -32px 7px 0 -4px #fff;
        }
        .u021-clouds i:nth-child(2) {
          right: 8px;
          bottom: -12px;
          width: 38px;
          height: 20px;
          background: #e3f1ff;
          box-shadow: -17px 2px 0 -3px #e3f1ff;
          z-index: -1;
        }
        .is-night .u021-clouds {
          transform: translateY(35px);
          opacity: 0;
        }

        .u021-stars {
          position: absolute;
          z-index: 1;
          inset: 0;
          opacity: 0;
          transform: translateY(-12px);
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
            opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .u021-stars i {
          position: absolute;
          width: 2.5px;
          height: 2.5px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 3px #fff;
          animation: u021-tw 2.4s ease-in-out infinite;
        }
        .is-night .u021-stars {
          opacity: 1;
          transform: none;
        }
        @keyframes u021-tw {
          50% {
            opacity: 0.3;
            transform: scale(0.6);
          }
        }
      `}</style>

      <div className={`u021 ${isNight ? 'is-night' : ''}`}>
        <button
          className="u021-sw"
          type="button"
          role="switch"
          aria-checked={isNight}
          aria-label={isNight ? 'Chuyển sang chế độ ban ngày' : 'Chuyển sang chế độ ban đêm'}
          onClick={toggleTheme}
          onKeyDown={handleKeyDown}
        >
          <span className="u021-halo" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="u021-stars" aria-hidden="true">
            <i style={{ left: '12px', top: '8px' }} />
            <i style={{ left: '24px', top: '22px', animationDelay: '-0.6s' }} />
            <i style={{ left: '35px', top: '10px', animationDelay: '-1.2s' }} />
            <i style={{ left: '18px', top: '28px', animationDelay: '-1.8s' }} />
          </span>
          <span className="u021-clouds" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="u021-knob" aria-hidden="true">
            <span className="u021-moon">
              <i />
              <i />
              <i />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
