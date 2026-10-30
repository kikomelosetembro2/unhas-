import React from 'react';
import { Sparkles, MapPin, Phone, MessageCircle, Clock, ShieldCheck, Heart, Award } from 'lucide-react';
import { SalonInfo } from '../types';

interface AboutSalonProps {
  salon: SalonInfo;
  onOpenBooking: () => void;
}

export const AboutSalon: React.FC<AboutSalonProps> = ({ salon, onOpenBooking }) => {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
          Ateliê de Beleza Exclusivo
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 mt-2">
          Sobre o B & K NAILS DESIGNER
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
          Localizado no coração de Rio Branco - Acre, nosso espaço nasceu da paixão por transformar unhas em verdadeiras obras de arte feitas à mão. Não trabalhamos com adesivos industriais: cada traço, flor e nuance marmorizada é criada exclusivamente para você.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-950">
            Pinturas 100% Artesanais
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Pincéis de cerdas microfinas, técnicas One Stroke, efeito mármore e aplicações 3D com relevo em gel que garantem autenticidade e alta sofisticação.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-950">
            Durabilidade & Biossegurança
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Materiais hipoalergênicos importados, esterilização em autoclave e preparadores químicos que garantem até 25 a 30 dias de fixação perfeita.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-950">
            Atendimento Personalizado
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Ambiente climatizado, chá e café artesanal, com pontualidade britânica para que seu momento de autocuidado seja um refúgio relaxante.
          </p>
        </div>
      </div>

      {/* Location & Contact Details */}
      <div className="bg-stone-950 text-white rounded-3xl p-8 sm:p-12 border border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Onde nos encontrar
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Visite nosso Ateliê em Rio Branco
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Agendamentos com hora marcada para garantir que cada detalhe da sua pintura receba o tempo e a dedicação que merece.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{salon.city} - {salon.state}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{salon.openingHours}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp de Agendamentos: <b>{salon.bookingWhatsapp}</b></span>
              </div>
              {salon.phones.filter(p => p && p !== salon.bookingWhatsapp).length > 0 && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>Outros Contatos: {salon.phones.filter(p => p && p !== salon.bookingWhatsapp).join(' · ')}</span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                Agendar Agora pelo WhatsApp
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-4/3 border border-stone-800">
            <img
              src="/src/assets/images/nail_encapsulated_flowers_1793339144938.jpg"
              alt="Ateliê B & K Nails"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6">
              <span className="text-xs text-white/90 font-medium">
                Flores desidratadas e encapsulamento em gel autoral
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
