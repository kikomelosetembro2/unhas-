import React, { useState } from 'react';
import { Award, Sparkles, Gift, Check, Search, Calendar, Phone, Heart, ChevronRight, MessageCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { LoyaltyClient, SalonInfo } from '../types';

interface LoyaltyDashboardProps {
  salon: SalonInfo;
  onOpenBooking: () => void;
}

export const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({ salon, onOpenBooking }) => {
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<LoyaltyClient | null>(() => {
    // Default to the first sample client so the user immediately sees a live card preview
    const clients = StorageService.getLoyaltyClients();
    return clients[0] || null;
  });
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = searchPhone.replace(/\D/g, '');
    if (!clean) return;

    const found = StorageService.getLoyaltyByPhone(clean);
    setSelectedClient(found || null);
  };

  const handleSelectQuickClient = (client: LoyaltyClient) => {
    setSelectedClient(client);
    setSearchPhone(client.formattedPhone);
    setSearched(true);
  };

  const allClients = StorageService.getLoyaltyClients();

  return (
    <section id="fidelidade" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold mb-3 shadow-2xs">
          <Award className="w-3.5 h-3.5" /> Programa de Recompensas Exclusivo
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-black tracking-tight">
          Meu Cartão Fidelidade VIP
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          A cada atendimento de unhas artesanais concluído, você ganha 1 ponto. Complete 5 atendimentos e receba uma recompensa especial de cortesia!
        </p>
      </div>

      {/* Phone Consultation Bar */}
      <div className="max-w-md mx-auto mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="Digite seu WhatsApp: (68) 9XXXX-XXXX"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-2xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-black hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </button>
        </form>

        {/* Quick Demo Clients Chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] text-stone-400 whitespace-nowrap">Demonstração:</span>
          {allClients.slice(0, 3).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectQuickClient(c)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                selectedClient?.id === c.id
                  ? 'bg-pink-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              {c.name.split(' ')[0]} ({c.points}/5)
            </button>
          ))}
        </div>
      </div>

      {/* VIP Loyalty Card Showcase */}
      {selectedClient ? (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* Digital VIP Card Container */}
          <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-500/40 relative overflow-hidden">
            {/* Background luxury shimmer */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  BK
                </div>
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-pink-400 block">
                    B & K Nails Designer · Cartão VIP
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    {selectedClient.name}
                  </h3>
                </div>
              </div>

              <span className="font-mono text-xs text-stone-400 font-medium">
                {selectedClient.formattedPhone}
              </span>
            </div>

            {/* 5-Stamps Grid */}
            <div className="my-6">
              <div className="flex justify-between items-center mb-3 text-xs">
                <span className="font-bold text-stone-300">
                  Progresso Atual do Ciclo:
                </span>
                <span className="font-bold text-pink-400 font-mono text-sm">
                  {selectedClient.points} de 5 atendimentos
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((slot) => {
                  const isFilled = selectedClient.points >= slot;
                  const isPrizeSlot = slot === 5;

                  return (
                    <div
                      key={slot}
                      className={`h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all relative ${
                        isFilled
                          ? isPrizeSlot
                            ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-amber-300 text-stone-950 shadow-lg scale-102 font-black'
                            : 'bg-gradient-to-b from-pink-500 to-pink-600 border-pink-400 text-white shadow-md'
                          : 'bg-stone-900/80 border-stone-800 text-stone-600'
                      }`}
                    >
                      {isFilled ? (
                        <>
                          {isPrizeSlot ? (
                            <Gift className="w-6 h-6 animate-bounce" />
                          ) : (
                            <Check className="w-6 h-6 stroke-[3]" />
                          )}
                          <span className="text-[10px] sm:text-xs font-bold mt-1">
                            {isPrizeSlot ? 'Prêmio!' : `${slot}º Selo`}
                          </span>
                        </>
                      ) : (
                        <>
                          {isPrizeSlot ? (
                            <Gift className="w-5 h-5 text-stone-600" />
                          ) : (
                            <Sparkles className="w-5 h-5 text-stone-700" />
                          )}
                          <span className="text-[10px] sm:text-xs font-medium mt-1 text-stone-500">
                            {slot}º
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Message */}
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs sm:text-sm">
              {selectedClient.points >= 5 ? (
                <div className="flex items-center gap-3 text-amber-300">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0">
                    🎉
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">
                      Parabéns, {selectedClient.name.split(' ')[0]}! Sua Recompensa está Liberada!
                    </h5>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Você completou 5 atendimentos e tem direito a uma cortesia especial no ateliê. Clique abaixo para resgatar!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-stone-300">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      Falta apenas {5 - selectedClient.points} atendimento(s) para seu prêmio!
                    </span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Agende sua próxima pintura artesanal para preencher mais um selo no seu cartão VIP.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons inside Card */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Próximo Atendimento</span>
              </button>

              <a
                href={`https://wa.me/${salon.rawWhatsappNumber}?text=${encodeURIComponent(
                  `Olá! Gostaria de consultar e agendar meu atendimento no Programa Fidelidade B & K Nails. Meu nome é ${selectedClient.name} (${selectedClient.formattedPhone}). Saldo: ${selectedClient.points}/5 pontos.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com a Designer</span>
              </a>
            </div>
          </div>

          {/* Visit History Section */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-2xs space-y-4">
            <h4 className="font-serif text-lg font-bold text-black flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" />
              Histórico de Atendimentos Realizados
            </h4>

            {selectedClient.history && selectedClient.history.length > 0 ? (
              <div className="space-y-3">
                {selectedClient.history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">{item.serviceName}</span>
                      <span className="text-[11px] text-stone-500">{item.description}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-stone-500 block text-[11px]">{item.date}</span>
                      <span className="font-bold text-pink-600 text-xs">
                        {item.pointsChange > 0 ? `+${item.pointsChange} Ponto` : `${item.pointsChange} Pontos`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500">Nenhum histórico anterior registrado.</p>
            )}
          </div>
        </div>
      ) : searched ? (
        <div className="text-center py-12 max-w-md mx-auto bg-white rounded-3xl border border-stone-200 p-8 shadow-2xs space-y-3">
          <Heart className="w-10 h-10 text-pink-400 mx-auto" />
          <h4 className="font-serif text-lg font-bold text-black">Telefone não encontrado</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Ainda não localizamos atendimentos para este número. Ao realizar seu primeiro agendamento, seu cartão fidelidade será ativado automaticamente!
          </p>
          <button
            type="button"
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs"
          >
            Fazer Meu Primeiro Agendamento
          </button>
        </div>
      ) : null}
    </section>
  );
};
