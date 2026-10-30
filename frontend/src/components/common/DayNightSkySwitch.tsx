/* Lucian UX/UI Prompt #021 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#021 */
'use client';

import React from 'react';
import { useApp } from '@/components/providers/AppProvider';

interface DayNightSkySwitchProps {
  /**
   * 'sm' for compact navbar / header placement (~66x30px)
   * 'md' for original full-size prompt element (224x94px)
   */
  size?: 'sm' | 'md';
  /** Show animated Clear day / Quiet night label */
  showLabel?: boolean;
  /** Extra CSS classes */
  className?: string;
  /** Custom aria-label */
  ariaLabel?: string;
}

export function DayNightSkySwitch({
  size = 'sm',
  showLabel = false,
  className = '',
  ariaLabel,
}: DayNightSkySwitchProps) {
  const { theme, toggleTheme } = useApp();
  const isNight = theme === 'dark';

  const defaultAriaLabel = isNight
    ? 'Chuyển sang chế độ ban ngày (buổi sáng)'
    : 'Chuyển sang chế độ ban đêm (buổi tối)';

  return (
    <div
      className={`ux u021 u021--${size} ${isNight ? 'is-night' : ''} ${className}`}
    >
      <button
        type="button"
        className="u021-sw"
        role="switch"
        aria-checked={isNight}
        aria-label={ariaLabel || defaultAriaLabel}
        title={isNight ? 'Chuyển sang buổi sáng' : 'Chuyển sang ban đêm'}
        onClick={toggleTheme}
      >
        {/* Sun/Moon Atmospheric Halo */}
        <span className="u021-halo" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        {/* Twinkling Night Stars */}
        <span className="u021-stars" aria-hidden="true">
          {size === 'md' ? (
            <>
              <i style={{ left: '30px', top: '20px' }} />
              <i style={{ left: '58px', top: '56px', animationDelay: '-0.6s', width: '3px', height: '3px' }} />
              <i style={{ left: '86px', top: '26px', animationDelay: '-1.2s' }} />
              <i style={{ left: '44px', top: '72px', animationDelay: '-1.8s', width: '3px', height: '3px' }} />
              <i style={{ left: '110px', top: '60px', animationDelay: '-0.9s', width: '2px', height: '2px' }} />
              <i style={{ left: '20px', top: '46px', animationDelay: '-1.5s', width: '2px', height: '2px' }} />
            </>
          ) : (
            <>
              <i style={{ left: '10px', top: '7px' }} />
              <i style={{ left: '18px', top: '18px', animationDelay: '-0.6s' }} />
              <i style={{ left: '26px', top: '8px', animationDelay: '-1.2s' }} />
              <i style={{ left: '14px', top: '22px', animationDelay: '-1.8s' }} />
              <i style={{ left: '33px', top: '19px', animationDelay: '-0.9s' }} />
              <i style={{ left: '7px', top: '15px', animationDelay: '-1.5s' }} />
            </>
          )}
        </span>

        {/* Day Cumulus Clouds */}
        <span className="u021-clouds" aria-hidden="true">
          <i />
          <i />
        </span>

        {/* Rolling Celestial Knob: Radiant Sun that rolls into cratered Moon */}
        <span className="u021-knob" aria-hidden="true">
          <span className="u021-moon">
            <i />
            <i />
            <i />
          </span>
        </span>
      </button>

      {showLabel && (
        <p className="u021-lab" aria-hidden="true">
          <span>
            Buổi sáng<small>Ngày nắng</small>
          </span>
          <span>
            Buổi tối<small>Đêm sao</small>
          </span>
        </p>
      )}
    </div>
  );
}
