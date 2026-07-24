import { useEffect } from 'react';

/**
 * Register desktop keyboard shortcuts
 * @param {Object} handlers - key combination map of callback functions
 */
export const useKeyboardShortcuts = (handlers = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent shortcut interference if user is typing inside text inputs for some normal keys
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      // F1: Help modal
      if (event.key === 'F1') {
        event.preventDefault();
        if (handlers.onF1) handlers.onF1();
      }

      // F2: Quick edit
      if (event.key === 'F2') {
        event.preventDefault();
        if (handlers.onF2) handlers.onF2();
      }

      // F5: Refresh/Reset
      if (event.key === 'F5') {
        event.preventDefault();
        if (handlers.onF5) handlers.onF5();
      }

      // Ctrl + N: New Entry focus
      if ((event.ctrlKey || event.metaKey) && (event.key === 'n' || event.key === 'N')) {
        event.preventDefault();
        if (handlers.onCtrlN) handlers.onCtrlN();
      }

      // Ctrl + F: Search focus
      if ((event.ctrlKey || event.metaKey) && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        if (handlers.onCtrlF) handlers.onCtrlF();
      }

      // Ctrl + P: Print
      if ((event.ctrlKey || event.metaKey) && (event.key === 'p' || event.key === 'P')) {
        event.preventDefault();
        if (handlers.onCtrlP) handlers.onCtrlP();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
