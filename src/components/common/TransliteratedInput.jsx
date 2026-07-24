import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export const TransliteratedInput = forwardRef(({
  value = '',
  onChange,
  onKeyDown,
  placeholder = '',
  className = '',
  id = '',
  required = false
}, ref) => {
  const [isTamilMode, setIsTamilMode] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeWordInfo, setActiveWordInfo] = useState({ word: '', start: 0, end: 0 });

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  // Expose the input element ref to parent
  useImperativeHandle(ref, () => inputRef.current);

  // Fetch suggestions from Google Input Tools
  const fetchSuggestions = async (word) => {
    if (!word || !isTamilMode) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Only transliterate if it contains English characters
    if (!/[a-zA-Z]/.test(word)) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=ta-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
        const rawSuggestions = data[1][0][1];
        // Add original word as the last option
        const allSuggestions = [...rawSuggestions, word];
        setSuggestions(allSuggestions);
        setSelectedIndex(0);
        setShowSuggestions(allSuggestions.length > 0);
      }
    } catch (error) {
      console.error('Transliteration fetch error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    const selectionStart = e.target.selectionStart;

    if (onChange) {
      onChange(e);
    }

    if (!isTamilMode) return;

    // Get current word info
    const info = getActiveWordInfo(val, selectionStart);
    setActiveWordInfo(info);

    // Debounce the fetch request
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (info.word.trim()) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(info.word);
      }, 150);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const getActiveWordInfo = (text, selectionStart) => {
    if (!text) return { word: '', start: 0, end: 0 };
    
    let start = selectionStart;
    while (start > 0 && text[start - 1] !== ' ' && text[start - 1] !== '\n') {
      start--;
    }
    
    let end = selectionStart;
    while (end < text.length && text[end] !== ' ' && text[end] !== '\n') {
      end++;
    }
    
    const word = text.substring(start, end);
    return { word, start, end };
  };

  const selectSuggestion = (index) => {
    if (index < 0 || index >= suggestions.length) return;
    const selected = suggestions[index];
    const text = value;
    const { start, end } = activeWordInfo;

    const newText = text.substring(0, start) + selected + text.substring(end);
    
    // Create a synthetic event
    const event = {
      target: {
        value: newText
      }
    };
    
    if (onChange) {
      onChange(event);
    }

    setSuggestions([]);
    setShowSuggestions(false);

    // Focus input and set caret position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = start + selected.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Support Ctrl+G toggle
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsTamilMode((prev) => !prev);
        setShowSuggestions(false);
        if (inputRef.current) inputRef.current.focus();
      }
    };
    
    const inputEl = inputRef.current;
    if (inputEl) {
      inputEl.addEventListener('keydown', handleGlobalKeyDown);
    }
    return () => {
      if (inputEl) {
        inputEl.removeEventListener('keydown', handleGlobalKeyDown);
      }
    };
  }, []);

  const handleKeyDownInternal = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectSuggestion(selectedIndex);
      } else if (e.key === ' ') {
        // Space selects the first (or current selected) suggestion and adds a space
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        const text = value;
        const { start, end } = activeWordInfo;
        const newText = text.substring(0, start) + selected + ' ' + text.substring(end);
        
        const event = { target: { value: newText } };
        if (onChange) onChange(event);

        setSuggestions([]);
        setShowSuggestions(false);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            const newCursorPos = start + selected.length + 1;
            inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 10);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
      } else if (e.key >= '1' && e.key <= String(suggestions.length)) {
        // Number keys 1-6 select suggestion
        e.preventDefault();
        selectSuggestion(Number(e.key) - 1);
      }
    } else {
      // Pass event to parent handler if it exists
      if (onKeyDown) {
        onKeyDown(e);
      }
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        id={id}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDownInternal}
        className={className}
      />
      
      {/* Tamil Mode Toggle Button inside the input field */}
      <button
        type="button"
        onClick={() => {
          setIsTamilMode((prev) => !prev);
          setShowSuggestions(false);
          if (inputRef.current) inputRef.current.focus();
        }}
        title={isTamilMode ? "Switch to English Typing (Ctrl+G)" : "Switch to Tamil Typing (Ctrl+G)"}
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-xs font-black transition-all border cursor-pointer select-none ${
          isTamilMode 
            ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-[#7A001E]' 
            : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-500'
        }`}
      >
        {isTamilMode ? 'அ' : 'A'}
      </button>

      {/* Suggestion Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 z-50 mt-1.5 w-60 rounded-md border border-gray-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800 animate-in fade-in duration-100"
        >
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-2 py-0.5 border-b border-gray-100 dark:border-slate-700 mb-1 flex items-center justify-between">
            <span>Tamil Suggestions</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">Space/Enter to Select</span>
          </div>
          <ul className="space-y-0.5">
            {suggestions.map((sug, index) => {
              const isSelected = index === selectedIndex;
              const isOriginal = index === suggestions.length - 1;
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => selectSuggestion(index)}
                    className={`w-full text-left px-2 py-1.5 text-xs font-bold rounded flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#7A001E] text-white'
                        : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span>{sug}</span>
                    </span>
                    {isOriginal && (
                      <span className={`text-[9px] px-1 rounded font-normal uppercase ${
                        isSelected ? 'bg-white/30 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'
                      }`}>
                        English
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
});
TransliteratedInput.displayName = 'TransliteratedInput';
