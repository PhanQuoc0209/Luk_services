/* Lucian UX/UI Prompt #321 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#321 */
'use client';

import React, { useState, useEffect, useRef } from 'react';

export function triggerCurtain(title: string, callback?: () => void) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('luk-curtain-transition', {
        detail: { title, callback },
      })
    );
  }
}

export function CurtainPageTransition() {
  const [title, setTitle] = useState('');
  const [state, setState] = useState<'idle' | 'cover' | 'lift'>('idle');
  const busyRef = useRef(false);

  useEffect(() => {
    const handleCurtain = (
      e: CustomEvent<{ title: string; callback?: () => void }>
    ) => {
      if (busyRef.current) return;
      const rm =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (rm) {
        if (e.detail.callback) e.detail.callback();
        return;
      }

      busyRef.current = true;
      setTitle(e.detail.title);
      setState('cover');

      setTimeout(() => {
        if (e.detail.callback) {
          e.detail.callback();
        }
        setState('lift');

        setTimeout(() => {
          setState('idle');
          busyRef.current = false;
        }, 550);
      }, 500);
    };

    window.addEventListener('luk-curtain-transition' as any, handleCurtain);
    return () =>
      window.removeEventListener(
        'luk-curtain-transition' as any,
        handleCurtain
      );
  }, []);

  return (
    <div
      className={`ux u321-curtain-layer ${state === 'cover' ? 'is-cover' : ''} ${state === 'lift' ? 'is-lift' : ''}`}
      aria-hidden={state === 'idle'}
    >
      <div className="u321-cu" aria-live="assertive">
        <span>{title}</span>
      </div>
    </div>
  );
}
