import {
  NailService,
  Booking,
  SalonInfo,
  LoyaltyClient,
  ProductReview,
  Testimonial,
  FinancialRecord,
  FinancialOperationType,
} from '../types';
import {
  INITIAL_PRODUCTS,
  SALON_DATA,
  INITIAL_REVIEWS,
  INITIAL_TESTIMONIALS,
  DEFAULT_REMINDER_TEMPLATE,
} from '../data/initialProducts';

const PRODUCTS_KEY = 'bk_nails_products_v1';
const BOOKINGS_KEY = 'bk_nails_bookings_v1';
const SALON_KEY = 'bk_nails_salon_v2';
const LOYALTY_KEY = 'bk_nails_loyalty_v1';
const REVIEWS_KEY = 'bk_nails_reviews_v1';
const TESTIMONIALS_KEY = 'bk_nails_testimonials_v1';
const FINANCIAL_KEY = 'bk_nails_financial_v1';

const INITIAL_SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    clientName: 'Juliana Medeiros',
    clientPhone: '(68) 99912-3456',
    serviceId: 'prod-1',
    serviceName: 'Unha Encapsulada com Glitter e Flores Secas',
    servicePrice: 120.00,
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    notes: 'Prefiro flores em tons lilás e dourado suave',
    paymentMethod: 'pix',
    status: 'Concluído',
  },
  {
    id: 'bk-102',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    clientName: 'Carla Beatriz Alencar',
    clientPhone: '(68) 99245-8811',
    serviceId: 'prod-2',
    serviceName: 'Nail Art Francesinha Reversa com Traços Finos',
    servicePrice: 100.00,
    date: new Date().toISOString().split('T')[0],
    time: '16:30',
    paymentMethod: 'dinheiro',
    needChange: true,
    changeFor: 150.00,
    changeAmount: 50.00,
    status: 'Concluído',
  },
  {
    id: 'bk-103',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    clientName: 'Amanda Silveira',
    clientPhone: '(68) 98401-2299',
    serviceId: 'prod-9',
    serviceName: 'Arte 3D em Relevo com Pedrarias Aplicadas',
    servicePrice: 140.00,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00',
    paymentMethod: 'cartao_credito',
    notes: 'Unhas curtas mas quero relevo delicado',
    status: 'Confirmado',
  },
  {
    id: 'bk-104',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    clientName: 'Fernanda Rocha',
    clientPhone: '(68) 99933-7712',
    serviceId: 'prod-5',
    serviceName: 'Pintura Floral Feita à Mão Livre',
    servicePrice: 110.00,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '15:00',
    paymentMethod: 'pix',
    status: 'Concluído',
  },
  {
    id: 'bk-105',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    clientName: 'Camila Vasconcelos',
    clientPhone: '(68) 99988-1122',
    serviceId: 'prod-1',
    serviceName: 'Unha Encapsulada com Glitter e Flores Secas',
    servicePrice: 120.00,
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    time: '11:00',
    paymentMethod: 'cartao_credito',
    status: 'Concluído',
  },
  {
    id: 'bk-106',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    clientName: 'Bruna Nogueira',
    clientPhone: '(68) 98112-9988',
    serviceId: 'prod-2',
    serviceName: 'Nail Art Francesinha Reversa com Traços Finos',
    servicePrice: 100.00,
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    time: '09:30',
    paymentMethod: 'dinheiro',
    needChange: true,
    changeFor: 200.00,
    changeAmount: 100.00,
    status: 'Concluído',
  },
  {
    id: 'bk-107',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    clientName: 'Letícia Albuquerque',
    clientPhone: '(68) 99233-4455',
    serviceId: 'prod-1',
    serviceName: 'Unha Encapsulada com Glitter e Flores Secas',
    servicePrice: 120.00,
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    time: '14:00',
    paymentMethod: 'pix',
    status: 'Concluído',
  },
  {
    id: 'bk-108',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    clientName: 'Renata Frota',
    clientPhone: '(68) 98455-6677',
    serviceId: 'prod-9',
    serviceName: 'Arte 3D em Relevo com Pedrarias Aplicadas',
    servicePrice: 140.00,
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    time: '16:00',
    paymentMethod: 'cartao_debito',
    status: 'Concluído',
  },
  {
    id: 'bk-109',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    clientName: 'Mariana Bezerra',
    clientPhone: '(68) 99901-7788',
    serviceId: 'prod-5',
    serviceName: 'Pintura Floral Feita à Mão Livre',
    servicePrice: 110.00,
    date: new Date().toISOString().split('T')[0],
    time: '17:30',
    paymentMethod: 'pix',
    status: 'Confirmado',
  },
  {
    id: 'bk-110',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    clientName: 'Daniele Sampaio',
    clientPhone: '(68) 99277-3344',
    serviceId: 'prod-3',
    serviceName: 'Pintura Artesanal Mármore Realista (Par de Unhas)',
    servicePrice: 85.00,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '11:00',
    paymentMethod: 'dinheiro',
    needChange: false,
    status: 'Pendente',
  },
];

