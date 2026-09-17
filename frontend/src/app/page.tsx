'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Video, 
  QrCode, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Play, 
  Phone, 
  Mail, 
  ExternalLink,
  Crown,
  Award,
  ChevronRight,
  ChevronLeft,
  Layers,
  Monitor,
  Building2,
  Lock,
  Globe,
  Instagram,
  Facebook,
  Send,
  HelpCircle,
  Shield,
  FileText,
  X,
  Radio,
  Users,
  Film
} from 'lucide-react';

import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const [activeDemoTab, setActiveDemoTab] = useState<'COMING_SOON' | 'INVITATION' | 'FEED' | 'LIVE' | 'SCANNER'>('COMING_SOON');
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Scroll spy tracking to detect which section the user is currently viewing
  useEffect(() => {
    const sections = ['hero', 'features', 'trusted', 'packages', 'demo', 'portfolio', 'about'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Platform Feature Cards
  const platformFeatures = [
    {
      id: 'f1',
      title: t('landing.featuresSection.card1Title'),
      icon: Calendar,
      badge: t('landing.featuresSection.card1Badge'),
      imageUrl: '/images/feature_countdown.png',
      description: t('landing.featuresSection.card1Desc'),
      link: '/event/sara-and-dawit-2026',
      btnText: t('landing.featuresSection.card1Btn')
    },
    {
      id: 'f2',
      title: t('landing.featuresSection.card2Title'),
      icon: QrCode,
      badge: t('landing.featuresSection.card2Badge'),
      imageUrl: '/images/feature_qr_pass.png',
      description: t('landing.featuresSection.card2Desc'),
      link: '/scanner',
      btnText: t('landing.featuresSection.card2Btn')
    },
    {
      id: 'f3',
      title: t('landing.featuresSection.card3Title'),
      icon: Video,
      badge: t('landing.featuresSection.card3Badge'),
      imageUrl: '/images/feature_feed_live.png',
      description: t('landing.featuresSection.card3Desc'),
      link: '/event/sara-and-dawit-2026/feed',
      btnText: t('landing.featuresSection.card3Btn')
    }
  ];

  // Partnered Venue Logos for Infinite Floating Marquee
  const partnerLogos = [
    { name: t('landing.partnersSection.sheraton'), type: t('landing.partnersSection.sheratonType'), icon: Building2 },
    { name: t('landing.partnersSection.haile'), type: t('landing.partnersSection.haileType'), icon: Crown },
    { name: t('landing.partnersSection.skylight'), type: t('landing.partnersSection.skylightType'), icon: Building2 },
    { name: t('landing.partnersSection.radisson'), type: t('landing.partnersSection.radissonType'), icon: Award },
    { name: t('landing.partnersSection.kuriftu'), type: t('landing.partnersSection.kuriftuType'), icon: Sparkles },
    { name: t('landing.partnersSection.yegara'), type: t('landing.partnersSection.yegaraType'), icon: Globe },
  ];

  // FAQ Items
  const faqItems = [
    {
      q: t('landing.faqModal.q1'),
      a: t('landing.faqModal.a1')
    },
    {
      q: t('landing.faqModal.q2'),
      a: t('landing.faqModal.a2')
    },
    {
      q: t('landing.faqModal.q3'),
      a: t('landing.faqModal.a3')
    },
    {
      q: t('landing.faqModal.q4'),
      a: t('landing.faqModal.a4')
    }
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex flex-col relative font-sans">
      
      {/* 0. Ambient Floating Gold Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0.2 }}
            animate={{ 
              y: [-20, -60, -20], 
              x: [0, i % 2 === 0 ? 25 : -25, 0],
              opacity: [0.2, 0.8, 0.2] 
            }}
            transition={{ 
              duration: 6 + i * 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 1.1 
            }}
            style={{ 
              top: `${8 + i * 10}%`, 
              left: `${5 + i * 10}%` 
            }}
            className="absolute text-gold-500 text-xl select-none"
          >
            {i % 2 === 0 ? '✨' : '🌸'}
          </motion.div>
        ))}
      </div>

      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 glass-panel border-b border-gold-500/30 px-4 sm:px-6 py-3.5 shadow-sm bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-xl bg-black shadow-md flex items-center justify-center">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src="/branding/artboard-13.png"
                alt="Agafari (አጋፋሪ) Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-gray-900 block leading-none">
                {t('nav.brandTitle')}
              </span>
              <span className="text-[9px] text-gold-600 tracking-widest font-semibold uppercase mt-1 block">
                by Hamelmal Creatives
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-sage-dark">
            <a href="#features" className="hover:text-metallic-dark transition-colors">{t('landing.nav.features')}</a>
            <a href="#trusted" className="hover:text-metallic-dark transition-colors">{t('landing.nav.partners')}</a>
            <a href="#packages" className="hover:text-metallic-dark transition-colors">{t('landing.nav.packages')}</a>
            <a href="#demo" className="hover:text-metallic-dark transition-colors text-metallic-dark flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-metallic animate-pulse" />
              {t('landing.nav.liveDemo')}
            </a>
            <a href="#portfolio" className="hover:text-metallic-dark transition-colors">{t('landing.nav.pastWeddings')}</a>
            <a href="#about" className="hover:text-metallic-dark transition-colors">{t('landing.nav.aboutUs')}</a>
          </nav>

          {/* High-Contrast CTA Button & Language Switcher */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />

            <Link
              href="/event/sara-and-dawit-2026"
              className="hidden sm:flex px-4 py-2 rounded-full bg-sage-dark text-neutral hover:bg-sage text-xs font-semibold shadow-sage transition-all items-center gap-1"
            >
              <span>{t('landing.nav.exploreCelebration')}</span>
            </Link>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="#packages"
              className="px-5 py-2.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all flex items-center gap-1.5"
            >
              {t('landing.nav.bookWedding')}
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="hero" className="relative px-6 pt-24 pb-32 w-full max-w-full text-center z-10 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Realistic Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_couple_bg.png"
            alt="Beautiful Ethiopian Wedding"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[100px] z-0 pointer-events-none" />
        </div>

        <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            {/* Agafari Golden Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="relative w-40 h-40 md:w-56 md:h-56 mb-4 drop-shadow-[0_15px_25px_rgba(212,175,55,0.3)]"
            >
              <img 
                src="/branding/artboard-13.png" 
                alt="Agafari Golden Logo" 
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-muted/80 backdrop-blur-sm text-sage-dark text-[11px] font-semibold uppercase tracking-wider mb-6 border border-sage/30 shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-metallic" />
              {t('landing.hero.badge')}
            </motion.div>

            {/* Headline */}
            <h1 className={`font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-sage-dark leading-tight drop-shadow-sm ${locale === 'am' ? 'font-amharic-royal' : ''}`}>
              {t('landing.hero.titlePart1')} <br />
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`font-script text-4xl sm:text-6xl md:text-7xl font-normal gold-metallic-solid mt-2 block leading-snug drop-shadow-md ${locale === 'am' ? 'font-amharic-script font-bold drop-shadow-md text-amber-600' : ''}`}
              >
                {t('landing.hero.titlePart2')}
              </motion.span>
            </h1>

            <p className={`max-w-2xl mx-auto text-sm sm:text-base text-charcoal-light mt-6 mb-8 font-light leading-relaxed drop-shadow-sm ${locale === 'am' ? 'font-amharic-body' : ''}`}>
              {t('landing.hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-sm shadow-accent transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-sage-dark" />
                {t('landing.hero.ctaDemo')}
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#packages"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-sage-dark/90 backdrop-blur-sm text-neutral font-semibold text-sm hover:bg-sage transition-all shadow-sage flex items-center justify-center gap-2 border border-sage/50"
              >
                {t('landing.hero.ctaPackages')}
              </motion.a>
            </div>
          </motion.div>

          {/* Feature Badges Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto pt-8 border-t border-metallic/30"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sage-dark drop-shadow-sm bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
              <CheckCircle2 className="w-4 h-4 text-metallic shrink-0" />
              {t('landing.hero.feature1')}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sage-dark drop-shadow-sm bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
              <CheckCircle2 className="w-4 h-4 text-metallic shrink-0" />
              {t('landing.hero.feature2')}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sage-dark drop-shadow-sm bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
              <CheckCircle2 className="w-4 h-4 text-metallic shrink-0" />
              {t('landing.hero.feature3')}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sage-dark drop-shadow-sm bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
              <CheckCircle2 className="w-4 h-4 text-metallic shrink-0" />
              {t('landing.hero.feature4')}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. PLATFORM FEATURES SECTION (100% Edge-to-Edge Full-Width Infinite Marquee) */}
      <section id="features" className="py-24 bg-white text-gray-900 w-full max-w-full px-0 mx-0 relative overflow-hidden border-t border-b border-gray-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-gold-400 text-[11px] font-bold uppercase tracking-widest mb-4 shadow-md border border-gold-500/30">
                <Crown className="w-3.5 h-3.5 text-gold-400" />
                {t('landing.featuresSection.badge')}
              </div>

              <h2 className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight ${locale === 'am' ? 'font-amharic-royal' : ''}`}>
                {t('landing.featuresSection.title')}{' '}
                <span className={`font-script text-gold-600 font-normal text-4xl sm:text-6xl lg:text-7xl px-2 inline-block drop-shadow-sm ${locale === 'am' ? 'font-amharic-script font-bold text-gold-600' : ''}`}>
                  {t('landing.featuresSection.titleScript')}
                </span>{' '}
                {t('landing.featuresSection.titleEnd')}
              </h2>

              <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto font-light mt-3 leading-relaxed">
                {t('landing.featuresSection.description')}
              </p>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gray-50 border border-gold-500/30 text-gray-800 text-[10px] font-semibold mt-4 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('landing.featuresSection.marqueeHint')}
              </div>
            </motion.div>
          </div>

          {/* 100% Full-Width Edge-to-Edge Pure CSS Infinite Marquee Slider */}
          <div className="marquee-container relative w-full max-w-full overflow-hidden py-4 px-0">
            <div className="marquee-track flex gap-6 px-0">
              {[...platformFeatures, ...platformFeatures].map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={`${feat.id}-${idx}`}
                    className="w-[310px] sm:w-[350px] rounded-3xl overflow-hidden border border-gold-500/30 hover:border-gold-500 hover:shadow-gold transition-all duration-300 group flex flex-col justify-between shrink-0 bg-white text-gray-900 shadow-md"
                  >
                    <div>
                      <div className="h-52 bg-gray-100 relative overflow-hidden">
                        <img
                          src={feat.imageUrl}
                          alt={feat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                        />
                        <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-gold-500/40 text-gold-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                          <IconComp className="w-3.5 h-3.5 text-gold-400" />
                          {feat.badge}
                        </div>
                      </div>

                      <div className="p-6 text-left bg-white">
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                          {feat.title}
                        </h3>
                        <p className="text-gray-600 text-xs leading-relaxed font-light mb-4">
                          {feat.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 bg-white">
                      <a
                        href={feat.link}
                        target="_blank"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 hover:from-amber-400 hover:to-gold-500 text-black text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-gold border border-gold-400/40"
                      >
                        {feat.btnText}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. "TRUSTED BY" CONTINUOUSLY SCROLLING & FLOATING COMPANY LOGOS */}
      <section id="trusted" className="py-16 bg-white border-b border-gray-100 w-full max-w-full px-0 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-8 px-6">
          <span className="text-[10px] text-gold-600 font-semibold uppercase tracking-widest block mb-1">
            {t('landing.partnersSection.badge')}
          </span>
          <h3 className="font-serif text-2xl font-bold text-gray-900">
            {t('landing.partnersSection.title')}
          </h3>
        </div>

        {/* Continuous 100% Edge-to-Edge Infinite Logo Marquee Track */}
        <div className="marquee-container relative w-full max-w-full overflow-hidden py-2 px-0">
          <div className="marquee-track flex gap-6 px-0">
            {[...partnerLogos, ...partnerLogos].map((partner, idx) => {
              const IconComp = partner.icon;
              return (
                <div
                  key={idx}
                  className="w-[200px] p-5 rounded-2xl border border-gold-500/20 hover:border-gold-500 hover:shadow-gold transition-all duration-300 bg-white flex flex-col items-center justify-center text-center group shrink-0 shadow-sm"
                >
                  <IconComp className="w-7 h-7 text-gold-600 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="font-serif font-bold text-gray-900 text-xs">
                    {partner.name}
                  </span>
                  <span className="text-[9px] text-gray-500 font-light mt-0.5">
                    {partner.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PACKAGES & PRICING SECTION */}
      <section id="packages" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] text-metallic-dark font-semibold uppercase tracking-widest block mb-1">
            {t('landing.packagesSection.badge')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sage-dark">
            {t('landing.packagesSection.title')}
          </h2>
          <p className="text-charcoal-light text-xs max-w-md mx-auto font-light mt-2">
            {t('landing.packagesSection.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Silver Package */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-7 rounded-3xl border border-gold-500/30 hover:border-gold-500 hover:shadow-gold transition-all duration-300 flex flex-col justify-between bg-white shadow-md"
          >
            <div>
              <div className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider mb-1">
                {t('landing.packagesSection.silverTag')}
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                {t('landing.packagesSection.silverTitle')}
              </h3>
              <p className="text-gray-600 text-xs font-light mb-5">
                {t('landing.packagesSection.silverDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.silverF1')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.silverF2')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.silverF3')}
                </li>
              </ul>
            </div>

            <a
              href="tel:+251911000000"
              className="mt-6 w-full py-3 rounded-full bg-black text-white text-center font-bold text-xs hover:bg-gray-800 transition-colors block shadow-md"
            >
              {t('landing.packagesSection.silverBtn')}
            </a>
          </motion.div>

          {/* Gold Package */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-7 rounded-3xl border-2 border-gold-500 hover:shadow-gold transition-all duration-300 relative flex flex-col justify-between bg-white shadow-lg"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gold-500 text-black text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Crown className="w-3 h-3 text-black" />
              {t('landing.packagesSection.goldBadge')}
            </div>

            <div>
              <div className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider mb-1 mt-1">
                {t('landing.packagesSection.goldTag')}
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                {t('landing.packagesSection.goldTitle')}
              </h3>
              <p className="text-gray-600 text-xs font-light mb-5">
                {t('landing.packagesSection.goldDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.goldF1')}
                </li>
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.goldF2')}
                </li>
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.goldF3')}
                </li>
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.goldF4')}
                </li>
              </ul>
            </div>

            <a
              href="tel:+251911000000"
              className="mt-6 w-full py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-black text-center font-bold text-xs shadow-gold transition-all block"
            >
              {t('landing.packagesSection.goldBtn')}
            </a>
          </motion.div>

          {/* Platinum Package */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-7 rounded-3xl border border-gold-500/30 hover:border-gold-500 hover:shadow-gold transition-all duration-300 flex flex-col justify-between bg-white shadow-md"
          >
            <div>
              <div className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider mb-1">
                {t('landing.packagesSection.platTag')}
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                {t('landing.packagesSection.platTitle')}
              </h3>
              <p className="text-gray-600 text-xs font-light mb-5">
                {t('landing.packagesSection.platDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.platF1')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.platF2')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.platF3')}
                </li>
              </ul>
            </div>

            <a
              href="tel:+251911000000"
              className="mt-6 w-full py-3 rounded-full bg-black text-white text-center font-bold text-xs hover:bg-gray-800 transition-colors block shadow-md"
            >
              {t('landing.packagesSection.platBtn')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* 6. OVERHAULED "EXPERIENCE AGAFARI LIVE" SIMULATOR SECTION */}
      <section id="demo" className="py-24 bg-gray-50/60 w-full max-w-full px-4 sm:px-6 border-t border-b border-gray-200/60 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Active Section & Live Page Indicator Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black border border-gold-500/40 shadow-md text-white text-xs backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-gold-400 font-bold uppercase text-[10px] tracking-wider">
                {locale === 'am' ? 'የቀጥታ ማሳያ ክፍል' : 'Live Interactive Hub'}
              </span>
              <span className="text-gold-500/40">•</span>
              <span className="text-[11px] text-gray-200 font-medium">
                {activeDemoTab === 'COMING_SOON' && (locale === 'am' ? '1. የቀን መቁጠሪያና ምርቃት' : '1. Countdown & Wishes')}
                {activeDemoTab === 'INVITATION' && (locale === 'am' ? '2. ዲጂታል ግብዣና QR' : '2. Digital Gate Pass')}
                {activeDemoTab === 'FEED' && (locale === 'am' ? '3. የትዝታ ቪዲዮዎች' : '3. TikTok Memory Feed')}
                {activeDemoTab === 'LIVE' && (locale === 'am' ? '4. የቀጥታ ስርጭት' : '4. Global Broadcast')}
                {activeDemoTab === 'SCANNER' && (locale === 'am' ? '5. የበር መቃኛ' : '5. Gate Scanner App')}
              </span>
            </div>
          </div>

          <div className="text-center mb-12">
            <span className="text-[10px] text-metallic-dark font-semibold uppercase tracking-widest block mb-1">
              {t('landing.demoSection.badge')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sage-dark">
              {t('landing.demoSection.title')}
            </h2>
            <p className="text-charcoal-light text-xs max-w-md mx-auto font-light mt-1">
              {t('landing.demoSection.description')}
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'COMING_SOON', label: t('landing.demoSection.tab1'), url: '/event/sara-and-dawit-2026' },
              { id: 'INVITATION', label: t('landing.demoSection.tab2'), url: '/event/sara-and-dawit-2026/invitation' },
              { id: 'FEED', label: t('landing.demoSection.tab3'), url: '/event/sara-and-dawit-2026/feed' },
              { id: 'SCANNER', label: t('landing.demoSection.tab5'), url: '/scanner' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDemoTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeDemoTab === tab.id
                    ? 'bg-sage-dark text-metallic shadow-sage scale-105'
                    : 'glass-panel text-sage-dark hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-metallic/40 shadow-glass relative bg-black min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeDemoTab === 'COMING_SOON' && (
                <motion.div
                  key="COMING_SOON"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="/images/hero_couple_bg.png"
                    alt="Coming Soon Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {t('landing.demoSection.pill1')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-metallic text-sage-dark mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title1')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc1')}
                    </p>
                    <Link
                      href="/event/sara-and-dawit-2026"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn1')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === 'INVITATION' && (
                <motion.div
                  key="INVITATION"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="/images/feature_qr_pass.png"
                    alt="Digital Invitation Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    {t('landing.demoSection.pill2')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-metallic text-sage-dark mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title2')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc2')}
                    </p>
                    <Link
                      href="/event/sara-and-dawit-2026?code=INV-SD2026-001"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn2')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === 'FEED' && (
                <motion.div
                  key="FEED"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="/images/feature_feed_live.png"
                    alt="TikTok Feed Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
                    {t('landing.demoSection.pill3')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-metallic text-sage-dark mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <Film className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title3')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc3')}
                    </p>
                    <Link
                      href="/event/sara-and-dawit-2026/feed"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn3')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === 'LIVE' && (
                <motion.div
                  key="LIVE"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
                    alt="Ontime Live Streaming Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-500/50 text-rose-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    {t('landing.demoSection.pill4')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-rose-600 text-white mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <Video className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title4')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc4')}
                    </p>
                    <Link
                      href="/event/sara-and-dawit-2026"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn4')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === 'SCANNER' && (
                <motion.div
                  key="SCANNER"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop"
                    alt="Scanner Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {t('landing.demoSection.pill5')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-metallic text-sage-dark mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title5')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc5')}
                    </p>
                    <Link
                      href="/scanner"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn5')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 7. REAL WEDDINGS SHOWCASE SECTION */}
      <section id="portfolio" className="pt-28 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] text-metallic-dark font-semibold uppercase tracking-widest block mb-1">
            {t('landing.portfolioSection.badge')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark">
            {t('landing.portfolioSection.title')}
          </h2>
          <p className="text-charcoal-light text-xs sm:text-sm max-w-xl mx-auto font-light mt-2">
            {t('landing.portfolioSection.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Showcase Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-3xl overflow-hidden border-2 border-metallic/30 hover:border-metallic transition-all shadow-sage hover:shadow-accent bg-white flex flex-col justify-between group"
          >
            <div>
              <div className="h-60 bg-zinc-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
                  alt="Sara & Dawit Wedding"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold shadow-sm">
                  Sheraton Addis
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-metallic text-sage-dark font-serif font-bold text-xs flex items-center justify-center shadow-md">
                    S&D
                  </div>
                  <span className="text-white text-xs font-semibold drop-shadow-md">
                    {t('landing.portfolioSection.card1Type')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-sage-dark mb-1">
                  {t('landing.portfolioSection.card1Couple')}
                </h3>
                <p className="text-xs text-metallic-dark font-semibold mb-4">
                  {t('landing.portfolioSection.card1Venue')}
                </p>
                <p className="text-charcoal-light text-xs italic font-serif leading-relaxed mb-4">
                  {t('landing.portfolioSection.card1Quote')}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 border-t border-sage/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-metallic">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-metallic" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage-dark">
                {t('landing.portfolioSection.verified')}
              </span>
            </div>
          </motion.div>

          {/* Showcase Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-3xl overflow-hidden border-2 border-metallic/30 hover:border-metallic transition-all shadow-sage hover:shadow-accent bg-white flex flex-col justify-between group"
          >
            <div>
              <div className="h-60 bg-zinc-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
                  alt="Marta & Abel Wedding"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold shadow-sm">
                  Haile Grand Addis
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-metallic text-sage-dark font-serif font-bold text-xs flex items-center justify-center shadow-md">
                    M&A
                  </div>
                  <span className="text-white text-xs font-semibold drop-shadow-md">
                    {t('landing.portfolioSection.card2Type')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-sage-dark mb-1">
                  {t('landing.portfolioSection.card2Couple')}
                </h3>
                <p className="text-xs text-metallic-dark font-semibold mb-4">
                  {t('landing.portfolioSection.card2Venue')}
                </p>
                <p className="text-charcoal-light text-xs italic font-serif leading-relaxed mb-4">
                  {t('landing.portfolioSection.card2Quote')}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 border-t border-sage/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-metallic">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-metallic" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage-dark">
                {t('landing.portfolioSection.verified')}
              </span>
            </div>
          </motion.div>

          {/* Showcase Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-3xl overflow-hidden border-2 border-metallic/30 hover:border-metallic transition-all shadow-sage hover:shadow-accent bg-white flex flex-col justify-between group"
          >
            <div>
              <div className="h-60 bg-zinc-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop"
                  alt="Tigist & Henok Wedding"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold shadow-sm">
                  Skylight Hotel
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-metallic text-sage-dark font-serif font-bold text-xs flex items-center justify-center shadow-md">
                    T&H
                  </div>
                  <span className="text-white text-xs font-semibold drop-shadow-md">
                    {t('landing.portfolioSection.card3Type')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-sage-dark mb-1">
                  {t('landing.portfolioSection.card3Couple')}
                </h3>
                <p className="text-xs text-metallic-dark font-semibold mb-4">
                  {t('landing.portfolioSection.card3Venue')}
                </p>
                <p className="text-charcoal-light text-xs italic font-serif leading-relaxed mb-4">
                  {t('landing.portfolioSection.card3Quote')}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 border-t border-sage/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-metallic">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-metallic" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage-dark">
                {t('landing.portfolioSection.verified')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. HAMELMAL CREATIVES PROMOTION SECTION WITH BALANCED COLOR PALETTE */}
      <section id="about" className="py-24 bg-gradient-to-b from-neutral via-sage-muted/40 to-neutral text-charcoal px-6 relative overflow-hidden border-t border-b border-sage/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="w-14 h-14 rounded-2xl bg-sage-dark text-metallic font-serif font-bold text-3xl flex items-center justify-center mx-auto mb-3 shadow-sage border border-metallic/30">
              H
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-dark text-metallic text-[10px] font-bold uppercase tracking-widest mb-3 shadow-md border border-metallic/30">
              <Sparkles className="w-3.5 h-3.5 text-metallic" />
              {t('landing.aboutSection.badge')}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark">
              {t('landing.aboutSection.title')}
            </h2>
            <p className="text-charcoal-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-light mt-2">
              {t('landing.aboutSection.description')}
            </p>

            {/* Official Website Button */}
            <div className="mt-6 flex items-center justify-center">
              <motion.a
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="https://hamelmal.com"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-metallic via-amber-400 to-metallic-dark hover:from-amber-300 hover:to-metallic text-sage-dark font-extrabold text-xs shadow-accent transition-all flex items-center gap-2 border border-amber-300/40"
              >
                <Sparkles className="w-4 h-4 text-sage-dark" />
                {t('landing.aboutSection.visitBtn')}
                <ExternalLink className="w-4 h-4 ml-1" />
              </motion.a>
            </div>
          </motion.div>

          {/* Side-by-Side Promotion Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border-[1.5px] border-sage hover:border-metallic hover:shadow-[0_14px_40px_rgba(212,175,55,0.45)] transition-all duration-300 text-left bg-white text-charcoal shadow-sm flex flex-col justify-between"
            >
              <div>
                <Award className="w-8 h-8 text-metallic-dark mb-4" />
                <h3 className="font-serif text-2xl font-bold text-sage-dark mb-2">
                  {t('landing.aboutSection.card1Title')}
                </h3>
                <p className="text-charcoal-light text-xs leading-relaxed font-light mb-6">
                  {t('landing.aboutSection.card1Desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sage/10">
                <div>
                  <div className="font-serif font-bold text-sage-dark text-2xl">
                    {t('landing.aboutSection.card1Stat1')}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium uppercase tracking-wider">
                    {t('landing.aboutSection.card1Label1')}
                  </div>
                </div>
                <div>
                  <div className="font-serif font-bold text-sage-dark text-2xl">
                    {t('landing.aboutSection.card1Stat2')}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium uppercase tracking-wider">
                    {t('landing.aboutSection.card1Label2')}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border-[1.5px] border-sage hover:border-metallic hover:shadow-[0_14px_40px_rgba(212,175,55,0.45)] transition-all duration-300 text-left bg-white text-charcoal shadow-sm flex flex-col justify-between"
            >
              <div>
                <ShieldCheck className="w-8 h-8 text-metallic-dark mb-4" />
                <h3 className="font-serif text-2xl font-bold text-sage-dark mb-2">
                  {t('landing.aboutSection.card2Title')}
                </h3>
                <p className="text-charcoal-light text-xs leading-relaxed font-light mb-6">
                  {t('landing.aboutSection.card2Desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sage/10">
                <div>
                  <div className="font-serif font-bold text-sage-dark text-2xl">
                    {t('landing.aboutSection.card2Stat1')}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium uppercase tracking-wider">
                    {t('landing.aboutSection.card2Label1')}
                  </div>
                </div>
                <div>
                  <div className="font-serif font-bold text-sage-dark text-2xl">
                    {t('landing.aboutSection.card2Stat2')}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium uppercase tracking-wider">
                    {t('landing.aboutSection.card2Label2')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. PROFESSIONAL WEDDING PLATFORM FOOTER */}
      <footer className="bg-charcoal text-neutral/80 pt-16 pb-28 sm:pb-16 px-6 border-t border-metallic/20 text-xs relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral/10">
          
          {/* Brand Info Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-metallic text-sage-dark font-serif font-bold text-lg flex items-center justify-center shadow-accent">
                H
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-neutral block leading-none">
                  {t('nav.brandTitle')}
                </span>
                <span className="text-[9px] text-metallic uppercase tracking-widest mt-0.5 block">
                  by Hamelmal Creatives
                </span>
              </div>
            </div>
            <p className="text-[11px] text-neutral/60 font-light leading-relaxed">
              {t('landing.footer.brandDesc')}
            </p>

            <motion.a 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://hamelmal.com" 
              target="_blank" 
              rel="noreferrer" 
              className="mt-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-metallic via-amber-400 to-metallic-dark hover:from-amber-300 hover:to-metallic text-sage-dark font-extrabold text-xs shadow-accent transition-all inline-flex items-center gap-2 border border-amber-300/40 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-sage-dark group-hover:rotate-12 transition-transform" />
              <span>{t('landing.footer.visitParent')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-sage-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>
          </div>

          {/* Platform Features Links */}
          <div>
            <h4 className="font-serif font-bold text-neutral text-sm mb-4">
              {t('landing.footer.colFeatures')}
            </h4>
            <ul className="space-y-2.5 text-[11px] text-neutral/60">
              <li><a href="#features" className="hover:text-metallic transition-colors">{t('landing.footer.f1')}</a></li>
              <li><a href="#features" className="hover:text-metallic transition-colors">{t('landing.footer.f2')}</a></li>
              <li><a href="#features" className="hover:text-metallic transition-colors">{t('landing.footer.f3')}</a></li>
              <li><a href="#features" className="hover:text-metallic transition-colors">{t('landing.footer.f4')}</a></li>
            </ul>
          </div>

          {/* Resources & Support Links */}
          <div>
            <h4 className="font-serif font-bold text-neutral text-sm mb-4">
              {t('landing.footer.colResources')}
            </h4>
            <ul className="space-y-2.5 text-[11px] text-neutral/60">
              <li>
                <button onClick={() => setFaqModalOpen(true)} className="hover:text-metallic transition-colors flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-metallic" /> {t('landing.footer.faq')}
                </button>
              </li>
              <li>
                <button onClick={() => setPrivacyModalOpen(true)} className="hover:text-metallic transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-metallic" /> {t('landing.footer.privacy')}
                </button>
              </li>
              <li><a href="#packages" className="hover:text-metallic transition-colors">{t('landing.footer.packages')}</a></li>
              <li><a href="#trusted" className="hover:text-metallic transition-colors">{t('landing.footer.partners')}</a></li>
              <li><a href="#demo" className="hover:text-metallic transition-colors">{t('landing.footer.demo')}</a></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-neutral text-sm mb-4">
              {t('landing.footer.colContact')}
            </h4>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-metallic shrink-0" />
              <span>+251 911 000 000 / +251 922 000 000</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-metallic shrink-0" />
              <span>info@hamelmal.com</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Building2 className="w-3.5 h-3.5 text-metallic shrink-0" />
              <span>{t('landing.footer.address')}</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a href="#" className="p-2 rounded-full bg-white/5 border border-metallic/20 text-metallic hover:bg-metallic hover:text-sage-dark transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 border border-metallic/20 text-metallic hover:bg-metallic hover:text-sage-dark transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 border border-metallic/20 text-metallic hover:bg-metallic hover:text-sage-dark transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Disclaimer */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-neutral/50 gap-3">
          <div>
            {t('landing.footer.copyright')}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Lock className="w-3 h-3 text-emerald-400" /> {t('landing.footer.ssl')}
            </span>
            <button onClick={() => setPrivacyModalOpen(true)} className="hover:text-neutral">{t('landing.footer.privacy')}</button>
            <button onClick={() => setFaqModalOpen(true)} className="hover:text-neutral">{t('landing.footer.faq')}</button>
          </div>
        </div>
      </footer>

      {/* 10. LUXURY MOBILE FLOATING BOTTOM BAR NAVIGATION WITH ACTIVE SCROLL SPY & LIVE INDICATOR */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 glass-panel-sage p-1.5 rounded-2xl border-2 border-metallic/40 shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex items-center justify-between text-[10px] font-bold text-neutral bg-sage-dark/95 backdrop-blur-xl">
        
        {/* 1) Features Tab */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#features" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'features'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeSection === 'features' ? 'text-sage-dark' : 'text-metallic'}`} />
          <span>{t('landing.mobileNav.features')}</span>
          {activeSection === 'features' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>

        {/* 2) Packages Tab */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#packages" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'packages'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <Award className={`w-4 h-4 ${activeSection === 'packages' ? 'text-sage-dark' : 'text-metallic'}`} />
          <span>{t('landing.mobileNav.packages')}</span>
          {activeSection === 'packages' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>

        {/* 3) Live Demo Tab (Authentic Live Broadcast Feature Design with true active-only highlight) */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#demo" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'demo'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <div className="relative">
            <Video className={`w-4 h-4 ${activeSection === 'demo' ? 'text-sage-dark' : 'text-rose-400'}`} />
            <span className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full ${activeSection === 'demo' ? 'bg-rose-600' : 'bg-rose-500 animate-pulse'}`} />
          </div>
          <span className="flex items-center gap-1">
            {t('landing.mobileNav.demo')}
          </span>
          {activeSection === 'demo' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>

        {/* 4) Weddings Portfolio Tab */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#portfolio" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'portfolio'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <Star className={`w-4 h-4 ${activeSection === 'portfolio' ? 'text-sage-dark' : 'text-metallic'}`} />
          <span>{t('landing.mobileNav.weddings')}</span>
          {activeSection === 'portfolio' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>

        {/* 5) About Us Tab */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#about" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'about'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeSection === 'about' ? 'text-sage-dark' : 'text-metallic'}`} />
          <span>{t('landing.mobileNav.about')}</span>
          {activeSection === 'about' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>
      </div>

      {/* 11. FAQ MODAL */}
      <AnimatePresence>
        {faqModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel-sage p-8 rounded-3xl border border-metallic/40 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setFaqModalOpen(false)}
                className="absolute top-5 right-5 text-neutral/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-metallic" />
                <h3 className="font-serif text-xl font-bold text-neutral">
                  {t('landing.faqModal.title')}
                </h3>
              </div>
              <p className="text-xs text-neutral/70 font-light mb-6">
                {t('landing.faqModal.subtitle')}
              </p>

              <div className="space-y-4 text-xs text-left">
                {faqItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-metallic/20">
                    <div className="font-bold text-metallic mb-1.5">{item.q}</div>
                    <p className="text-neutral/80 leading-relaxed font-light">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 12. PRIVACY POLICY MODAL */}
      <AnimatePresence>
        {privacyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel-sage p-8 rounded-3xl border border-metallic/40 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="absolute top-5 right-5 text-neutral/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-metallic" />
                <h3 className="font-serif text-xl font-bold text-neutral">
                  {t('landing.privacyModal.title')}
                </h3>
              </div>
              <p className="text-xs text-neutral/70 font-light mb-6">
                {t('landing.privacyModal.subtitle')}
              </p>

              <div className="space-y-3.5 text-xs text-neutral/80 text-left font-light leading-relaxed">
                <p>
                  <strong className="text-metallic font-semibold">{t('landing.privacyModal.p1Title')}</strong> {t('landing.privacyModal.p1Text')}
                </p>
                <p>
                  <strong className="text-metallic font-semibold">{t('landing.privacyModal.p2Title')}</strong> {t('landing.privacyModal.p2Text')}
                </p>
                <p>
                  <strong className="text-metallic font-semibold">{t('landing.privacyModal.p3Title')}</strong> {t('landing.privacyModal.p3Text')}
                </p>
                <p>
                  <strong className="text-metallic font-semibold">{t('landing.privacyModal.p4Title')}</strong> {t('landing.privacyModal.p4Text')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
