import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ShieldCheck, Smartphone, Monitor, MessageCircle, Phone, Award } from 'lucide-react';
import { SalonInfo } from '../types';

interface HeaderProps {
  activeTab: 'catalog' | 'admin' | 'about' | 'loyalty';
  setActiveTab: (tab: 'catalog' | 'admin' | 'about' | 'loyalty') => void;
  onOpenBooking: () => void;
  salon: SalonInfo;
  pendingBookingsCount: number;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  salon,
  pendingBookingsCount,
  isMobilePreview,
  setIsMobilePreview,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
      {/* Top micro-bar with contact info and preview switcher */}
      <div className="bg-stone-950 text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate text-stone-300">
            <span className="font-semibold text-pink-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-pink-400" /> Rio Branco - AC
            </span>
            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="hidden sm:inline truncate">
              WhatsApp: {salon.bookingWhatsapp} {salon.phones[1] && salon.phones[1] !== salon.bookingWhatsapp ? `· ${salon.phones[1]}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Device Preview Toggle */}
            <div className="flex items-center bg-stone-900 border border-stone-800 rounded-full p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setIsMobilePreview(false)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all ${
                  !isMobilePreview
                    ? 'bg-pink-600 text-white font-medium shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Visualização Tela Cheia (Web)"
              >
                <Monitor className="w-3 h-3" />
                <span className="hidden md:inline">Tela Cheia</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMobilePreview(true)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all ${
                  isMobilePreview
                    ? 'bg-pink-600 text-white font-medium shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Simulação Preview Celular"
              >
                <Smartphone className="w-3 h-3" />
                <span>Simulação Mobile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-left group flex items-center gap-3.5 focus:outline-hidden"
        >
          <div className="w-11 h-11 rounded-2xl bg-black text-white border-2 border-pink-500 flex items-center justify-center font-black tracking-wider shadow-sm group-hover:scale-105 group-hover:bg-pink-600 transition-all">
            BK
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-black">
                B & K <span className="text-pink-600 font-sans font-black text-xl sm:text-2xl">NAILS DESIGNER</span>
              </span>
            </div>
            <p className="text-[11px] font-bold text-stone-600 uppercase tracking-widest -mt-0.5">
              Pinturas de Unhas Artesanais
            </p>
          </div>
        </button>

        {/* Navigation links (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`relative py-1.5 transition-colors ${
              activeTab === 'catalog'
                ? 'text-pink-600 font-semibold'
                : 'text-stone-700 hover:text-pink-600'
            }`}
          >
            <span>Catálogo de Artes</span>
            {activeTab === 'catalog' && (
              <motion.div
                layoutId="header-active-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-full"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`relative py-1.5 transition-colors ${
              activeTab === 'about'
                ? 'text-pink-600 font-semibold'
                : 'text-stone-700 hover:text-pink-600'
            }`}
          >
            <span>Sobre o Ateliê</span>
            {activeTab === 'about' && (
              <motion.div
                layoutId="header-active-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-full"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`relative py-1.5 transition-colors flex items-center gap-1.5 ${
              activeTab === 'loyalty'
                ? 'text-pink-600 font-semibold'
                : 'text-stone-700 hover:text-pink-600'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-pink-500" />
            <span>Cartão Fidelidade</span>
            {activeTab === 'loyalty' && (
              <motion.div
                layoutId="header-active-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-full"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>
          <a
            href={`https://wa.me/${salon.rawWhatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de tirar dúvidas sobre as pinturas artesanais da B & K Nails.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-700 hover:text-pink-600 flex items-center gap-1 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            WhatsApp Salão
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'catalog' : 'admin')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              activeTab === 'admin'
                ? 'bg-stone-950 text-white border-stone-950 shadow-sm'
                : 'bg-white text-stone-800 border-stone-300 hover:border-pink-500 hover:text-pink-600'
            }`}
            title="Acessar Painel Administrativo de Agendamentos e Produtos"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">Painel Admin</span>
            {pendingBookingsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingBookingsCount}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Agora</span>
          </button>
        </div>
      </div>
    </header>
  );
};
