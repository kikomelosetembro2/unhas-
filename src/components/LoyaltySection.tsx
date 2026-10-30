import React, { useState } from 'react';
import { Award, Sparkles, Gift, Check, Search, Calendar, Phone, Heart, Clock } from 'lucide-react';
import { LoyaltyClient, SalonInfo } from '../types';
import { StorageService } from '../services/storage';

interface LoyaltySectionProps {
  salon: SalonInfo;
  onOpenBooking: () => void;
}

export const LoyaltySection: React.FC<LoyaltySectionProps> = ({ salon, onOpenBooking }) => {
  const [searchPhone, setSearchPhone] = useState<string>('(68) 99245-8811');
  const [foundClient, setFoundClient] = useState<LoyaltyClient | null>(() => {
    return StorageService.getLoyaltyByPhone('68992458811');
  });
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchPhone.replace(/\D/g, '');
    const client = StorageService.getLoyaltyByPhone(clean);
    setFoundClient(client);
    setHasSearched(true);
  };

  const handlePhoneInputChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      setSearchPhone(digits ? `(${digits}` : '');
    } else if (digits.length <= 7) {
      setSearchPhone(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
    } else {
      setSearchPhone(`(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`);
    }
  };

  const clientPoints = foundClient ? foundClient.points : 0;
  const isRewardReady = clientPoints >= 5;

  return (
    <section id="fidelidade" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-3">
          <Award className="w-4 h-4 text-pink-600" />
          <span>Programa Fidelidade B & K Nails</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
          Suas unhas lindas rendem presentes para você
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
          A cada agendamento e atendimento realizado, você acumula <b>1 ponto</b>. Ao completar <b>5 pontos</b> no seu cartão, você ganha uma <b>Pintura Artesanal no Par de Unhas de Cortesia</b> ou desconto especial no seu próximo design!
        </p>
      </div>

      {/* Main Loyalty Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Digital Loyalty Card */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-pink-200 bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 text-white p-6 sm:p-8">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-pink-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  BK
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Cartão Fidelidade VIP
                  </h3>
                  <span className="text-[11px] text-pink-300 font-sans tracking-widest uppercase font-medium">
                    5 Atendimentos = 1 Recompensa
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 block uppercase">Saldo Atual</span>
                <span className="font-serif text-2xl font-bold text-pink-400 tabular-nums">
                  {clientPoints} <span className="text-stone-300 text-sm font-sans font-normal">/ 5 pts</span>
                </span>
              </div>
            </div>

            {/* Client Identity on the card */}
            <div className="py-4 flex items-center justify-between text-xs text-stone-300">
              <div>
                <span className="text-[10px] text-stone-400 uppercase block">Titular:</span>
                <span className="font-semibold text-white text-sm">
                  {foundClient ? foundClient.name : 'Cliente Visitante'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase block">WhatsApp:</span>
                <span className="font-mono text-white text-xs">
                  {foundClient ? foundClient.formattedPhone : searchPhone || '(68) 9XXXX-XXXX'}
                </span>
              </div>
            </div>

            {/* The 5 Stamps / Nail Slots */}
            <div className="py-6">
              <div className="grid grid-cols-5 gap-2.5 sm:gap-4">
                {[1, 2, 3, 4, 5].map((slotNumber) => {
                  const isChecked = slotNumber <= clientPoints;
                  const isFifthSlot = slotNumber === 5;

                  return (
                    <div
                      key={slotNumber}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${
                        isChecked
                          ? 'bg-gradient-to-b from-pink-600 to-pink-700 border-pink-400 shadow-lg shadow-pink-600/30 scale-102'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {isChecked ? (
                        <>
                          {isFifthSlot ? (
                            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce" />
                          ) : (
                            <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                          )}
                          <span className="text-[10px] sm:text-xs font-bold text-white mt-1">
                            {isFifthSlot ? 'PRÊMIO' : `${slotNumber}º`}
                          </span>
                        </>
                      ) : (
                        <>
                          {isFifthSlot ? (
                            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-stone-500" />
                          ) : (
                            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-stone-600 flex items-center justify-center text-[10px] text-stone-400 font-bold">
                              {slotNumber}
                            </span>
                          )}
                          <span className="text-[9px] sm:text-[10px] text-stone-500 font-medium mt-1">
                            {isFifthSlot ? 'Recompensa' : 'Ponto'}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward Notification Banner */}
            {isRewardReady ? (
              <div className="mt-2 p-4 rounded-2xl bg-gradient-to-r from-pink-600/90 to-rose-700 border border-pink-400 text-white flex items-center gap-3 animate-pulse">
                <Gift className="w-8 h-8 text-white shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">PARABÉNS! 5 PONTOS COMPLETOS! 🎉</h4>
                  <p className="text-xs text-pink-100 mt-0.5">
                    Você desbloqueou sua recompensa especial no B & K Nails Designer. Ao fazer seu agendamento, mencione seu prêmio!
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-stone-300 flex items-center justify-between">
                <span>
                  Faltam apenas <b>{5 - clientPoints} atendimento(s)</b> para você ganhar o prêmio de fidelidade!
                </span>
                <span className="text-pink-400 font-bold">{Math.round((clientPoints / 5) * 100)}%</span>
              </div>
            )}

            {/* Quick Action */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-stone-400">
                Válido exclusivamente para agendamentos em Rio Branco - AC.
              </span>
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar e Ganhar Ponto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Phone Search & Loyalty Rules */}
        <div className="lg:col-span-5 space-y-6">
          {/* Search Box to check card */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              Consultar Meus Pontos
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Digite seu número de WhatsApp para ver o saldo do seu Cartão Fidelidade B & K Nails.
            </p>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="(68) 9XXXX-XXXX"
                  value={searchPhone}
                  onChange={(e) => handlePhoneInputChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-pink-400" />
                  <span>Consultar Saldo</span>
                </button>
              </div>
            </form>

            {/* Quick Demo Test Buttons */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <span className="text-[10px] text-stone-400 block mb-1.5 font-medium">
                Clientes de Exemplo para Teste Rápido:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSearchPhone('(68) 99245-8811');
                    setFoundClient(StorageService.getLoyaltyByPhone('68992458811'));
                  }}
                  className="px-2 py-1 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 text-[11px] font-semibold transition-colors"
                >
                  Carla (5/5 pts - Ganhou!)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchPhone('(68) 99912-3456');
                    setFoundClient(StorageService.getLoyaltyByPhone('68999123456'));
                  }}
                  className="px-2 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-[11px] font-semibold transition-colors"
                >
                  Juliana (4/5 pts)
                </button>
              </div>
            </div>
          </div>

          {/* How It Works Card */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs space-y-3.5">
            <h4 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-600" />
              Como Funciona o Programa:
            </h4>

            <ol className="text-xs text-stone-600 space-y-2.5 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  <b>Agende sua pintura artesanal</b> pelo aplicativo ou diretamente no WhatsApp do ateliê.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  <b>Conclua seu atendimento</b> no nosso espaço em Rio Branco e receba 1 carimbo digital.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  3
                </span>
                <span>
                  <b>Bateu 5 atendimentos?</b> O prêmio é seu automaticamente! Apresente seu telefone e desfrute de sua arte de cortesia.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
