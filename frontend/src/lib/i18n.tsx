'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import en from '@/locales/en.json';
import am from '@/locales/am.json';
import om from '@/locales/om.json';
import ti from '@/locales/ti.json';

export type Locale = 'en' | 'am' | 'om' | 'ti';

const translations: Record<Locale, any> = {
  en,
  am,
  om,
  ti,
};

const localeNames: Record<Locale, { label: string }> = {
  en: { label: 'English' },
  am: { label: 'አማርኛ' },
  om: { label: 'Afaan Oromoo' },
  ti: { label: 'ትግርኛ' },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  toggleLocale: () => {},
  t: (path: string, fallback?: string) => fallback || path,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('agafari_locale') as Locale;
      if (['en', 'am', 'om', 'ti'].includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    } catch (e) {}
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('agafari_locale', newLocale);
    } catch (e) {}
  };

  const toggleLocale = () => {
    const order: Locale[] = ['en', 'am', 'om', 'ti'];
    const nextIndex = (order.indexOf(locale) + 1) % order.length;
    setLocale(order[nextIndex]);
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    
    let current: any = translations[locale];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }

    if (typeof current === 'string') {
      return current;
    }

    if (locale !== 'en') {
      let enCurrent: any = translations.en;
      for (const key of keys) {
        if (enCurrent && typeof enCurrent === 'object' && key in enCurrent) {
          enCurrent = enCurrent[key];
        } else {
          enCurrent = undefined;
          break;
        }
      }
      if (typeof enCurrent === 'string') {
        return enCurrent;
      }
    }

    return fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

// Clean Dropdown Language Switcher (No GB/ET letters, only language names)
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const active = localeNames[locale] || localeNames.en;

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left shrink-0 z-50 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3.5 rounded-full bg-black/90 backdrop-blur-md border border-gold-500/40 hover:border-gold-400 text-gold-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
      >
        <Globe className="w-3.5 h-3.5 text-gold-400 shrink-0" />
        <span>{active.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gold-400/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-black border-2 border-gold-500/50 shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95">
          {(Object.keys(localeNames) as Locale[]).map((key) => {
            const item = localeNames[key];
            const isSelected = locale === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setLocale(key);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gold-500 text-black font-extrabold shadow-md'
                    : 'text-gold-300 hover:bg-gold-500/10 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
