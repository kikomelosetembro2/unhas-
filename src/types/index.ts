export interface NailService {
  id: string;
  name: string;
  category: 'Encapsulada' | 'Francesinha' | 'Mão Livre' | 'Mármore' | 'Degradê' | '3D & Pedraria' | 'Efeitos';
  price: number;
  duration: string; // e.g. "1h30min"
  durationMinutes: number;
  description: string;
  imageUrl: string;
  available: boolean;
  featured?: boolean;
}

export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito';

export interface Booking {
  id: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  paymentMethod: PaymentMethod;
  needChange?: boolean;
  changeFor?: number;
  changeAmount?: number;
  status: 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado';
  attendantName?: string; // e.g. 'Bárbara Designer' | 'Karla Designer'
}

export type FinancialOperationType = 
  | 'recebimento_servico' 
  | 'sinal_reserva' 
  | 'venda_produto' 
  | 'taxa_adicional';

export interface FinancialRecord {
  id: string;
  createdAt: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  attendantName: string; // Nome da atendente responsável
  clientName: string;
  clientPhone?: string;
  operationType: FinancialOperationType;
  serviceOrDescription: string;
  paymentMethod: PaymentMethod;
  grossAmount: number; // Valor bruto da operação
  changeAmount: number; // Troco devolvido (se dinheiro)
  netAmount: number; // Valor líquido recebido em caixa
  status: 'Recebido' | 'Pendente' | 'Estornado';
  bookingId?: string;
  notes?: string;
}

export interface ProductReview {
  id: string;
  serviceId: string;
  clientName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // YYYY-MM-DD
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientCity: string;
  serviceName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface SalonInfo {
  name: string;
  niche: string;
  city: string;
  state: string;
  phones: string[];
  bookingWhatsapp: string;
  rawWhatsappNumber: string; // 5568992827744
  address: string;
  pixKey: string;
  pixReceiver: string;
  openingHours: string;
  autoReminderEnabled?: boolean;
  reminderTemplate?: string;
  reminderHoursBefore?: number;
}

export interface LoyaltyHistoryItem {
  id: string;
  date: string;
  serviceName: string;
  description: string;
  pointsChange: number;
}

export interface LoyaltyClient {
  id: string;
  phone: string; // unmasked digits, e.g. 68992827744
  formattedPhone: string;
  name: string;
  points: number; // 0 to 5
  totalCompletedAppointments: number;
  rewardsClaimed: number;
  lastVisit: string;
  history: LoyaltyHistoryItem[];
}
