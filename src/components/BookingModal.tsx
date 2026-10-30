import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { NailService, Booking, PaymentMethod, SalonInfo } from '../types';
import { StorageService } from '../services/storage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: NailService | null;
  allServices: NailService[];
  salon: SalonInfo;
  onBookingSuccess: (newBooking: Booking) => void;
}

const AVAILABLE_TIMES = [
  '08:00',
  '09:30',
  '11:00',
  '13:30',
  '15:00',
  '16:30',
  '18:00',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  allServices,
  salon,
  onBookingSuccess,
}) => {
  // Step 1: Service selection
  const [currentServiceId, setCurrentServiceId] = useState<string>(
    selectedService?.id || allServices[0]?.id || ''
  );

  // Step 2: Date & Time
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('14:00');

  // Step 3: Client Info
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Step 4: Payment & Change
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [needChange, setNeedChange] = useState<boolean>(false);
  const [changeForInput, setChangeForInput] = useState<string>('');
  const [pixCopied, setPixCopied] = useState<boolean>(false);

  // Flow State: 'form' | 'success'
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string>('');
  const [generatedReceiptText, setGeneratedReceiptText] = useState<string>('');
  const [receiptCopied, setReceiptCopied] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Sync service if selectedService changes
  useEffect(() => {
    if (selectedService) {
      setCurrentServiceId(selectedService.id);
      // jump to step 2 if a service was already clicked from catalog
      setCurrentStep(2);
    }
  }, [selectedService]);

  const activeService = useMemo(() => {
    return allServices.find((s) => s.id === currentServiceId) || allServices[0];
  }, [allServices, currentServiceId]);

  // Price & Change calculations
  const price = activeService ? activeService.price : 0;
  const changeForNumber = parseFloat(changeForInput.replace(',', '.')) || 0;
  const changeToReturn = needChange && changeForNumber > price ? changeForNumber - price : 0;
  const isChangeInvalid = needChange && changeForNumber > 0 && changeForNumber < price;

  const [identifiedClient, setIdentifiedClient] = useState<{ name: string; points?: number; bookingsCount: number } | null>(null);

  if (!isOpen) return null;

  // Format phone automatically: (68) 9XXXX-XXXX and auto-identify client
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      setClientPhone(digits ? `(${digits}` : '');
    } else if (digits.length <= 7) {
      setClientPhone(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
    } else {
      setClientPhone(
        `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
      );
    }

    // Auto-identify client by phone from past bookings or loyalty records
    if (digits.length >= 8) {
      const identified = StorageService.findClientByPhone(digits);
      if (identified) {
        setIdentifiedClient(identified);
        if (!clientName.trim()) {
          setClientName(identified.name);
        }
      } else {
        setIdentifiedClient(null);
      }
    } else {
      setIdentifiedClient(null);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(salon.pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  // Submit and Generate WhatsApp Link
  const handleSubmitBooking = () => {
    setFormError('');

    if (!clientName.trim()) {
      setFormError('Por favor, informe seu nome completo.');
      setCurrentStep(3);
      return;
    }

    const cleanPhoneDigits = clientPhone.replace(/\D/g, '');
    if (cleanPhoneDigits.length < 10) {
      setFormError('Por favor, informe um telefone/WhatsApp válido com DDD.');
      setCurrentStep(3);
      return;
    }

    if (!selectedDate || !selectedTime) {
      setFormError('Por favor, selecione uma data e horário válidos.');
      setCurrentStep(2);
      return;
    }

    if (paymentMethod === 'dinheiro' && needChange) {
      if (!changeForNumber || changeForNumber <= price) {
        setFormError(
          `O valor entregue para troco deve ser maior que o valor do serviço (R$ ${price.toFixed(2).replace('.', ',')}).`
        );
        setCurrentStep(4);
        return;
      }
    }

    // Save booking in store
    const newBooking = StorageService.addBooking({
      clientName: clientName.trim(),
      clientPhone,
      serviceId: activeService.id,
      serviceName: activeService.name,
      servicePrice: price,
      date: selectedDate,
      time: selectedTime,
      notes: notes.trim(),
      paymentMethod,
      needChange: paymentMethod === 'dinheiro' ? needChange : undefined,
      changeFor: paymentMethod === 'dinheiro' && needChange ? changeForNumber : undefined,
      changeAmount: paymentMethod === 'dinheiro' && needChange ? changeToReturn : undefined,
    });

    // Generate official formatted receipt message
    const waMessage = StorageService.generateWhatsAppMessage({
      id: newBooking.id,
      clientName: clientName.trim(),
      clientPhone,
      serviceName: activeService.name,
      date: selectedDate,
      time: selectedTime,
      servicePrice: price,
      paymentMethod,
      needChange: paymentMethod === 'dinheiro' ? needChange : undefined,
      changeFor: paymentMethod === 'dinheiro' && needChange ? changeForNumber : undefined,
      changeAmount: paymentMethod === 'dinheiro' && needChange ? changeToReturn : undefined,
      notes,
    });

    // Always direct to WhatsApp (68) 98118-0360
    const recipientNumber = salon.rawWhatsappNumber || '5568981180360';
    const waUrl = StorageService.buildWhatsAppLink(recipientNumber, waMessage);

    setCreatedBooking(newBooking);
    setGeneratedWhatsAppUrl(waUrl);
    setGeneratedReceiptText(waMessage);
    onBookingSuccess(newBooking);

    // Open WhatsApp immediately with receipt to (68) 98118-0360
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyReceiptText = () => {
    if (!generatedReceiptText) return;
    navigator.clipboard.writeText(generatedReceiptText);
    setReceiptCopied(true);
    setTimeout(() => setReceiptCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-pink-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-stone-950 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white shadow-xs">
              BK
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                Agendamento de Pintura Artesanal
              </h3>
              <p className="text-xs text-stone-300">
                B & K NAILS DESIGNER · Rio Branco - AC
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Stepper indicator if not success yet */}
        {!createdBooking && (
          <div className="bg-pink-50/50 px-6 py-2.5 border-b border-pink-100 flex items-center justify-between text-xs font-medium text-stone-500">
            <span
              className={`flex items-center gap-1 ${
                currentStep === 1 ? 'text-pink-600 font-bold' : ''
              }`}
            >
              1. Arte
            </span>
            <span>→</span>
            <span
              className={`flex items-center gap-1 ${
                currentStep === 2 ? 'text-pink-600 font-bold' : ''
              }`}
            >
              2. Data & Hora
            </span>
            <span>→</span>
            <span
              className={`flex items-center gap-1 ${
                currentStep === 3 ? 'text-pink-600 font-bold' : ''
              }`}
            >
              3. Seus Dados
            </span>
            <span>→</span>
            <span
              className={`flex items-center gap-1 ${
                currentStep === 4 ? 'text-pink-600 font-bold' : ''
              }`}
            >
              4. Pagamento
            </span>
          </div>
        )}

        {/* Error Alert if any */}
        {formError && (
          <div className="m-4 mb-0 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {createdBooking ? (
            /* Booking Confirmation & Official Receipt Screen */
            <div className="text-center py-3 space-y-4">
              <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <Check className="w-3.5 h-3.5" /> Comprovante Enviado para WhatsApp {salon.bookingWhatsapp || '(68) 98118-0360'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-950 mt-2">
                  Agendamento Confirmado!
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                  O comprovante oficial com todos os detalhes foi gerado e enviado diretamente para a designer no WhatsApp <b>{salon.bookingWhatsapp || '(68) 98118-0360'}</b>.
                </p>
              </div>

              {/* Official Stylized Receipt Card */}
              <div className="bg-white border-2 border-dashed border-pink-300 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-2.5 shadow-xs relative">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="font-bold text-stone-950 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    🧾 Comprovante Oficial
                  </span>
                  <span className="font-mono text-pink-700 font-bold bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-200">
                    #{createdBooking.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Cliente:</span>
                  <span className="font-bold text-black text-right">
                    {createdBooking.clientName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">WhatsApp da Cliente:</span>
                  <span className="font-mono text-stone-800">
                    {createdBooking.clientPhone}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Arte Artesanal:</span>
                  <span className="font-bold text-stone-900 text-right">
                    {createdBooking.serviceName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Data e Horário:</span>
                  <span className="font-bold text-black">
                    {createdBooking.date.split('-').reverse().join('/')} às {createdBooking.time}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                  <span className="text-stone-600 font-semibold">Valor Total:</span>
                  <span className="font-bold text-pink-700 text-base font-sans tabular-nums">
                    R$ {createdBooking.servicePrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Forma de Pagamento:</span>
                  <span className="font-semibold text-stone-800">
                    {StorageService.formatPaymentMethod(
                      createdBooking.paymentMethod,
                      createdBooking.needChange,
                      createdBooking.changeFor,
                      createdBooking.changeAmount
                    )}
                  </span>
                </div>

                {createdBooking.needChange && createdBooking.changeAmount && (
                  <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span>Troco que receberá:</span>
                    <span>R$ {createdBooking.changeAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-400 text-center">
                  B & K NAILS DESIGNER · Rio Branco - AC · WhatsApp: {salon.bookingWhatsapp || '(68) 98118-0360'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={generatedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Reabrir WhatsApp ({salon.bookingWhatsapp || '(68) 98118-0360'})</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyReceiptText}
                  className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
                >
                  {receiptCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Comprovante Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-600" />
                      <span>Copiar Texto do Comprovante</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 font-medium"
                >
                  Voltar ao Catálogo
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <div className="space-y-6">
              {/* STEP 1: Select Service */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      Escolha a Arte Desejada
                    </h4>
                    <span className="text-xs text-stone-500">
                      {allServices.length} modelos disponíveis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {allServices.map((service) => {
                      const isSelected = service.id === currentServiceId;
                      return (
                        <div
                          key={service.id}
                          onClick={() => setCurrentServiceId(service.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/20'
                              : 'border-stone-200 hover:border-pink-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={service.imageUrl}
                              alt={service.name}
                              className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h5 className="font-semibold text-xs text-stone-900 leading-tight">
                                {service.name}
                              </h5>
                              <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {service.duration}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-pink-600 tabular-nums shrink-0">
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Date & Time */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      Data e Horário do Atendimento
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Atendimento exclusivo no ateliê em Rio Branco - AC.
                    </p>
                  </div>

                  {/* Selected service summary with photo */}
                  <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeService.imageUrl}
                        alt={activeService.name}
                        className="w-12 h-12 rounded-lg object-cover border border-pink-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[10px] text-stone-500 block">Arte Selecionada:</span>
                        <span className="font-semibold text-stone-900">{activeService.name}</span>
                      </div>
                    </div>
                    <span className="font-bold text-pink-600 shrink-0">
                      R$ {activeService.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Date picker */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-pink-600" />
                      Escolha a Data:
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 focus:bg-white focus:ring-1 focus:ring-pink-500 outline-hidden"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-600" />
                      Horários Disponíveis (Rio Branco):
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {AVAILABLE_TIMES.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            type="button"
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-pink-300 hover:text-pink-600'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Client Info */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      Seus Dados para Contato
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Precisamos do seu WhatsApp para enviar a confirmação da designer.
                    </p>
                  </div>

                  {/* Client Identification Banner */}
                  {identifiedClient && (
                    <div className="p-3 bg-pink-50/90 border border-pink-200 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-pink-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          {identifiedClient.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">
                            Bem-vinda de volta, {identifiedClient.name}! ✨
                          </span>
                          <span className="text-[11px] text-stone-600">
                            Cliente identificada {identifiedClient.points !== undefined ? `· Saldo: ${identifiedClient.points}/5 pontos no Cartão Fidelidade` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                        ✓ Reconhecida
                      </span>
                    </div>
                  )}

                  {/* Client Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-pink-600" />
                      Telefone / WhatsApp: *
                    </label>
                    <input
                      type="tel"
                      placeholder="(68) 9XXXX-XXXX"
                      value={clientPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden placeholder:text-stone-400 font-mono font-semibold"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Digite seu WhatsApp. Clientes cadastradas são identificadas automaticamente.
                    </span>
                  </div>

                  {/* Client Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-pink-600" />
                      Nome Completo da Cliente: *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Maria Eduarda Silva"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden placeholder:text-stone-400 font-semibold"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Observações ou Preferências (Opcional):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Tenho unhas curtas, prefiro tom rosa leitoso, unha sensível..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden placeholder:text-stone-400 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Payment Options & Change Calculator */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      Forma de Pagamento & Troco
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Escolha como prefere acertar no dia do atendimento.
                    </p>
                  </div>

                  {/* Payment Methods Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Pix */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('pix');
                        setNeedChange(false);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        paymentMethod === 'pix'
                          ? 'border-pink-600 bg-pink-50/70 ring-2 ring-pink-500/20 text-stone-900'
                          : 'border-stone-200 bg-white hover:border-pink-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <QrCode className="w-4 h-4 text-pink-600" />
                        {paymentMethod === 'pix' && <Check className="w-3.5 h-3.5 text-pink-600" />}
                      </div>
                      <span className="text-xs font-bold mt-1">PIX</span>
                      <span className="text-[10px] text-stone-500">Chave rápida</span>
                    </button>

                    {/* Dinheiro */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('dinheiro')}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        paymentMethod === 'dinheiro'
                          ? 'border-pink-600 bg-pink-50/70 ring-2 ring-pink-500/20 text-stone-900'
                          : 'border-stone-200 bg-white hover:border-pink-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        {paymentMethod === 'dinheiro' && <Check className="w-3.5 h-3.5 text-pink-600" />}
                      </div>
                      <span className="text-xs font-bold mt-1">Dinheiro em Espécie</span>
                      <span className="text-[10px] text-stone-500">Com opção de troco</span>
                    </button>

                    {/* Cartão de Crédito */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('cartao_credito');
                        setNeedChange(false);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        paymentMethod === 'cartao_credito'
                          ? 'border-pink-600 bg-pink-50/70 ring-2 ring-pink-500/20 text-stone-900'
                          : 'border-stone-200 bg-white hover:border-pink-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <CreditCard className="w-4 h-4 text-pink-600" />
                        {paymentMethod === 'cartao_credito' && <Check className="w-3.5 h-3.5 text-pink-600" />}
                      </div>
                      <span className="text-xs font-bold mt-1">Cartão de Crédito</span>
                      <span className="text-[10px] text-stone-500">Maquininha no local</span>
                    </button>

                    {/* Cartão de Débito */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('cartao_debito');
                        setNeedChange(false);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        paymentMethod === 'cartao_debito'
                          ? 'border-pink-600 bg-pink-50/70 ring-2 ring-pink-500/20 text-stone-900'
                          : 'border-stone-200 bg-white hover:border-pink-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <CreditCard className="w-4 h-4 text-stone-700" />
                        {paymentMethod === 'cartao_debito' && <Check className="w-3.5 h-3.5 text-pink-600" />}
                      </div>
                      <span className="text-xs font-bold mt-1">Cartão de Débito</span>
                      <span className="text-[10px] text-stone-500">Maquininha no local</span>
                    </button>
                  </div>

                  {/* Dynamic Panel: Cash & Change Calculator */}
                  {paymentMethod === 'dinheiro' && (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800">
                          Precisa de Troco?
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setNeedChange(false);
                              setChangeForInput('');
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              !needChange
                                ? 'bg-stone-900 text-white'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            Não
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNeedChange(true);
                              if (!changeForInput) {
                                // Default to a rounded higher bill, e.g. next 50/100
                                const suggested = Math.ceil(price / 50) * 50;
                                setChangeForInput(suggested > price ? suggested.toString() : (price + 50).toString());
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              needChange
                                ? 'bg-pink-600 text-white'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            Sim
                          </button>
                        </div>
                      </div>

                      {needChange ? (
                        <div className="space-y-3 pt-2 border-t border-stone-200">
                          <div>
                            <label className="block text-xs font-medium text-stone-700 mb-1">
                              Você vai pagar com cédula de quanto? (R$)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                                R$
                              </span>
                              <input
                                type="text"
                                placeholder="Ex: 150,00 ou 200,00"
                                value={changeForInput}
                                onChange={(e) => setChangeForInput(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm font-semibold bg-white border border-stone-300 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden font-mono"
                              />
                            </div>
                          </div>

                          {/* Quick suggestions */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-stone-400">Sugestões:</span>
                            {[100, 150, 200].map((val) => {
                              if (val <= price) return null;
                              return (
                                <button
                                  type="button"
                                  key={val}
                                  onClick={() => setChangeForInput(val.toString())}
                                  className="text-[11px] px-2.5 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 hover:border-pink-400 hover:text-pink-600"
                                >
                                  R$ {val},00
                                </button>
                              );
                            })}
                          </div>

                          {/* Calculation result */}
                          {changeForNumber > 0 && (
                            <div
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                                isChangeInvalid
                                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                              }`}
                            >
                              <span>
                                {isChangeInvalid
                                  ? 'O valor é menor que o serviço!'
                                  : 'Troco que você receberá:'}
                              </span>
                              <span className="font-mono text-sm font-bold">
                                {isChangeInvalid
                                  ? 'Valor insuficiente'
                                  : `R$ ${changeToReturn.toFixed(2).replace('.', ',')}`}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-stone-500 pt-1">
                          Você pagará o valor exato de <b>R$ {price.toFixed(2).replace('.', ',')}</b> em dinheiro no ateliê.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Dynamic Panel: Pix Key Details */}
                  {paymentMethod === 'pix' && (
                    <div className="p-4 bg-pink-50/80 rounded-2xl border border-pink-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          Chave Pix do Salão (Telefone):
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="flex items-center gap-1 text-[11px] font-semibold text-pink-700 hover:text-pink-800"
                        >
                          {pixCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copiar Chave
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-pink-200 font-mono text-xs font-bold text-stone-900 flex items-center justify-between">
                        <span>{salon.pixKey}</span>
                        <span className="text-[10px] text-stone-400 font-sans font-normal">
                          {salon.pixReceiver}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500">
                        Você pode pagar antecipadamente ou no momento da realização do serviço no ateliê.
                      </p>
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="p-3.5 bg-stone-950 text-white rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Total a Pagar</span>
                      <span className="font-serif text-lg font-bold text-pink-400">
                        R$ {price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-400 block text-[10px]">Agendamento para</span>
                      <span className="font-semibold text-stone-200">
                        {selectedDate.split('-').reverse().join('/')} às {selectedTime}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls between Steps */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs text-stone-500 hover:text-stone-800 font-medium"
                  >
                    Cancelar
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFormError('');
                      if (currentStep === 3) {
                        if (!clientName.trim()) {
                          setFormError('Por favor, informe seu nome completo.');
                          return;
                        }
                        if (clientPhone.replace(/\D/g, '').length < 10) {
                          setFormError('Por favor, informe um telefone/WhatsApp válido.');
                          return;
                        }
                      }
                      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <span>Avançar</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitBooking}
                    className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-pink-200" />
                    <span>Finalizar & Enviar WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
