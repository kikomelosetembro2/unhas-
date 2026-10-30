import React from 'react';
import { Sparkles, MapPin, Phone, MessageCircle, Heart } from 'lucide-react';
import { SalonInfo } from '../types';

interface FooterProps {
  salon: SalonInfo;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ salon, onOpenBooking, onOpenAdmin }) => {
  return (
    <footer className="bg-stone-950 text-white pt-12 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white text-xs">
                BK
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                B & K <span className="text-pink-500 font-sans font-extrabold text-base">NAILS DESIGNER</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Ateliê especializado exclusivamente em pinturas de unhas artesanais. Técnicas autorais feitas à mão livre, encapsuladas com flores secas, pedrarias 3D e efeitos personalizados.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-pink-400 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{salon.city} - {salon.state}</span>
            </div>
          </div>

          {/* Contacts & WhatsApp */}
          <div className="md:col-span-4 space-y-2.5 text-xs">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-pink-400">
              Canais de Atendimento
            </h4>
            <div className="space-y-2 text-stone-300">
              <a
                href={`https://wa.me/${salon.rawWhatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>WhatsApp Agendamentos: <b>{salon.bookingWhatsapp}</b></span>
              </a>
              <div className="flex items-center gap-2 text-stone-400">
                <Phone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>{salon.phones[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <Phone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>{salon.phones[1]}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Hours */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-pink-400">
              Horário & Gestão
            </h4>
            <p className="text-stone-400 leading-relaxed">
              {salon.openingHours}
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs transition-colors text-center"
              >
                Agendar Horário
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-stone-400 hover:text-stone-200 text-[11px] underline underline-offset-2 text-left"
              >
                Acesso Restrito: Área da Designer (Admin)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>
            © {new Date().getFullYear()} B & K NAILS DESIGNER · Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            Desenvolvido com <Heart className="w-3 h-3 text-pink-600 fill-pink-600" /> para Nail Artists do Acre.
          </p>
        </div>
      </div>
    </footer>
  );
};
