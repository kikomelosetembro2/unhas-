import React from 'react';
import { Calendar, Sparkles, MapPin, CheckCircle2, Shield, Heart, ArrowDown } from 'lucide-react';
import { SalonInfo } from '../types';

interface HeroProps {
  salon: SalonInfo;
  onOpenBooking: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ salon, onOpenBooking, onExploreCatalog }) => {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* CENTERED COMPANY NAME IN PROMINENT DISPLAY */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          {/* Subtle Location & Niche Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-semibold text-stone-900 mb-5 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-pink-600" />
            <span>{salon.city} - {salon.state}</span>
            <span className="text-pink-300">•</span>
            <span className="text-pink-600 font-bold">Ateliê Autoral de Beleza</span>
          </div>

          {/* Monumental Centered Company Name in Deep Black and Pink */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-black uppercase leading-none drop-shadow-2xs">
              B & K <span className="text-pink-600 font-sans tracking-tight font-extrabold">NAILS DESIGNER</span>
            </h1>

            {/* Centered Slogan with Delicate Hairline Dividers */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 pt-1">
              <div className="h-px w-10 sm:w-24 bg-pink-400" />
              <p className="text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-black uppercase">
                Exclusivamente Pinturas de Unhas Artesanais
              </p>
              <div className="h-px w-10 sm:w-24 bg-pink-400" />
            </div>
          </div>

          {/* Explanatory Lead Text */}
          <p className="text-sm sm:text-base md:text-lg text-stone-800 max-w-2xl mt-5 leading-relaxed font-normal">
            Cada unha é uma verdadeira tela de arte feita à mão livre. Técnicas avançadas de encapsulamento com flores secas, efeitos mármore realista, francesinhas reversas e relevos 3D de alta sofisticação.
          </p>

          {/* Centered CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 w-full max-w-md">
            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Agendar pelo WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onExploreCatalog}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-black font-bold text-sm border-2 border-black hover:border-pink-600 hover:text-pink-600 flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <span>Ver Modelos & Preços</span>
              <ArrowDown className="w-4 h-4 text-pink-600" />
            </button>
          </div>

          {/* 3 Pillars / Trust Highlights in Pure White and Black text */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-10 w-full max-w-3xl text-left">
            <div className="bg-white p-4 rounded-2xl border border-pink-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                  100% Manual
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Pinturas e traços feitos à mão livre
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-pink-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                  Alta Durabilidade
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Materiais premium e hipoalergênicos
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-pink-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                  Hora Marcada
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Atendimento exclusivo em Rio Branco
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Showcase Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-pink-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            <div className="md:col-span-8 relative min-h-[300px] sm:min-h-[380px]">
              <img
                src="/src/assets/images/hero_bk_nails_1793339141928.jpg"
                alt="B & K Nails Designer - Unhas Artesanais"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-end md:justify-center p-6 sm:p-10 text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                  Portfólio Oficial
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold mt-1 text-white">
                  Design & Arte em Unhas
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-md leading-relaxed">
                  Agendamento rápido para o WhatsApp <b>{salon.bookingWhatsapp}</b> com confirmação automática e cálculo de troco para dinheiro.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-stone-950 text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[11px] font-bold text-pink-400 uppercase tracking-widest block mb-1">
                  Atendimento Rio Branco
                </span>
                <h4 className="font-serif text-xl font-bold text-white">
                  Escolha seu Modelo
                </h4>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Confira as 10 opções de pinturas artesanais clássicas e contemporâneas disponíveis no catálogo abaixo.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-stone-800 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>Horários:</span>
                  <span className="font-semibold text-white">08h00 às 18h30</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Formas de Pagamento:</span>
                  <span className="font-semibold text-pink-400">Pix, Dinheiro & Cartões</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Opção de Troco:</span>
                  <span className="font-semibold text-emerald-400">Sim, troco calculado</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Solicitar Agendamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