const INITIAL_LOYALTY_CLIENTS: LoyaltyClient[] = [
  {
    id: 'loy-1',
    phone: '68999123456',
    formattedPhone: '(68) 99912-3456',
    name: 'Juliana Medeiros',
    points: 4, // 4 de 5 pontos!
    totalCompletedAppointments: 4,
    rewardsClaimed: 0,
    lastVisit: '2026-10-24',
    history: [
      { id: 'h1', date: '2026-10-24', serviceName: 'Unha Encapsulada Flores Secas', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
      { id: 'h2', date: '2026-10-10', serviceName: 'Francesinha Reversa Traços Finos', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
      { id: 'h3', date: '2026-09-25', serviceName: 'Degradê Ombrê Glitterizado', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
      { id: 'h4', date: '2026-09-08', serviceName: 'Pintura Floral Feita à Mão Livre', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
    ],
  },
  {
    id: 'loy-2',
    phone: '68992458811',
    formattedPhone: '(68) 99245-8811',
    name: 'Carla Beatriz Alencar',
    points: 5, // Completou 5 pontos! Prêmio Liberado!
    totalCompletedAppointments: 5,
    rewardsClaimed: 0,
    lastVisit: '2026-10-28',
    history: [
      { id: 'h5', date: '2026-10-28', serviceName: 'Nail Art Francesinha Reversa', description: '5º Atendimento concluído! Ganhou Recompensa Especial! 🎉', pointsChange: 1 },
      { id: 'h6', date: '2026-10-14', serviceName: 'Efeito Cromado Geométrico', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
      { id: 'h7', date: '2026-09-30', serviceName: 'Pintura Artesanal Mármore', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
      { id: 'h8', date: '2026-09-15', serviceName: 'Arte 3D em Relevo com Pedrarias', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
      { id: 'h9', date: '2026-08-28', serviceName: 'Pintura Metalizada Abstrata', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
    ],
  },
  {
    id: 'loy-3',
    phone: '68999337712',
    formattedPhone: '(68) 99933-7712',
    name: 'Fernanda Rocha',
    points: 2,
    totalCompletedAppointments: 2,
    rewardsClaimed: 0,
    lastVisit: '2026-10-27',
    history: [
      { id: 'h10', date: '2026-10-27', serviceName: 'Pintura Floral Feita à Mão Livre', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
      { id: 'h11', date: '2026-10-05', serviceName: 'Unha Encapsulada Glitter', description: 'Atendimento concluído (+1 ponto)', pointsChange: 1 },
    ],
  },
];

export const StorageService = {
  getProducts(): NailService[] {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (!data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: NailService[]): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  resetProducts(): NailService[] {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(BOOKINGS_KEY);
      if (!data) {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_SAMPLE_BOOKINGS));
        return INITIAL_SAMPLE_BOOKINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SAMPLE_BOOKINGS;
    }
  },

  saveBookings(bookings: Booking[]): void {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  },

  addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const current = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: `bk-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'Pendente',
    };
    const updated = [newBooking, ...current];
    this.saveBookings(updated);
    return newBooking;
  },

  updateBookingStatus(id: string, status: Booking['status']): Booking[] {
    const current = this.getBookings();
    const target = current.find(b => b.id === id);
    const updated = current.map(b => b.id === id ? { ...b, status } : b);
    this.saveBookings(updated);

    // If marked as 'Concluído', automatically register loyalty point!
    if (target && status === 'Concluído' && target.status !== 'Concluído') {
      this.addLoyaltyPoint(target.clientPhone, target.clientName, target.serviceName);
    }

    return updated;
  },

  deleteBooking(id: string): Booking[] {
    const current = this.getBookings();
    const updated = current.filter(b => b.id !== id);
    this.saveBookings(updated);
    return updated;
  },

  getSalonInfo(): SalonInfo {
    try {
      const data = localStorage.getItem(SALON_KEY);
      if (!data) {
        localStorage.setItem(SALON_KEY, JSON.stringify(SALON_DATA));
        return SALON_DATA;
      }
      const parsed = JSON.parse(data);
      // Migrate legacy number if present
      if (parsed.bookingWhatsapp === '(68) 99282-7744' || parsed.rawWhatsappNumber === '5568992827744') {
        parsed.bookingWhatsapp = '(68) 98118-0360';
        parsed.rawWhatsappNumber = '5568981180360';
        parsed.pixKey = '68981180360';
      }
      return {
        ...SALON_DATA,
        ...parsed,
        autoReminderEnabled: parsed.autoReminderEnabled !== undefined ? parsed.autoReminderEnabled : true,
        reminderTemplate: parsed.reminderTemplate || DEFAULT_REMINDER_TEMPLATE,
        reminderHoursBefore: parsed.reminderHoursBefore || 24,
      };
    } catch {
      return SALON_DATA;
    }
  },

  saveSalonInfo(info: SalonInfo): void {
    localStorage.setItem(SALON_KEY, JSON.stringify(info));
  },

  // -------------------------------------------------------------
  // FIDELIDADE & PONTUAÇÃO (5 ATENDIMENTOS = 1 RECOMPENSA)
  // -------------------------------------------------------------
  getLoyaltyClients(): LoyaltyClient[] {
    try {
      const data = localStorage.getItem(LOYALTY_KEY);
      if (!data) {
        localStorage.setItem(LOYALTY_KEY, JSON.stringify(INITIAL_LOYALTY_CLIENTS));
        return INITIAL_LOYALTY_CLIENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LOYALTY_CLIENTS;
    }
  },

  saveLoyaltyClients(clients: LoyaltyClient[]): void {
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(clients));
  },

  getLoyaltyByPhone(rawPhone: string): LoyaltyClient | null {
    const cleanDigits = rawPhone.replace(/\D/g, '');
    if (!cleanDigits) return null;
    const clients = this.getLoyaltyClients();
    return clients.find(c => c.phone.includes(cleanDigits) || cleanDigits.includes(c.phone)) || null;
  },

  addLoyaltyPoint(clientPhone: string, clientName: string, serviceName: string): LoyaltyClient {
    const cleanDigits = clientPhone.replace(/\D/g, '');
    const clients = this.getLoyaltyClients();
    const today = new Date().toISOString().split('T')[0];

    let client = clients.find(c => c.phone === cleanDigits || c.phone.endsWith(cleanDigits.slice(-8)));

    if (!client) {
      client = {
        id: `loy-${Date.now()}`,
        phone: cleanDigits,
        formattedPhone: clientPhone,
        name: clientName,
        points: 1,
        totalCompletedAppointments: 1,
        rewardsClaimed: 0,
        lastVisit: today,
        history: [
          {
            id: `h-${Date.now()}`,
            date: today,
            serviceName,
            description: '1º Atendimento concluído (+1 ponto no Cartão Fidelidade)',
            pointsChange: 1,
          },
        ],
      };
      this.saveLoyaltyClients([client, ...clients]);
      return client;
    }

    // Increment points (max cycle 5 points)
    const newPoints = client.points + 1;
    const hasCompletedReward = newPoints >= 5;

    const updatedClient: LoyaltyClient = {
      ...client,
      name: clientName || client.name,
      formattedPhone: clientPhone || client.formattedPhone,
      points: hasCompletedReward ? 5 : newPoints,
      totalCompletedAppointments: client.totalCompletedAppointments + 1,
      lastVisit: today,
      history: [
        {
          id: `h-${Date.now()}`,
          date: today,
          serviceName,
          description: hasCompletedReward
            ? `Parabéns! Completou 5 pontos no B & K Nails! Recompensa Desbloqueada! 🎁💅`
            : `Atendimento concluído (+1 ponto: agora tem ${newPoints}/5)`,
          pointsChange: 1,
        },
        ...client.history,
      ],
    };

    const updatedClients = clients.map(c => c.id === client!.id ? updatedClient : c);
    this.saveLoyaltyClients(updatedClients);
    return updatedClient;
  },

  redeemReward(phone: string): LoyaltyClient | null {
    const cleanDigits = phone.replace(/\D/g, '');
    const clients = this.getLoyaltyClients();
    const client = clients.find(c => c.phone.includes(cleanDigits) || cleanDigits.includes(c.phone));
    if (!client) return null;

    const today = new Date().toISOString().split('T')[0];
    const updatedClient: LoyaltyClient = {
      ...client,
      points: 0, // Zera para novo ciclo de 5 pontos
      rewardsClaimed: client.rewardsClaimed + 1,
      history: [
        {
          id: `h-${Date.now()}`,
          date: today,
          serviceName: 'Resgate de Recompensa (5 Pontos)',
          description: 'Recompensa de 5 pontos resgatada com sucesso! Ciclo reiniciado para novos pontos.',
          pointsChange: -5,
        },
        ...client.history,
      ],
    };

    const updatedClients = clients.map(c => c.id === client.id ? updatedClient : c);
    this.saveLoyaltyClients(updatedClients);
    return updatedClient;
  },

  setClientPoints(clientId: string, points: number): LoyaltyClient[] {
    const clients = this.getLoyaltyClients();
    const clamped = Math.max(0, Math.min(5, points));
    const updated = clients.map(c => c.id === clientId ? { ...c, points: clamped } : c);
    this.saveLoyaltyClients(updated);
    return updated;
  },

  // -------------------------------------------------------------
  // COMPRESSÃO & UPLOAD DE IMAGEM .JPG LOCAL
  // -------------------------------------------------------------
  async processLocalJpgFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Validate that it is an image
      if (!file.type.startsWith('image/')) {
        reject(new Error('Por favor, selecione um arquivo de imagem com extensão .jpg ou .jpeg.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          // Downscale to max 1000px dimension to ensure lightweight local storage
          const maxDim = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Export explicitly as image/jpeg (.jpg)
          const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(jpgDataUrl);
        };
        img.onerror = () => {
          reject(new Error('Não foi possível carregar a imagem. Verifique o formato do arquivo.'));
        };
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Erro na leitura do arquivo local.'));
      };
      reader.readAsDataURL(file);
    });
  },

  // -------------------------------------------------------------
  // FORMATAÇÃO E WHATSAPP
  // -------------------------------------------------------------
  formatPaymentMethod(method: string, needChange?: boolean, changeFor?: number, changeAmount?: number): string {
    switch (method) {
      case 'dinheiro':
        if (needChange && changeFor && changeAmount) {
          return `Dinheiro (Leva R$ ${changeFor.toFixed(2).replace('.', ',')} - Troco: R$ ${changeAmount.toFixed(2).replace('.', ',')})`;
        } else if (needChange === false) {
          return 'Dinheiro (Valor exato, não precisa de troco)';
        }
        return 'Dinheiro';
      case 'pix':
        return 'Pix';
      case 'cartao_credito':
        return 'Cartão de Crédito';
      case 'cartao_debito':
        return 'Cartão de Débito';
      default:
        return method;
    }
  },

  generateWhatsAppMessage(booking: {
    id?: string;
    clientName: string;
    clientPhone: string;
    serviceName: string;
    date: string;
    time: string;
    servicePrice: number;
    paymentMethod: string;
    needChange?: boolean;
    changeFor?: number;
    changeAmount?: number;
    notes?: string;
    currentLoyaltyPoints?: number;
  }): string {
    const [year, month, day] = booking.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const formattedPrice = booking.servicePrice.toFixed(2).replace('.', ',');
    const paymentDesc = this.formatPaymentMethod(booking.paymentMethod, booking.needChange, booking.changeFor, booking.changeAmount);
    const now = new Date();
    const emissaoStr = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    let msg = `🧾 *COMPROVANTE OFICIAL DE AGENDAMENTO*\n`;
    msg += `*B & K NAILS DESIGNER*\n`;
    msg += `Pinturas de Unhas Artesanais · Rio Branco - AC\n`;
    msg += `--------------------------------------\n`;
    if (booking.id) {
      msg += `📋 *Código da Reserva:* #${booking.id}\n`;
    }
    msg += `📅 *Emitido em:* ${emissaoStr}\n\n`;

    msg += `👤 *DADOS DA CLIENTE:*\n`;
    msg += `• *Nome:* ${booking.clientName}\n`;
    msg += `• *Telefone/WhatsApp:* ${booking.clientPhone}\n\n`;

    msg += `💅 *SERVIÇO ESCOLHIDO:*\n`;
    msg += `• *Arte Artesanal:* ${booking.serviceName}\n`;
    msg += `• *Data e Horário:* ${formattedDate} às ${booking.time}\n\n`;

    msg += `💰 *VALOR E FORMA DE PAGAMENTO:*\n`;
    msg += `• *Valor Total:* R$ ${formattedPrice}\n`;
    msg += `• *Pagamento:* ${paymentDesc}\n`;

    if (booking.paymentMethod === 'dinheiro') {
      if (booking.needChange && booking.changeFor && booking.changeAmount) {
        msg += `• *Cédula Entregue:* R$ ${booking.changeFor.toFixed(2).replace('.', ',')}\n`;
        msg += `• *Troco a Devolver:* R$ ${booking.changeAmount.toFixed(2).replace('.', ',')}\n`;
      } else {
        msg += `• *Troco:* Não precisa de troco (valor exato)\n`;
      }
    }

    if (booking.notes && booking.notes.trim()) {
      msg += `\n📝 *Observações:* ${booking.notes.trim()}\n`;
    }

    if (booking.currentLoyaltyPoints !== undefined) {
      msg += `\n🎁 *Cartão Fidelidade:* ${booking.currentLoyaltyPoints}/5 pontos registrados\n`;
    }

    msg += `\n--------------------------------------\n`;
    msg += `📍 *Ateliê:* Rio Branco - Acre\n`;
    msg += `📲 *WhatsApp de Agendamentos:* (68) 98118-0360\n`;
    msg += `✅ _Comprovante enviado automaticamente para confirmação da designer._`;

    return msg;
  },

  generateBookingReceiptMessage(booking: {
    id?: string;
    clientName: string;
    clientPhone: string;
    serviceName: string;
    date: string;
    time: string;
    servicePrice: number;
    paymentMethod: string;
    needChange?: boolean;
    changeFor?: number;
    changeAmount?: number;
    notes?: string;
  }): string {
    return this.generateWhatsAppMessage(booking);
  },

  buildWhatsAppLink(phone: string, text: string): string {
    let cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('55')) {
      cleanPhone = `55${cleanPhone}`;
    }
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  },

  // -------------------------------------------------------------
  // IDENTIFICAÇÃO DO CLIENTE PELO TELEFONE / WHATSAPP
  // -------------------------------------------------------------
  findClientByPhone(phone: string): { name: string; points?: number; bookingsCount: number } | null {
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 8) return null;

    // Check loyalty clients first
    const loyalty = this.getLoyaltyByPhone(cleanDigits);
    if (loyalty && loyalty.name) {
      return {
        name: loyalty.name,
        points: loyalty.points,
        bookingsCount: loyalty.totalCompletedAppointments,
      };
    }

    // Check bookings history
    const bookings = this.getBookings();
    const found = bookings.find((b) => {
      const bDigits = b.clientPhone.replace(/\D/g, '');
      return bDigits.includes(cleanDigits) || cleanDigits.includes(bDigits);
    });

    if (found && found.clientName) {
      const count = bookings.filter((b) => {
        const bDigits = b.clientPhone.replace(/\D/g, '');
        return bDigits.includes(cleanDigits) || cleanDigits.includes(bDigits);
      }).length;

      return {
        name: found.clientName,
        bookingsCount: count,
      };
    }

    return null;
  },

  // -------------------------------------------------------------
  // AVALIAÇÕES (5 ESTRELAS) DOS PRODUTOS
  // -------------------------------------------------------------
  getReviews(): ProductReview[] {
    try {
      const data = localStorage.getItem(REVIEWS_KEY);
      if (!data) {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
        return INITIAL_REVIEWS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  saveReviews(reviews: ProductReview[]): void {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  },

  getProductReviews(serviceId: string): ProductReview[] {
    const all = this.getReviews();
    return all.filter((r) => r.serviceId === serviceId);
  },

  getProductRating(serviceId: string): { avg: number; count: number } {
    const reviews = this.getProductReviews(serviceId);
    if (reviews.length === 0) {
      // Default high rating baseline for display if no user review yet
      return { avg: 5.0, count: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: Number((sum / reviews.length).toFixed(1)),
      count: reviews.length,
    };
  },

  addReview(review: Omit<ProductReview, 'id' | 'date'>): ProductReview {
    const current = this.getReviews();
    const newRev: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newRev, ...current];
    this.saveReviews(updated);
    return newRev;
  },

  // -------------------------------------------------------------
  // DEPOIMENTOS GERAIS DE CLIENTES
  // -------------------------------------------------------------
  getTestimonials(): Testimonial[] {
    try {
      const data = localStorage.getItem(TESTIMONIALS_KEY);
      if (!data) {
        localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
        return INITIAL_TESTIMONIALS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  },

  saveTestimonials(testimonials: Testimonial[]): void {
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials));
  },

  addTestimonial(testimonial: Omit<Testimonial, 'id' | 'date'>): Testimonial {
    const current = this.getTestimonials();
    const newTest: Testimonial = {
      ...testimonial,
      id: `test-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    };
    const updated = [newTest, ...current];
    this.saveTestimonials(updated);
    return newTest;
  },

  // -------------------------------------------------------------
  // LEMBRETES AUTOMÁTICOS WHATSAPP (24 HORAS ANTES)
  // -------------------------------------------------------------
  generateReminderMessage(booking: Booking, salon: SalonInfo): string {
    const template = salon.reminderTemplate || DEFAULT_REMINDER_TEMPLATE;
    const [year, month, day] = booking.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const formattedPrice = booking.servicePrice.toFixed(2).replace('.', ',');

    return template
      .replace(/{cliente}/g, booking.clientName.trim())
      .replace(/{servico}/g, booking.serviceName)
      .replace(/{data}/g, formattedDate)
      .replace(/{horario}/g, booking.time)
      .replace(/{valor}/g, formattedPrice)
      .replace(/{salao}/g, salon.name)
      .replace(/{endereco}/g, `${salon.city} - ${salon.state}`)
      .replace(/{whatsapp}/g, salon.bookingWhatsapp);
  },

  getUpcomingBookingsForReminder(hoursWindow = 48): { booking: Booking; isTomorrow: boolean; isToday: boolean }[] {
    const bookings = this.getBookings();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(Date.now() + 86400000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return bookings
      .filter((b) => (b.status === 'Confirmado' || b.status === 'Pendente') && (b.date === tomorrowStr || b.date === todayStr))
      .map((b) => ({
        booking: b,
        isTomorrow: b.date === tomorrowStr,
        isToday: b.date === todayStr,
      }));
  },

  // -------------------------------------------------------------
  // REGISTROS FINANCEIROS (FLUXO DE CAIXA E VENDAS)
  // -------------------------------------------------------------
  getFinancialRecords(): FinancialRecord[] {
    try {
      const data = localStorage.getItem(FINANCIAL_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveFinancialRecords(records: FinancialRecord[]): void {
    localStorage.setItem(FINANCIAL_KEY, JSON.stringify(records));
  },

  addFinancialRecord(record: Omit<FinancialRecord, 'id' | 'createdAt'>): FinancialRecord {
    const records = this.getFinancialRecords();
    const newRecord: FinancialRecord = {
      ...record,
      id: `fin-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...records];
    this.saveFinancialRecords(updated);
    return newRecord;
  },

  updateFinancialRecord(id: string, updates: Partial<FinancialRecord>): FinancialRecord[] {
    const records = this.getFinancialRecords();
    const updated = records.map((r) => (r.id === id ? { ...r, ...updates } : r));
    this.saveFinancialRecords(updated);
    return updated;
  },

  deleteFinancialRecord(id: string): FinancialRecord[] {
    const records = this.getFinancialRecords();
    const updated = records.filter((r) => r.id !== id);
    this.saveFinancialRecords(updated);
    return updated;
  },

  formatOperationType(type: FinancialOperationType | string): string {
    switch (type) {
      case 'recebimento_servico':
        return 'Recebimento de Serviço';
      case 'sinal_reserva':
        return 'Sinal / Adiantamento';
      case 'venda_produto':
        return 'Venda de Produto / Cuidados';
      case 'taxa_adicional':
        return 'Taxa Adicional / Manutenção';
      default:
        return type;
    }
  },
};
