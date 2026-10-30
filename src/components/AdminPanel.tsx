import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Calendar,
  Search,
  RefreshCw,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Award,
  Gift,
  Upload,
  Image as ImageIcon,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Share2,
  TrendingUp,
  DollarSign,
  BarChart3,
  Flame,
  Download,
  Tag,
  Crown,
  Coins,
  CreditCard,
  Banknote,
  QrCode,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { NailService, Booking, SalonInfo, LoyaltyClient } from '../types';
import { StorageService } from '../services/storage';
import { DEFAULT_REMINDER_TEMPLATE } from '../data/initialProducts';

interface AdminPanelProps {
  products: NailService[];
  onUpdateProducts: (newProducts: NailService[]) => void;
  bookings: Booking[];
  onUpdateBookings: (newBookings: Booking[]) => void;
  salon: SalonInfo;
  onUpdateSalon: (newSalon: SalonInfo) => void;
  onCloseAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onUpdateProducts,
  bookings,
  onUpdateBookings,
  salon,
  onUpdateSalon,
  onCloseAdmin,
}) => {
  // Navigation Sub-Tabs
  const [subTab, setSubTab] = useState<
    'dashboard' | 'ranking' | 'products' | 'bookings' | 'loyalty' | 'settings'
  >('dashboard');

  // Bookings & Financial Date Filter
  const [financialDateFilter, setFinancialDateFilter] = useState<'todos' | 'hoje' | 'semana' | 'mes'>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [dateFilter, setDateFilter] = useState<'todos' | 'hoje' | 'semana' | 'mes'>('todos');
  const [bookingSearch, setBookingSearch] = useState<string>('');

  // Loyalty Program State
  const [loyaltyClients, setLoyaltyClients] = useState<LoyaltyClient[]>(() =>
    StorageService.getLoyaltyClients()
  );
  const [loyaltySearch, setLoyaltySearch] = useState<string>('');

  // Product CRUD states
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('Todas');
  const [productSearch, setProductSearch] = useState<string>('');
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick Price Edit Modal State
  const [quickPriceProduct, setQuickPriceProduct] = useState<NailService | null>(null);
  const [quickPriceInput, setQuickPriceInput] = useState<string>('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  const [productForm, setProductForm] = useState<{
    name: string;
    category: NailService['category'];
    price: string;
    duration: string;
    durationMinutes: number;
    description: string;
    imageUrl: string;
    available: boolean;
  }>({
    name: '',
    category: 'Mão Livre',
    price: '',
    duration: '1h20min',
    durationMinutes: 80,
    description: '',
    imageUrl: '/src/assets/images/hero_bk_nails_1793339141928.jpg',
    available: true,
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState<SalonInfo>(salon);
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // -------------------------------------------------------------
  // 1. FINANCIAL DASHBOARD METRICS (Com serviços vendidos concluídos)
  // -------------------------------------------------------------
  const financialData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Filter bookings by date selection for the financial dashboard
    const scopedBookings = bookings.filter((b) => {
      if (financialDateFilter === 'hoje' && b.date !== today) return false;
      if (financialDateFilter === 'semana') {
        const bDate = new Date(b.date);
        const diffDays = Math.abs(now.getTime() - bDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      }
      if (financialDateFilter === 'mes') {
        const bDate = new Date(b.date);
        if (bDate.getMonth() !== now.getMonth() || bDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }
      return true;
    });

    // Concluídos = Serviços Vendidos com sucesso
    const completedSales = scopedBookings.filter((b) => b.status === 'Concluído');
    const totalCompletedRevenue = completedSales.reduce((acc, b) => acc + b.servicePrice, 0);
    const completedCount = completedSales.length;
    const avgCompletedTicket = completedCount > 0 ? totalCompletedRevenue / completedCount : 0;

    // A receber = Pendentes ou Confirmados
    const pendingSales = scopedBookings.filter((b) => b.status === 'Pendente' || b.status === 'Confirmado');
    const totalPendingRevenue = pendingSales.reduce((acc, b) => acc + b.servicePrice, 0);

    // Cancelados
    const cancelledCount = scopedBookings.filter((b) => b.status === 'Cancelado').length;

    // Métodos de pagamento dos concluídos
    const cashSales = completedSales.filter((b) => b.paymentMethod === 'dinheiro');
    const cashTotal = cashSales.reduce((acc, b) => acc + b.servicePrice, 0);
    const cashTotalChange = cashSales.reduce((acc, b) => acc + (b.changeAmount || 0), 0);

    const pixSales = completedSales.filter((b) => b.paymentMethod === 'pix');
    const pixTotal = pixSales.reduce((acc, b) => acc + b.servicePrice, 0);

    const creditSales = completedSales.filter((b) => b.paymentMethod === 'cartao_credito');
    const creditTotal = creditSales.reduce((acc, b) => acc + b.servicePrice, 0);

    const debitSales = completedSales.filter((b) => b.paymentMethod === 'cartao_debito');
    const debitTotal = debitSales.reduce((acc, b) => acc + b.servicePrice, 0);

    return {
      scopedBookings,
      completedSales,
      totalCompletedRevenue,
      completedCount,
      avgCompletedTicket,
      totalPendingRevenue,
      pendingCount: pendingSales.length,
      cancelledCount,
      totalOverallRevenue: totalCompletedRevenue + totalPendingRevenue,
      paymentBreakdown: {
        pix: { count: pixSales.length, total: pixTotal, pct: totalCompletedRevenue ? (pixTotal / totalCompletedRevenue) * 100 : 0 },
        cash: { count: cashSales.length, total: cashTotal, changeGiven: cashTotalChange, pct: totalCompletedRevenue ? (cashTotal / totalCompletedRevenue) * 100 : 0 },
        credit: { count: creditSales.length, total: creditTotal, pct: totalCompletedRevenue ? (creditTotal / totalCompletedRevenue) * 100 : 0 },
        debit: { count: debitSales.length, total: debitTotal, pct: totalCompletedRevenue ? (debitTotal / totalCompletedRevenue) * 100 : 0 },
      },
    };
  }, [bookings, financialDateFilter]);

  // -------------------------------------------------------------
  // 2. RANKING DOS SERVIÇOS MAIS SOLICITADOS NO AGENDAMENTO
  // -------------------------------------------------------------
  const mostRequestedRanking = useMemo(() => {
    const totalBookingsCount = bookings.length || 1;

    // Aggregate counts and revenue per service
    const statsMap: Record<
      string,
      {
        serviceId: string;
        serviceName: string;
        category: string;
        imageUrl: string;
        currentPrice: number;
        totalRequests: number;
        completedRequests: number;
        totalRevenueGenerated: number;
        available: boolean;
      }
    > = {};

    // Seed map with all current products so even products with 0 requests appear or have context
    products.forEach((p) => {
      statsMap[p.id] = {
        serviceId: p.id,
        serviceName: p.name,
        category: p.category,
        imageUrl: p.imageUrl,
        currentPrice: p.price,
        totalRequests: 0,
        completedRequests: 0,
        totalRevenueGenerated: 0,
        available: p.available,
      };
    });

    // Populate from actual bookings
    bookings.forEach((b) => {
      // Find matching product by id or name
      const matched = products.find((p) => p.id === b.serviceId || p.name.toLowerCase() === b.serviceName.toLowerCase());
      const key = matched ? matched.id : b.serviceId;

      if (!statsMap[key]) {
        statsMap[key] = {
          serviceId: b.serviceId,
          serviceName: b.serviceName,
          category: 'Nail Art',
          imageUrl: '/src/assets/images/hero_bk_nails_1793339141928.jpg',
          currentPrice: b.servicePrice,
          totalRequests: 0,
          completedRequests: 0,
          totalRevenueGenerated: 0,
          available: true,
        };
      }

      statsMap[key].totalRequests += 1;
      if (b.status === 'Concluído') {
        statsMap[key].completedRequests += 1;
        statsMap[key].totalRevenueGenerated += b.servicePrice;
      }
    });

    // Sort descending by total requests, then revenue
    return Object.values(statsMap)
      .sort((a, b) => {
        if (b.totalRequests !== a.totalRequests) {
          return b.totalRequests - a.totalRequests;
        }
        return b.totalRevenueGenerated - a.totalRevenueGenerated;
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        sharePercentage: (item.totalRequests / totalBookingsCount) * 100,
      }));
  }, [bookings, products]);

  // -------------------------------------------------------------
  // 3. BOOKINGS FILTERING (Agenda view)
  // -------------------------------------------------------------
  const filteredBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    return bookings.filter((b) => {
      if (statusFilter !== 'Todos' && b.status !== statusFilter) return false;
      if (dateFilter === 'hoje' && b.date !== today) return false;
      if (dateFilter === 'semana') {
        const bDate = new Date(b.date);
        const diffDays = Math.abs(now.getTime() - bDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      }
      if (dateFilter === 'mes') {
        const bDate = new Date(b.date);
        if (bDate.getMonth() !== now.getMonth() || bDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }
      if (bookingSearch.trim()) {
        const q = bookingSearch.toLowerCase();
        const matchName = b.clientName.toLowerCase().includes(q);
        const matchPhone = b.clientPhone.toLowerCase().includes(q);
        const matchService = b.serviceName.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchService) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, dateFilter, bookingSearch]);

  // Filtered Products for Catalog Management
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = productCategoryFilter === 'Todas' || p.category === productCategoryFilter;
      const matchSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, productCategoryFilter, productSearch]);

  // -------------------------------------------------------------
  // ACTIONS: BOOKINGS & STATUS
  // -------------------------------------------------------------
  const handleStatusChange = (id: string, newStatus: Booking['status']) => {
    const updated = StorageService.updateBookingStatus(id, newStatus);
    onUpdateBookings(updated);
    setLoyaltyClients(StorageService.getLoyaltyClients());
    showToast(`Status atualizado para: ${newStatus}`);
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento do histórico?')) {
      const updated = StorageService.deleteBooking(id);
      onUpdateBookings(updated);
      showToast('Agendamento excluído com sucesso.');
    }
  };

  // WhatsApp to Salon (Comprovante Oficial para (68) 98118-0360)
  const handleForwardToSalonWhatsApp = (booking: Booking) => {
    const msg = StorageService.generateWhatsAppMessage({
      id: booking.id,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      serviceName: booking.serviceName,
      date: booking.date,
      time: booking.time,
      servicePrice: booking.servicePrice,
      paymentMethod: booking.paymentMethod,
      needChange: booking.needChange,
      changeFor: booking.changeFor,
      changeAmount: booking.changeAmount,
      notes: booking.notes,
    });
    const salonNumber = salon.rawWhatsappNumber || '5568981180360';
    const url = StorageService.buildWhatsAppLink(salonNumber, msg);
    window.open(url, '_blank');
    showToast(`Comprovante aberto para envio ao WhatsApp ${salon.bookingWhatsapp || '(68) 98118-0360'}!`);
  };

  // WhatsApp to Client
  const handleOpenClientWhatsApp = (booking: Booking) => {
    const cleanPhone = booking.clientPhone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    let text = '';
    if (booking.status === 'Concluído') {
      text = `Olá, ${booking.clientName}! Foi um prazer atender você no ateliê *B & K NAILS DESIGNER*. Esperamos que tenha amado suas pinturas artesanais de *${booking.serviceName}*! Seu ponto no Cartão Fidelidade já foi computado. Volte sempre! ✨💅`;
    } else {
      text = `Olá, ${booking.clientName}! Aqui é do ateliê *B & K NAILS DESIGNER* em Rio Branco. Confirmamos o seu agendamento de *${booking.serviceName}* para o dia *${booking.date.split('-').reverse().join('/')} às ${booking.time}*. Valor: R$ ${booking.servicePrice.toFixed(2).replace('.', ',')}. Te aguardamos com muito carinho! ✨💅`;
    }
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Export Sales Report to CSV
  const handleExportSalesCSV = () => {
    const sales = financialData.completedSales;
    if (sales.length === 0) {
      alert('Não há serviços concluídos no período selecionado para exportar.');
      return;
    }

    const headers = ['Código', 'Data', 'Horário', 'Cliente', 'WhatsApp', 'Serviço', 'Forma de Pagamento', 'Valor (R$)', 'Troco Devolvido (R$)'];
    const rows = sales.map((s) => [
      s.id,
      s.date,
      s.time,
      `"${s.clientName.replace(/"/g, '""')}"`,
      s.clientPhone,
      `"${s.serviceName.replace(/"/g, '""')}"`,
      s.paymentMethod,
      s.servicePrice.toFixed(2),
      (s.changeAmount || 0).toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_vendas_bk_nails_${financialDateFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Relatório CSV baixado com sucesso!');
  };

  // -------------------------------------------------------------
  // ACTIONS: PRODUCTS CRUD & QUICK PRICE EDIT
  // -------------------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setUploadError('');
    setProductForm({
      name: '',
      category: 'Mão Livre',
      price: '',
      duration: '1h20min',
      durationMinutes: 80,
      description: '',
      imageUrl: '/src/assets/images/hero_bk_nails_1793339141928.jpg',
      available: true,
    });
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (prod: NailService) => {
    setEditingProductId(prod.id);
    setUploadError('');
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price.toString(),
      duration: prod.duration,
      durationMinutes: prod.durationMinutes,
      description: prod.description,
      imageUrl: prod.imageUrl,
      available: prod.available,
    });
    setIsEditingProduct(true);
  };

  // Handle local .jpg file selection from user device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploadingImage(true);

    try {
      const jpgDataUrl = await StorageService.processLocalJpgFile(file);
      setProductForm((prev) => ({
        ...prev,
        imageUrl: jpgDataUrl,
      }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Falha ao carregar imagem local.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) return;

    const parsedPrice = parseFloat(productForm.price.replace(',', '.')) || 0;

    let updatedList: NailService[];
    if (editingProductId) {
      updatedList = products.map((p) =>
        p.id === editingProductId
          ? {
              ...p,
              name: productForm.name.trim(),
              category: productForm.category,
              price: parsedPrice,
              duration: productForm.duration,
              durationMinutes: productForm.durationMinutes || 60,
              description: productForm.description.trim(),
              imageUrl: productForm.imageUrl,
              available: productForm.available,
            }
          : p
      );
      showToast('Produto atualizado com sucesso!');
    } else {
      const newProd: NailService = {
        id: `prod-${Date.now()}`,
        name: productForm.name.trim(),
        category: productForm.category,
        price: parsedPrice,
        duration: productForm.duration,
        durationMinutes: productForm.durationMinutes || 60,
        description: productForm.description.trim(),
        imageUrl: productForm.imageUrl,
        available: productForm.available,
      };
      updatedList = [newProd, ...products];
      showToast('Novo produto cadastrado com sucesso!');
    }

    StorageService.saveProducts(updatedList);
    onUpdateProducts(updatedList);
    setIsEditingProduct(false);
  };

  const handleDeleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (confirm(`Tem certeza que deseja excluir "${target?.name || 'este produto'}" do catálogo?`)) {
      const updated = products.filter((p) => p.id !== id);
      StorageService.saveProducts(updated);
      onUpdateProducts(updated);
      showToast('Produto removido do catálogo.');
    }
  };

  const handleToggleProductAvailability = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, available: !p.available } : p));
    StorageService.saveProducts(updated);
    onUpdateProducts(updated);
  };

  const handleResetCatalog = () => {
    if (confirm('Deseja restaurar o catálogo para as 10 pinturas artesanais originais?')) {
      const reset = StorageService.resetProducts();
      onUpdateProducts(reset);
      showToast('Catálogo padrão restaurado!');
    }
  };

  // Quick Price Alteration Handler
  const handleOpenQuickPriceModal = (prod: NailService) => {
    setQuickPriceProduct(prod);
    setQuickPriceInput(prod.price.toString());
  };

  const handleSaveQuickPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceProduct) return;

    const parsed = parseFloat(quickPriceInput.replace(',', '.')) || 0;
    if (parsed <= 0) {
      alert('Por favor, informe um preço válido maior que zero.');
      return;
    }

    const updated = products.map((p) => (p.id === quickPriceProduct.id ? { ...p, price: parsed } : p));
    StorageService.saveProducts(updated);
    onUpdateProducts(updated);
    setQuickPriceProduct(null);
    showToast(`Preço de "${quickPriceProduct.name}" atualizado para R$ ${parsed.toFixed(2).replace('.', ',')}!`);
  };

  // Quick Price Delta Adjusters
  const adjustQuickPrice = (delta: number) => {
    const current = parseFloat(quickPriceInput.replace(',', '.')) || 0;
    const newVal = Math.max(10, current + delta);
    setQuickPriceInput(newVal.toFixed(2).replace('.', ','));
  };

  // -------------------------------------------------------------
  // ACTIONS: LOYALTY & SETTINGS
  // -------------------------------------------------------------
  const handleAddManualPoint = (phone: string, clientName: string) => {
    StorageService.addLoyaltyPoint(phone, clientName, 'Ponto manual adicionado pela Designer');
    setLoyaltyClients(StorageService.getLoyaltyClients());
    showToast(`+1 Ponto concedido para ${clientName}!`);
  };

  const handleRedeemReward = (client: LoyaltyClient) => {
    if (
      confirm(
        `Confirmar resgate da recompensa de 5 pontos para ${client.name}? O saldo será reiniciado para 0 para o próximo ciclo de 5 pontos.`
      )
    ) {
      StorageService.redeemReward(client.phone);
      setLoyaltyClients(StorageService.getLoyaltyClients());
      showToast(`Recompensa resgatada para ${client.name}!`);
    }
  };

  const handleSendLoyaltyWhatsApp = (client: LoyaltyClient) => {
    const clean = client.phone.startsWith('55') ? client.phone : `55${client.phone}`;
    let text = '';
    const salonPhoneDisplay = salon.bookingWhatsapp || '(68) 98118-0360';
    if (client.points >= 5) {
      text = `🎉 Parabéns, ${client.name}! Você completou *5 atendimentos* no *B & K NAILS DESIGNER* e seu *Cartão Fidelidade* está com a recompensa liberada! Agende seu horário pelo WhatsApp ${salonPhoneDisplay} e venha resgatar seu prêmio de cortesia! 💅✨`;
    } else {
      text = `Olá, ${client.name}! Seu saldo no *Cartão Fidelidade B & K Nails* é de *${client.points}/5 pontos*. Faltam apenas *${5 - client.points} atendimento(s)* para você ganhar sua recompensa exclusiva! Te esperamos em breve em Rio Branco. 💖`;
    }
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = settingsForm.bookingWhatsapp.replace(/\D/g, '');
    const updatedInfo: SalonInfo = {
      ...settingsForm,
      rawWhatsappNumber: cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`,
      pixKey: settingsForm.pixKey || cleanDigits,
    };
    StorageService.saveSalonInfo(updatedInfo);
    onUpdateSalon(updatedInfo);
    setSettingsForm(updatedInfo);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
    showToast('Configurações salvas!');
  };

  const handleResetReminderTemplate = () => {
    setSettingsForm((prev) => ({
      ...prev,
      reminderTemplate: DEFAULT_REMINDER_TEMPLATE,
    }));
    showToast('Template restaurado para o padrão oficial!');
  };

  const insertReminderTag = (tag: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      reminderTemplate: (prev.reminderTemplate || DEFAULT_REMINDER_TEMPLATE) + ` ${tag}`,
    }));
  };

  const handleSendReminderForBooking = (booking: Booking) => {
    const reminderMsg = StorageService.generateReminderMessage(booking, settingsForm);
    const link = StorageService.buildWhatsAppLink(booking.clientPhone, reminderMsg);
    window.open(link, '_blank');
    showToast(`Lembrete WhatsApp aberto para ${booking.clientName}!`);
  };

  const upcomingReminders = useMemo(() => {
    return StorageService.getUpcomingBookingsForReminder(settingsForm.reminderHoursBefore || 24);
  }, [bookings, settingsForm.reminderHoursBefore]);

  const sampleReminderText = useMemo(() => {
    const sampleBooking: Booking = {
      id: 'BK-EXEMPLO',
      createdAt: new Date().toISOString(),
      clientName: 'Amanda Silveira',
      clientPhone: '68981180360',
      serviceId: 'prod-1',
      serviceName: 'Unha Encapsulada com Flores Secas',
      servicePrice: 120,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '14:30',
      paymentMethod: 'dinheiro',
      status: 'Confirmado',
    };
    return StorageService.generateReminderMessage(sampleBooking, settingsForm);
  }, [settingsForm]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-stone-950 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-4 duration-300 border border-stone-800">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Top Banner & Header of Admin */}
      <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white text-[11px] font-bold tracking-wider uppercase">
                Área da Designer & Gestão
              </span>
              <span className="text-xs text-stone-400">Rio Branco - Acre</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Painel Administrativo B & K Nails Designer
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
              Dashboard financeiro com vendas concluídas, ranking dos serviços mais agendados, CRUD completo de produtos, alteração rápida de preços e relatórios.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCloseAdmin}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Voltar ao Catálogo</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-800 overflow-x-auto no-scrollbar">
          {/* TAB 1: DASHBOARD FINANCEIRO */}
          <button
            onClick={() => setSubTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'dashboard'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Dashboard Financeiro</span>
            <span className="px-1.5 py-0.5 rounded-md bg-stone-900 text-emerald-400 text-[10px] font-mono font-bold">
              R$ {financialData.totalCompletedRevenue.toFixed(0)}
            </span>
          </button>

          {/* TAB 2: MAIS SOLICITADOS / RANKING */}
          <button
            onClick={() => setSubTab('ranking')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'ranking'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Mais Solicitados</span>
            <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-300 text-[10px] flex items-center justify-center font-bold">
              {mostRequestedRanking.length}
            </span>
          </button>

          {/* TAB 3: GESTÃO DE PRODUTOS & PREÇOS (CRUD) */}
          <button
            onClick={() => setSubTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'products'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Produtos & Preços (CRUD)</span>
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
              {products.length}
            </span>
          </button>

          {/* TAB 4: AGENDAMENTOS */}
          <button
            onClick={() => setSubTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'bookings'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agendamentos</span>
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">
              {bookings.length}
            </span>
          </button>

          {/* TAB 5: FIDELIDADE */}
          <button
            onClick={() => setSubTab('loyalty')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'loyalty'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Award className="w-4 h-4 text-pink-400" />
            <span>Cartão Fidelidade</span>
          </button>

          {/* TAB 6: CONFIGURAÇÕES & LEMBRETES */}
          <button
            onClick={() => setSubTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              subTab === 'settings'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Configurações & Lembretes</span>
            {upcomingReminders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {upcomingReminders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. DASHBOARD FINANCEIRO (SERVIÇOS VENDIDOS CONCLUÍDOS)     */}
      {/* ========================================================= */}
      {subTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header & Date Filter Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
                Relatório de Vendas Realizadas
              </span>
              <h3 className="font-serif text-xl font-bold text-black">
                Faturamento e Serviços Concluídos
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Filter */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
                {(['todos', 'hoje', 'semana', 'mes'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setFinancialDateFilter(filterKey)}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                      financialDateFilter === filterKey
                        ? 'bg-stone-950 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {filterKey === 'todos' ? 'Todo o Período' : filterKey === 'hoje' ? 'Hoje' : filterKey === 'semana' ? 'Esta Semana' : 'Este Mês'}
                  </button>
                ))}
              </div>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleExportSalesCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                title="Exportar planilha CSV com todos serviços concluídos"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* 4 Financial Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Faturamento Realizado (Caixa) */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white p-5 rounded-2xl border-2 border-emerald-500/30 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Vendas Concluídas (Caixa)
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="font-serif text-3xl font-black text-emerald-700 tabular-nums">
                  R$ {financialData.totalCompletedRevenue.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Total já pago de <b>{financialData.completedCount}</b> atendimentos concluídos
              </p>
            </div>

            {/* Card 2: A Receber (Confirmados / Pendentes) */}
            <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  A Receber (Agendados)
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="font-serif text-3xl font-black text-stone-900 tabular-nums">
                  R$ {financialData.totalPendingRevenue.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                <b>{financialData.pendingCount}</b> agendamentos pendentes ou confirmados
              </p>
            </div>

            {/* Card 3: Ticket Médio por Venda */}
            <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Ticket Médio Concluído
                </span>
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="font-serif text-3xl font-black text-pink-600 tabular-nums">
                  R$ {financialData.avgCompletedTicket.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Média gasta por cliente nas vendas finalizadas
              </p>
            </div>

            {/* Card 4: Previsão Total Geral */}
            <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Faturamento Previsto Total
                </span>
                <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="font-serif text-3xl font-black text-black tabular-nums">
                  R$ {financialData.totalOverallRevenue.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Soma de todos os agendamentos ativos no período
              </p>
            </div>
          </div>

          {/* Payment Methods Breakdown for Completed Sales */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-black">
                  Formas de Pagamento Recebidas (Vendas Concluídas)
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Distribuição real de como as clientes pagaram os serviços finalizados.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                100% Conciliado
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* PIX */}
              <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-pink-600" /> PIX
                  </span>
                  <span className="text-[11px] font-bold text-pink-700 font-mono">
                    {financialData.paymentBreakdown.pix.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-serif text-xl font-bold text-pink-600 tabular-nums">
                    R$ {financialData.paymentBreakdown.pix.total.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {financialData.paymentBreakdown.pix.count} atendimentos
                  </span>
                </div>
              </div>

              {/* DINHEIRO */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" /> Dinheiro em Espécie
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 font-mono">
                    {financialData.paymentBreakdown.cash.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-serif text-xl font-bold text-emerald-700 tabular-nums">
                    R$ {financialData.paymentBreakdown.cash.total.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {financialData.paymentBreakdown.cash.count} atendimentos (Trocos: R$ {financialData.paymentBreakdown.cash.changeGiven.toFixed(2).replace('.', ',')})
                  </span>
                </div>
              </div>

              {/* CARTÃO CRÉDITO */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-stone-800" /> Cartão de Crédito
                  </span>
                  <span className="text-[11px] font-bold text-stone-700 font-mono">
                    {financialData.paymentBreakdown.credit.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-serif text-xl font-bold text-stone-900 tabular-nums">
                    R$ {financialData.paymentBreakdown.credit.total.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {financialData.paymentBreakdown.credit.count} atendimentos
                  </span>
                </div>
              </div>

              {/* CARTÃO DÉBITO */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-stone-600" /> Cartão de Débito
                  </span>
                  <span className="text-[11px] font-bold text-stone-700 font-mono">
                    {financialData.paymentBreakdown.debit.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-serif text-xl font-bold text-stone-900 tabular-nums">
                    R$ {financialData.paymentBreakdown.debit.total.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {financialData.paymentBreakdown.debit.count} atendimentos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE: TODOS OS SERVIÇOS VENDIDOS E CONCLUÍDOS */}
          <div className="bg-white rounded-3xl border border-pink-100 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50/50">
              <div>
                <h4 className="font-serif text-lg font-bold text-black flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Extrato de Todos os Serviços Vendidos & Concluídos
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Lista detalhada de atendimentos finalizados com sucesso com valor recebido e troco.
                </p>
              </div>

              <span className="px-3 py-1 bg-white border border-stone-200 text-stone-700 text-xs font-bold rounded-xl">
                {financialData.completedSales.length} serviços finalizados
              </span>
            </div>

            {financialData.completedSales.length === 0 ? (
              <div className="text-center py-12 p-6">
                <DollarSign className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h5 className="font-serif text-base font-bold text-stone-800">
                  Nenhum serviço concluído neste período
                </h5>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Marque agendamentos como "Concluído" na aba Agendamentos para que eles apareçam aqui neste extrato de vendas.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Data / Hora</th>
                      <th className="py-3 px-4">Cliente / Contato</th>
                      <th className="py-3 px-4">Arte / Serviço Vendido</th>
                      <th className="py-3 px-4">Forma de Pagamento</th>
                      <th className="py-3 px-4">Valor Pago</th>
                      <th className="py-3 px-4">Troco</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Contato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {financialData.completedSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-emerald-50/20 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-stone-900 block">
                            {sale.date.split('-').reverse().join('/')}
                          </span>
                          <span className="text-[11px] text-stone-500">{sale.time}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-black block">{sale.clientName}</span>
                          <span className="font-mono text-[11px] text-stone-500">{sale.clientPhone}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-900 block">{sale.serviceName}</span>
                          <span className="text-[10px] text-stone-400">Cód: #{sale.id}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-semibold text-stone-800">
                            {sale.paymentMethod === 'dinheiro' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                            {sale.paymentMethod === 'pix' && <QrCode className="w-3.5 h-3.5 text-pink-600" />}
                            {sale.paymentMethod.startsWith('cartao') && <CreditCard className="w-3.5 h-3.5 text-stone-700" />}
                            {StorageService.formatPaymentMethod(sale.paymentMethod)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-bold text-emerald-700">
                            R$ {sale.servicePrice.toFixed(2).replace('.', ',')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-stone-600">
                          {sale.changeAmount && sale.changeAmount > 0 ? (
                            <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              R$ {sale.changeAmount.toFixed(2).replace('.', ',')}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Sem troco</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            <CheckCircle className="w-3 h-3" /> Concluído
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenClientWhatsApp(sale)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Agradecer no WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. RANKING DOS MAIS SOLICITADOS NO AGENDAMENTO            */}
      {/* ========================================================= */}
      {subTab === 'ranking' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
                Inteligência de Vendas
              </span>
              <h3 className="font-serif text-2xl font-bold text-black flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-500" />
                Unhas e Artes Mais Solicitadas pelos Clientes
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Classificação em tempo real baseada nos agendamentos registrados no ateliê em Rio Branco.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-xl">
                Total de Agendamentos: {bookings.length}
              </span>
            </div>
          </div>

          {/* Ranking Cards */}
          <div className="grid grid-cols-1 gap-4">
            {mostRequestedRanking.map((item) => {
              const isTop1 = item.rank === 1;
              const isTop2 = item.rank === 2;
              const isTop3 = item.rank === 3;

              return (
                <div
                  key={item.serviceId}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                    isTop1
                      ? 'border-2 border-amber-400 bg-amber-50/20 shadow-md'
                      : isTop2
                      ? 'border-2 border-stone-300 shadow-2xs'
                      : isTop3
                      ? 'border-2 border-amber-700/30 shadow-2xs'
                      : 'border-stone-200 shadow-2xs'
                  }`}
                >
                  {/* Left: Medal, Thumbnail, Title & Category */}
                  <div className="flex items-center gap-4">
                    {/* Position Badge */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                        isTop1
                          ? 'bg-amber-400 text-stone-950 font-sans text-base'
                          : isTop2
                          ? 'bg-stone-200 text-stone-800'
                          : isTop3
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${item.rank}`}
                    </div>

                    {/* Image */}
                    <img
                      src={item.imageUrl}
                      alt={item.serviceName}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        {isTop1 && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Flame className="w-3 h-3 text-red-600 fill-red-600" /> Campeão de Vendas
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-lg font-bold text-black mt-1 leading-tight">
                        {item.serviceName}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span>Preço atual: <b className="text-pink-600 font-sans">R$ {item.currentPrice.toFixed(2).replace('.', ',')}</b></span>
                        <span>•</span>
                        <span>{item.available ? 'Disponível no site' : 'Pausado'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stats, Progress Bar, and Quick Actions */}
                  <div className="w-full md:w-auto flex flex-col md:items-end gap-2 shrink-0">
                    {/* Stat Figures */}
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                          Agendamentos
                        </span>
                        <span className="font-mono text-xl font-bold text-stone-900">
                          {item.totalRequests}
                        </span>
                      </div>

                      <div className="border-l border-stone-200 pl-4">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                          Vendas Concluídas
                        </span>
                        <span className="font-mono text-xl font-bold text-emerald-700">
                          {item.completedRequests}
                        </span>
                      </div>

                      <div className="border-l border-stone-200 pl-4">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                          Faturamento Gerado
                        </span>
                        <span className="font-mono text-xl font-bold text-pink-600">
                          R$ {item.totalRevenueGenerated.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* Popularity Progress Bar */}
                    <div className="w-full md:w-64 mt-1">
                      <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                        <span>Participação total:</span>
                        <span className="font-bold text-stone-800">{item.sharePercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTop1 ? 'bg-amber-500' : 'bg-pink-600'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(5, item.sharePercentage))}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Button: Change Price directly from ranking */}
                    {products.find((p) => p.id === item.serviceId) && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const found = products.find((p) => p.id === item.serviceId);
                            if (found) handleOpenQuickPriceModal(found);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Tag className="w-3.5 h-3.5 text-pink-600" />
                          <span>Alterar Preço Rápido</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. GESTÃO DE PRODUTOS & PREÇOS (CRUD COMPLETO)            */}
      {/* ========================================================= */}
      {subTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header & Controls */}
          <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
                Catálogo de Artes Manuais
              </span>
              <h3 className="font-serif text-2xl font-bold text-black">
                Cadastro, Edição, Exclusão & Preços
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Gerencie todos os modelos de pinturas artesanais, fotos em .JPG e valores em tempo real.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleResetCatalog}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-pink-400 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors bg-white shadow-2xs"
                title="Restaura os 10 modelos padrão"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                <span>Restaurar 10 Originais</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Inserir Novo Produto</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
              {['Todas', 'Encapsulada', 'Francesinha', 'Mão Livre', 'Mármore', 'Degradê', '3D & Pedraria', 'Efeitos'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProductCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    productCategoryFilter === cat
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar produto ou técnica..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-3xl border p-5 shadow-2xs flex flex-col justify-between transition-all group ${
                  p.available ? 'border-pink-200' : 'border-stone-200 opacity-60 bg-stone-50'
                }`}
              >
                <div>
                  <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 mb-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-950/80 text-white text-[10px] font-bold">
                      {p.category}
                    </div>

                    {!p.available && (
                      <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-white text-xs font-bold">
                        Pausado Temporariamente
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif font-black text-black text-lg leading-tight">
                      {p.name}
                    </h4>
                  </div>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" /> {p.duration}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-stone-700">
                      {p.available ? 'Ativo no site' : 'Pausado'}
                    </span>
                  </div>
                </div>

                {/* Price Display & Actions */}
                <div className="pt-4 mt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-3 bg-pink-50/70 p-2.5 rounded-xl border border-pink-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Preço de Venda</span>
                      <span className="text-lg font-black text-pink-600 font-sans tabular-nums">
                        R$ {p.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenQuickPriceModal(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                      title="Alterar preço rapidamente"
                    >
                      <Tag className="w-3 h-3" />
                      <span>Alterar Preço</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleProductAvailability(p.id)}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
                    >
                      {p.available ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-stone-400" /> Pausar
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" /> Reativar
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(p)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 hover:bg-stone-200 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Editar todos os dados do produto"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Excluir produto do catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. AGENDAMENTOS & AGENDA                                  */}
      {/* ========================================================= */}
      {subTab === 'bookings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['Todos', 'Pendente', 'Confirmado', 'Concluído', 'Cancelado'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-stone-950 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Date Range & Search */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setDateFilter('todos')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    dateFilter === 'todos' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'text-stone-500'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setDateFilter('hoje')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    dateFilter === 'hoje' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'text-stone-500'
                  }`}
                >
                  Hoje
                </button>
                <button
                  onClick={() => setDateFilter('semana')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    dateFilter === 'semana' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'text-stone-500'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setDateFilter('mes')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    dateFilter === 'mes' ? 'bg-white shadow-2xs text-stone-900 font-bold' : 'text-stone-500'
                  }`}
                >
                  Mês
                </button>
              </div>

              <div className="relative flex-1 md:w-60">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar cliente ou serviço..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-2xs">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 p-6">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h4 className="font-serif text-base font-bold text-stone-800">
                  Nenhum agendamento encontrado
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Não há agendamentos cadastrados com os filtros atuais.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Cliente / Contato</th>
                      <th className="py-3 px-4">Arte / Serviço</th>
                      <th className="py-3 px-4">Data & Horário</th>
                      <th className="py-3 px-4">Valor & Pagamento</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-pink-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{b.clientName}</div>
                          <div className="text-stone-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-pink-600" />
                            {b.clientPhone}
                          </div>
                          {b.notes && (
                            <div className="text-[10px] text-stone-400 italic mt-0.5 max-w-xs truncate">
                              Obs: {b.notes}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-900">{b.serviceName}</span>
                          <span className="text-[10px] text-stone-400 block font-mono">#{b.id}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-stone-900">
                            {b.date.split('-').reverse().join('/')}
                          </div>
                          <div className="text-stone-500 text-[11px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-pink-500" /> {b.time}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-pink-700 text-sm">
                            R$ {b.servicePrice.toFixed(2).replace('.', ',')}
                          </div>
                          <div className="text-[11px] text-stone-600 mt-0.5">
                            {StorageService.formatPaymentMethod(
                              b.paymentMethod,
                              b.needChange,
                              b.changeFor,
                              b.changeAmount
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as Booking['status'])}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border outline-hidden transition-all cursor-pointer ${
                              b.status === 'Confirmado'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : b.status === 'Concluído'
                                ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                                : b.status === 'Cancelado'
                                ? 'bg-red-50 text-red-700 border-red-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Concluído">Concluído (Venda)</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Fast Action: Mark as Concluded */}
                            {b.status !== 'Concluído' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(b.id, 'Concluído')}
                                className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-[11px] font-bold border border-emerald-200 transition-colors"
                                title="Concluir atendimento e somar no Caixa Financeiro"
                              >
                                Concluir Venda
                              </button>
                            )}

                            {/* Client WhatsApp */}
                            <button
                              type="button"
                              onClick={() => handleOpenClientWhatsApp(b)}
                              className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-600 hover:text-white transition-colors"
                              title="Mensagem para a cliente"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Forward to Salon */}
                            <button
                              type="button"
                              onClick={() => handleForwardToSalonWhatsApp(b)}
                              className="p-1.5 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white transition-colors"
                              title={`Reencaminhar para o WhatsApp do Salão (${salon.bookingWhatsapp || '(68) 98118-0360'})`}
                            >
                              <Share2 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg bg-stone-100 text-stone-400 hover:bg-red-600 hover:text-white transition-colors"
                              title="Excluir agendamento"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PROGRAMA FIDELIDADE & CARTÃO VIP                       */}
      {/* ========================================================= */}
      {subTab === 'loyalty' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
                Fidelização Exclusiva
              </span>
              <h3 className="font-serif text-2xl font-bold text-black flex items-center gap-2">
                <Award className="w-6 h-6 text-pink-600" />
                Cartão Fidelidade das Clientes (Meta de 5 Pontos)
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xl">
                A cada atendimento concluído, a cliente ganha 1 ponto. Ao atingir 5 pontos, ganha uma recompensa especial (esmaltação em gel, hidratação ou decoração de cortesia).
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente cadastrada..."
                value={loyaltySearch}
                onChange={(e) => setLoyaltySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden"
              />
            </div>
          </div>

          {/* Loyalty Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loyaltyClients
              .filter((c) =>
                loyaltySearch ? c.name.toLowerCase().includes(loyaltySearch.toLowerCase()) || c.phone.includes(loyaltySearch) : true
              )
              .map((client) => {
                const isReady = client.points >= 5;
                return (
                  <div
                    key={client.id}
                    className={`bg-white rounded-3xl p-5 border transition-all ${
                      isReady ? 'border-2 border-pink-500 shadow-md bg-pink-50/20' : 'border-stone-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-black">{client.name}</h4>
                        <span className="font-mono text-xs text-stone-500">{client.formattedPhone}</span>
                      </div>

                      {isReady ? (
                        <span className="px-3 py-1 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center gap-1 animate-pulse">
                          <Gift className="w-3.5 h-3.5" /> Prêmio Liberado!
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                          {client.points}/5 pontos
                        </span>
                      )}
                    </div>

                    {/* Visual 5-slots stamp bar */}
                    <div className="grid grid-cols-5 gap-2 my-4">
                      {[1, 2, 3, 4, 5].map((slot) => {
                        const filled = client.points >= slot;
                        return (
                          <div
                            key={slot}
                            className={`h-12 rounded-xl flex flex-col items-center justify-center border text-xs font-bold transition-all ${
                              filled
                                ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                                : 'bg-stone-50 text-stone-400 border-stone-200'
                            }`}
                          >
                            {filled ? <Sparkles className="w-4 h-4" /> : slot}
                            <span className="text-[9px] mt-0.5">{slot}º</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddManualPoint(client.phone, client.name)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold"
                        >
                          +1 Ponto
                        </button>
                        {isReady && (
                          <button
                            type="button"
                            onClick={() => handleRedeemReward(client)}
                            className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold"
                          >
                            Resgatar Prêmio
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSendLoyaltyWhatsApp(client)}
                        className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold"
                      >
                        <MessageCircle className="w-4 h-4" /> Avisar no WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. CONFIGURAÇÕES DO SALÃO & PREFERÊNCIAS DE LEMBRETES     */}
      {/* ========================================================= */}
      {subTab === 'settings' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Info Banner */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
                Configurações do Estabelecimento & Automações
              </span>
              <h3 className="font-serif text-2xl font-black text-black mt-0.5">
                Dados do Salão & Preferências de Lembretes WhatsApp
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                Configure os canais oficiais de agendamento em Rio Branco - AC e personalize a mensagem e envio de lembretes automáticos para as clientes 24 horas antes do atendimento.
              </p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold shrink-0">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Preferências salvas com sucesso!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* COLUMN 1: DADOS GERAIS DO SALÃO */}
            <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                <div className="w-9 h-9 rounded-xl bg-stone-950 text-white flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-black">
                    Dados do Salão & Contatos
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Telefones e chave PIX para recibos oficiais
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nome do Estabelecimento:
                  </label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    WhatsApp Principal para Recebimento de Agendamentos:
                  </label>
                  <input
                    type="text"
                    value={settingsForm.bookingWhatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bookingWhatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-mono font-semibold"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Padrão oficial cadastrado: (68) 98118-0360 (5568981180360)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Telefone de Atendimento 1:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phones[0] || ''}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          phones: [e.target.value, settingsForm.phones[1] || ''],
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Telefone de Atendimento 2:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phones[1] || ''}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          phones: [settingsForm.phones[0] || '', e.target.value],
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Localização / Cidade:
                    </label>
                    <input
                      type="text"
                      value={`${settingsForm.city} - ${settingsForm.state}`}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Chave PIX Oficial:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.pixKey}
                      onChange={(e) => setSettingsForm({ ...settingsForm, pixKey: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    Salvar Dados do Salão
                  </button>
                </div>
              </form>
            </div>

            {/* COLUMN 2: PAINEL DE PREFERÊNCIAS DE LEMBRETES WHATSAPP (24h) */}
            <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-black">
                      Lembretes Automáticos WhatsApp
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Disparo automático 24h antes do agendamento
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    settingsForm.autoReminderEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {settingsForm.autoReminderEnabled ? 'Ativo' : 'Desativado'}
                </span>
              </div>

              {/* Form Controls for Reminder Preferences */}
              <div className="space-y-4 text-xs sm:text-sm">
                {/* 1. Toggle switch */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-stone-900 block text-xs sm:text-sm">
                      Envio de Lembretes Automáticos
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                      Ativa a notificação de confirmação e lembrete para clientes com horários agendados.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={!!settingsForm.autoReminderEnabled}
                      onChange={(e) => {
                        const updated = { ...settingsForm, autoReminderEnabled: e.target.checked };
                        setSettingsForm(updated);
                        StorageService.saveSalonInfo(updated);
                        onUpdateSalon(updated);
                        showToast(
                          e.target.checked
                            ? 'Lembretes automáticos ativados!'
                            : 'Lembretes automáticos desativados.'
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 2. Window hours selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1 text-xs">
                      Antecedência do Lembrete:
                    </label>
                    <select
                      value={settingsForm.reminderHoursBefore || 24}
                      onChange={(e) => {
                        const updated = {
                          ...settingsForm,
                          reminderHoursBefore: Number(e.target.value),
                        };
                        setSettingsForm(updated);
                        StorageService.saveSalonInfo(updated);
                        onUpdateSalon(updated);
                      }}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-semibold text-xs"
                    >
                      <option value={24}>24 Horas Antes (1 dia antes - Recomendado)</option>
                      <option value={48}>48 Horas Antes (2 dias antes)</option>
                      <option value={12}>12 Horas Antes (mesmo dia / véspera)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1 text-xs">
                      Status do Canal:
                    </label>
                    <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>API WhatsApp Conectada</span>
                    </div>
                  </div>
                </div>

                {/* 3. Customizable Reminder Template */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-stone-800 text-xs">
                      Template Personalizado da Mensagem de Lembrete:
                    </label>
                    <button
                      type="button"
                      onClick={handleResetReminderTemplate}
                      className="text-[11px] text-pink-600 hover:text-pink-700 font-semibold underline"
                    >
                      Restaurar Padrão
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    value={settingsForm.reminderTemplate || DEFAULT_REMINDER_TEMPLATE}
                    onChange={(e) => {
                      const updated = { ...settingsForm, reminderTemplate: e.target.value };
                      setSettingsForm(updated);
                    }}
                    placeholder="Digite o modelo de mensagem de lembrete..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 focus:bg-white outline-hidden text-xs font-mono leading-relaxed resize-none"
                  />

                  {/* Insertable Tag Chips */}
                  <div className="mt-2">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">
                      Clique para inserir variáveis dinâmicas:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {[
                        { tag: '{cliente}', label: 'Nome da Cliente' },
                        { tag: '{servico}', label: 'Nome da Unha Artesanal' },
                        { tag: '{data}', label: 'Data (DD/MM/AAAA)' },
                        { tag: '{horario}', label: 'Horário' },
                        { tag: '{valor}', label: 'Valor (R$)' },
                        { tag: '{salao}', label: 'Nome do Ateliê' },
                        { tag: '{endereco}', label: 'Endereço/Cidade' },
                        { tag: '{whatsapp}', label: 'WhatsApp Oficial' },
                      ].map((item) => (
                        <button
                          key={item.tag}
                          type="button"
                          onClick={() => insertReminderTag(item.tag)}
                          className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-pink-100 text-stone-700 hover:text-pink-700 font-mono text-[10px] border border-stone-200 transition-colors"
                          title={`Inserir ${item.label}`}
                        >
                          {item.tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save button for preferences */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleSaveSettings(e)}
                    className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-black text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Salvar Preferências de Lembrete
                  </button>
                </div>
              </div>

              {/* 4. Live WhatsApp Preview Balloon */}
              <div className="pt-4 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                  <Eye className="w-3.5 h-3.5 text-pink-600" /> Pré-Visualização Formatada (Como a cliente recebe):
                </span>
                <div className="bg-[#e5ddd5] p-3.5 rounded-2xl shadow-inner border border-stone-300">
                  <div className="bg-white rounded-xl p-3 shadow-xs max-w-sm ml-auto text-[11px] leading-relaxed text-stone-900 border border-emerald-100">
                    <p className="whitespace-pre-line font-sans">{sampleReminderText}</p>
                    <div className="text-right text-[9px] text-stone-400 mt-1.5 flex items-center justify-end gap-1 font-mono">
                      <span>14:00</span>
                      <span className="text-emerald-600">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* PRÓXIMOS AGENDAMENTOS PARA LEMBRETE (24H/48H)          */}
          {/* ======================================================= */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
                  Disparador Rápido de Lembretes
                </span>
                <h4 className="font-serif text-xl font-bold text-black mt-0.5">
                  Agendamentos Elegíveis nas Próximas 24 Horas
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Lista de clientes com horários marcados para hoje ou amanhã. Dispare a notificação diretamente pelo WhatsApp em um clique.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200">
                  {upcomingReminders.length} na fila de lembrete
                </span>
              </div>
            </div>

            {upcomingReminders.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200 p-6">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h5 className="font-serif font-bold text-sm text-stone-900">
                  Tudo em dia!
                </h5>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Não há agendamentos pendentes de lembrete nas próximas 24 horas. Os lembretes são ativados automaticamente quando houver agendamentos na janela.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingReminders.map(({ booking, isTomorrow, isToday }) => {
                  const [year, month, day] = booking.date.split('-');
                  const formattedDate = `${day}/${month}/${year}`;
                  return (
                    <div
                      key={booking.id}
                      className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-4 hover:border-pink-300 transition-all shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isToday
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {isToday ? '🔔 Agendamento Hoje' : '⏰ Agendamento Amanhã (24h)'}
                          </span>

                          <span className="text-[11px] font-mono text-stone-400">
                            #{booking.id}
                          </span>
                        </div>

                        <h5 className="font-bold text-sm sm:text-base text-black">
                          {booking.clientName}
                        </h5>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Telefone: <b className="font-mono">{booking.clientPhone}</b>
                        </p>

                        <div className="mt-3 p-2.5 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">Modelo:</span>
                            <span className="font-bold text-stone-900">{booking.serviceName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">Data & Horário:</span>
                            <span className="font-bold text-pink-600">{formattedDate} às {booking.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">Valor Total:</span>
                            <span className="font-bold text-stone-900">R$ {booking.servicePrice.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleSendReminderForBooking(booking)}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                          title="Abrir WhatsApp com a mensagem de lembrete personalizada preenchida"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>Disparar Lembrete WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: QUICK PRICE EDIT (ALTERAR PREÇOS RÁPIDO)           */}
      {/* ========================================================= */}
      {quickPriceProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-pink-600" />
                <h3 className="font-serif text-lg font-bold text-black">
                  Alterar Preço do Produto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickPriceProduct(null)}
                className="text-stone-400 hover:text-stone-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <img
                  src={quickPriceProduct.imageUrl}
                  alt={quickPriceProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <h4 className="font-serif font-bold text-black text-sm leading-tight">
                    {quickPriceProduct.name}
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Preço atual: <b>R$ {quickPriceProduct.price.toFixed(2).replace('.', ',')}</b>
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveQuickPrice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Novo Preço de Venda (R$):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
                      R$
                    </span>
                    <input
                      type="text"
                      value={quickPriceInput}
                      onChange={(e) => setQuickPriceInput(e.target.value)}
                      placeholder="0,00"
                      autoFocus
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-base font-bold text-pink-600 bg-stone-50 border border-stone-300 rounded-xl focus:border-pink-500 focus:bg-white outline-hidden font-mono"
                    />
                  </div>
                </div>

                {/* Quick adjustment buttons */}
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1.5">
                    Ajustes Rápidos:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => adjustQuickPrice(5)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                    >
                      + R$ 5,00
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustQuickPrice(10)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                    >
                      + R$ 10,00
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustQuickPrice(20)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                    >
                      + R$ 20,00
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustQuickPrice(-5)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                    >
                      - R$ 5,00
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustQuickPrice(-10)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                    >
                      - R$ 10,00
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setQuickPriceProduct(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Salvar Novo Preço
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT FULL PRODUCT                            */}
      {/* ========================================================= */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-black">
                {editingProductId ? 'Editar Pintura Artesanal' : 'Inserir Novo Produto'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProduct(false)}
                className="text-stone-400 hover:text-stone-700 text-sm"
              >
                ✕
              </button>
            </div>

            {uploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nome do Modelo / Pintura Artesanal: *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Unha Encapsulada Rose Gold"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Categoria:
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as NailService['category'],
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden"
                  >
                    <option value="Encapsulada">Encapsulada</option>
                    <option value="Francesinha">Francesinha</option>
                    <option value="Mão Livre">Mão Livre</option>
                    <option value="Mármore">Mármore</option>
                    <option value="Degradê">Degradê</option>
                    <option value="3D & Pedraria">3D & Pedraria</option>
                    <option value="Efeitos">Efeitos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Preço (R$): *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 120,00"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-mono font-bold text-pink-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Duração Estimada:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1h30min"
                    value={productForm.duration}
                    onChange={(e) => setProductForm({ ...productForm, duration: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Foto da Amostra (.JPG):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="w-full px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-pink-600" />
                      <span>{isUploadingImage ? 'Processando...' : 'Carregar .JPG'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Preview & Built-in select */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
                <img
                  src={productForm.imageUrl}
                  alt="Amostra"
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1">
                  <span className="text-[10px] text-stone-500 font-medium block mb-1">
                    Ou selecione uma foto de alta definição do salão:
                  </span>
                  <select
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="/src/assets/images/hero_bk_nails_1793339141928.jpg">
                      Showcase Unhas Blush & Dourado
                    </option>
                    <option value="/src/assets/images/nail_encapsulated_flowers_1793339144938.jpg">
                      Flores Secas Encapsuladas
                    </option>
                    <option value="/src/assets/images/nail_floral_freehand_1793339143997.jpg">
                      Floral Feito à Mão Livre
                    </option>
                    <option value="/src/assets/images/nail_reverse_french_1793339143817.jpg">
                      Francesinha Reversa Traços Finos
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Descrição dos Detalhes da Técnica:
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva materiais, acabamentos e técnicas manuais..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={productForm.available}
                  onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="availCheck" className="text-xs text-stone-700">
                  Produto ativo e disponível para agendamento imediato
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
