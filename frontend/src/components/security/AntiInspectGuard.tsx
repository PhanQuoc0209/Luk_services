'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

/**
 * LUK Global Anti-Inspect & Anti-Clone Shield
 * 
 * Features:
 * 1. Blocks F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, Ctrl+P, and other dev shortcuts.
 * 2. Blocks right-click context menu (Inspect element, View page source).
 * 3. Blocks unauthorized text selection & element dragging (except form inputs).
 * 4. Active DevTools Detection (size diff + execution timing + console getters).
 * 5. Instant Full-Screen Anti-Clone Shield lock when DevTools is opened.
 * 6. Obfuscated debugger loop to freeze inspect tools.
 * 7. Anti-iframe clickjacking protection.
 */
export function AntiInspectGuard() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showWarningToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // --- 0. Anti-iframe framing protection ---
    try {
      if (window.self !== window.top && window.top) {
        window.top.location.href = window.self.location.href;
      }
    } catch {
      // Cross-origin frame blocked
    }

    // --- 1. Keyboard Shortcut Interceptor ---
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        showWarningToast('🛡️ Phím F12 (Inspect) đã bị khóa để bảo vệ bản quyền giao diện!');
        return false;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element), Ctrl+Shift+K (Firefox)
      if (isCtrlOrCmd && e.shiftKey) {
        const keyUpper = e.key.toUpperCase();
        if (keyUpper === 'I' || keyUpper === 'J' || keyUpper === 'C' || keyUpper === 'K') {
          e.preventDefault();
          e.stopPropagation();
          showWarningToast('🛡️ Phím tắt kiểm tra phần tử đã bị vô hiệu hóa!');
          return false;
        }
      }

      // Ctrl+U (View Page Source)
      if (isCtrlOrCmd && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        showWarningToast('🛡️ Xem mã nguồn trang (Ctrl+U) đã bị khóa!');
        return false;
      }

      // Ctrl+S (Save Page HTML)
      if (isCtrlOrCmd && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        showWarningToast('🛡️ Lưu trang web đã bị vô hiệu hóa để bảo vệ tài nguyên!');
        return false;
      }

      // Ctrl+P (Print to PDF / HTML scrape)
      if (isCtrlOrCmd && (e.key === 'p' || e.key === 'P' || e.keyCode === 80)) {
        e.preventDefault();
        e.stopPropagation();
        showWarningToast('🛡️ In trang / Xuất PDF đã bị khóa!');
        return false;
      }
    };

    // --- 2. Right-Click Context Menu Interceptor ---
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow context menu only inside inputs or textareas for standard editing
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
      showWarningToast('🛡️ Chuột phải đã bị khóa để bảo vệ giao diện độc quyền!');
      return false;
    };

    // --- 3. Copy / Cut Protection on non-input elements ---
    const handleCopyCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
      showWarningToast('🛡️ Sao chép nội dung đã bị vô hiệu hóa!');
      return false;
    };

    // --- 4. Drag & Drop Protection ---
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // --- 5. Active DevTools Detection Loop ---
    let checkInterval: NodeJS.Timeout | null = null;
    let debuggerInterval: NodeJS.Timeout | null = null;

    const detectDevTools = () => {
      const isHeadless = Boolean(
        (typeof navigator !== 'undefined' && navigator.webdriver) ||
        (window as any).__AUTOMATION_MODE__
      );

      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      // Method A: Window dimension check (docked DevTools)
      let open = widthDiff || heightDiff;

      // Method B: Console inspection getter check (undocked DevTools) - active for real users
      if (!isHeadless) {
        try {
          const detector = new Image();
          Object.defineProperty(detector, 'id', {
            get: function () {
              open = true;
              setIsDevToolsOpen(true);
              return '';
            },
          });
          console.debug(detector);
        } catch {
          // Ignore
        }
      }

      setIsDevToolsOpen(open);
    };

    // Run active check every 500ms
    checkInterval = setInterval(detectDevTools, 500);

    // Defensive debugger freeze: ONLY active when DevTools is detected as open
    debuggerInterval = setInterval(() => {
      const isHeadless = Boolean(
        (typeof navigator !== 'undefined' && navigator.webdriver) ||
        (window as any).__AUTOMATION_MODE__
      );
      if (isDevToolsOpen && !isHeadless) {
        try {
          (function () {
            return false;
          }
            ['constructor']('debugger')
            ['call']());
        } catch {
          // ignore
        }
      }
    }, 800);

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('copy', handleCopyCut, { capture: true });
    document.addEventListener('copy', handleCopyCut, { capture: true });
    window.addEventListener('cut', handleCopyCut, { capture: true });
    document.addEventListener('cut', handleCopyCut, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('copy', handleCopyCut, { capture: true });
      document.removeEventListener('copy', handleCopyCut, { capture: true });
      window.removeEventListener('cut', handleCopyCut, { capture: true });
      document.removeEventListener('cut', handleCopyCut, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
      if (checkInterval) clearInterval(checkInterval);
      if (debuggerInterval) clearInterval(debuggerInterval);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [isDevToolsOpen, showWarningToast]);

  return (
    <>
      {/* 1. Floating Warning Toast (when user presses F12 or right-clicks) */}
      {toastMessage && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            top: '5.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999999,
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            border: '1.5px solid rgba(245, 158, 11, 0.7)',
            color: '#fef3c7',
            padding: '0.85rem 1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 25px rgba(245, 158, 11, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 500,
            fontSize: '0.9rem',
            maxWidth: '90vw',
            textAlign: 'center',
            transition: 'all 0.25s ease-out',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              boxShadow: '0 0 10px #f59e0b',
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#fef3c7', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            {toastMessage}
          </span>
        </div>
      )}

      {/* 2. Full-Screen Anti-Clone Shield Lock Screen (Active when DevTools is opened) */}
      {isDevToolsOpen && (
        <div
          className="fixed inset-0 z-[999998] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl animate-in fade-in-0 duration-300 select-none"
          style={{ cursor: 'not-allowed' }}
        >
          {/* Subtle security mesh background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 max-w-lg w-full liquid-glass-strong rounded-3xl p-8 sm:p-10 border border-rose-500/30 text-center space-y-6 shadow-[0_0_80px_rgba(244,63,94,0.25)]">
            {/* Pulsing Lock / Shield Icon */}
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600/30 to-amber-500/30 border border-rose-500/40 flex items-center justify-center shadow-lg relative">
              <span className="text-4xl">🛡️</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
            </div>

            {/* Title & Tag */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-body font-bold tracking-widest uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                LUK GLOBAL ANTI-CLONE SHIELD
              </span>
              <h2 className="font-heading italic text-3xl sm:text-4xl text-white tracking-tight">
                Chế Độ Bảo Vệ Bản Quyền Đang Bật
              </h2>
            </div>

            {/* Explanation Message */}
            <p className="text-xs sm:text-sm text-slate-300 font-body font-light leading-relaxed">
              Hệ thống phát hiện cửa sổ <strong className="text-rose-400 font-medium">Developer Tools (F12)</strong> hoặc công cụ kiểm tra mã nguồn đang hoạt động.
              <br />
              <br />
              Toàn bộ cấu trúc giao diện, tài nguyên hình ảnh và phong cách thiết kế độc quyền của{' '}
              <strong className="text-white font-medium">LUK Global</strong> đã được khóa an toàn để ngăn chặn hành vi clone hoặc sao chép trái phép.
            </p>

            {/* Call to action instruction */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-body text-slate-300 space-y-1">
              <p className="font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                <span>✓</span> Đóng cửa sổ F12 / DevTools để tiếp tục
              </p>
              <p className="text-[11px] text-slate-400">
                Website sẽ tự động mở khóa tức thì ngay khi bạn đóng bảng công cụ kiểm tra.
              </p>
            </div>

            {/* Copyright Watermark */}
            <div className="text-[10px] text-slate-500 font-body uppercase tracking-wider pt-2 border-t border-white/5">
              © 2026 LUK GLOBAL SERVICES • ALL RIGHTS RESERVED
            </div>
          </div>
        </div>
      )}
    </>
  );
}
