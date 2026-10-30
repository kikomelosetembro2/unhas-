/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { LoyaltyDashboard } from './components/LoyaltyDashboard';
import { BookingModal } from './components/BookingModal';
import { AdminPanel } from './components/AdminPanel';
import { AboutSalon } from './components/AboutSalon';
import { Footer } from './components/Footer';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { NailService, Booking, SalonInfo } from './types';
import { StorageService } from './services/storage';
import { Calendar, MessageCircle, Sparkles, Smartphone, Check, Award } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [products, setProducts] = useState<NailService[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [salon, setSalon] = useState<SalonInfo>(StorageService.getSalonInfo());
  const [activeTab, setActiveTab] = useState<'catalog' | 'admin' | 'about' | 'loyalty'>('catalog');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<NailService | null>(null);
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedProducts = StorageService.getProducts();
    const loadedBookings = StorageService.getBookings();
    const loadedSalon = StorageService.getSalonInfo();
    setProducts(loadedProducts);
    setBookings(loadedBookings);
    setSalon(loadedSalon);
  }, []);

  const handleOpenBooking = (service?: NailService) => {
    if (service) {
      setSelectedService(service);
    } else if (products.length > 0 && !selectedService) {
      setSelectedService(products[0]);
    }
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    const updated = StorageService.getBookings();
    setBookings(updated);
    setToastMessage(`Agendamento #${newBooking.id} gerado com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pendente').length;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-pink-200">
      {/* Vercel Speed Insights */}
      <SpeedInsights />

      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-950 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-4 duration-300 border border-stone-800">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container / Mobile Simulation Wrapper */}
      <MobileFrameWrapper
        isMobilePreview={isMobilePreview}
        setIsMobilePreview={setIsMobilePreview}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        whatsappNumber={salon.rawWhatsappNumber}
      >
        {/* Navigation Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenBooking={() => handleOpenBooking()}
          salon={salon}
          pendingBookingsCount={pendingBookingsCount}
          isMobilePreview={isMobilePreview}
          setIsMobilePreview={setIsMobilePreview}
        />

        {/* Dynamic Views */}
        <main className="flex-1">
          {activeTab === 'catalog' && (
            <>
              <Hero
                salon={salon}
                onOpenBooking={() => handleOpenBooking()}
                onExploreCatalog={() => {
                  const el = document.getElementById('catalogo');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              <ProductCatalog
                products={products}
                onSelectService={(serv) => {
                  setSelectedService(serv);
                  setIsBookingOpen(true);
                }}
                onOpenBooking={() => handleOpenBooking()}
              />

              {/* VIP Loyalty Banner at the bottom of the catalog */}
              <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
                <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-black text-white rounded-3xl p-6 sm:p-8 border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-pink-600/20 border border-pink-500/50 flex items-center justify-center shrink-0">
                      <Award className="w-7 h-7 text-pink-400" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 block">
                        Programa de Fidelidade Exclusivo
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        Já tem agendamentos conosco? Consulte seus pontos!
                      </h3>
                      <p className="text-xs text-stone-400 mt-1 max-w-xl">
                        A cada 5 atendimentos de unhas artesanais, você ganha uma recompensa de cortesia. Digite seu WhatsApp e acompanhe seus selos acumulados.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('loyalty')}
                    className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-all shrink-0 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Acessar Meu Cartão VIP</span>
                  </button>
                </div>
              </section>
            </>
          )}

          {activeTab === 'loyalty' && (
            <LoyaltyDashboard
              salon={salon}
              onOpenBooking={() => handleOpenBooking()}
            />
          )}

          {activeTab === 'about' && (
            <AboutSalon
              salon={salon}
              onOpenBooking={() => handleOpenBooking()}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanel
              products={products}
              onUpdateProducts={setProducts}
              bookings={bookings}
              onUpdateBookings={setBookings}
              salon={salon}
              onUpdateSalon={setSalon}
              onCloseAdmin={() => setActiveTab('catalog')}
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer
          salon={salon}
          onOpenBooking={() => handleOpenBooking()}
          onOpenAdmin={() => setActiveTab('admin')}
        />
      </MobileFrameWrapper>

      {/* Booking Modal with Payment & Change options */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedService={selectedService}
        allServices={products}
        salon={salon}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Floating Action Button (FAB) for direct WhatsApp on bottom-right (Desktop & Mobile) */}
      {!isMobilePreview && (
        <aside
          aria-label="Ações rápidas de contato"
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5"
        >
          {/* Quick Preview helper */}
          <button
            type="button"
            onClick={() => setIsMobilePreview(true)}
            className="px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-950 text-white text-xs font-semibold shadow-lg backdrop-blur-xs flex items-center gap-1.5 transition-transform hover:scale-105 border border-stone-800"
            title="Simular visualização de celular"
          >
            <Smartphone className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Preview Smartphone</span>
          </button>

          {/* Direct WhatsApp button */}
          <a
            href={`https://wa.me/${salon.rawWhatsappNumber}?text=${encodeURIComponent(
              'Olá! Gostaria de informações e agendar uma pintura artesanal na B & K Nails Designer.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
            title="Abrir WhatsApp B & K Nails Designer"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>Falar no WhatsApp</span>
          </a>
        </aside>
      )}
    </div>
  );
}
