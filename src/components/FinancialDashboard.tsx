import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  QrCode,
  Calendar,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  Users,
  Sparkles,
  Search,
  Check,
  AlertCircle,
} from 'lucide-react';
import { FinancialRecord, FinancialOperationType, PaymentMethod, Booking } from '../types';
import { StorageService } from '../services/storage';

interface FinancialDashboardProps {
  financialRecords: FinancialRecord[];
  onUpdateFinancialRecords: (records: FinancialRecord[]) => void;
  bookings: Booking[];
  attendants: string[];
  onAddAttendant: (name: string) => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  financialRecords,
  onUpdateFinancialRecords,
  bookings,
  attendants,
  onAddAttendant,
}) => {
  // Filters
  const [selectedAttendant, setSelectedAttendant] = useState<string>('Todas');
  const [dateFilter, setDateFilter] = useState<'hoje' | 'semana' | 'mes' | 'todos'>('todos');
  const [operationTypeFilter, setOperationTypeFilter] = useState<string>('Todas');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc' | 'atendente_asc' | 'cliente_asc'>('data_desc');

  // Modal New Record
  const [isNewRecordOpen, setIsNewRecordOpen] = useState<boolean>(false);
  const [newAttendantName, setNewAttendantName] = useState<string>('');
  const [isAddingNewAttendant, setIsAddingNewAttendant] = useState<boolean>(false);

  // Form states for new entry
  const [formAttendant, setFormAttendant] = useState<string>(attendants[0] || 'Bárbara Designer');
  const [formClient, setFormClient] = useState<string>('');
  const [formService, setFormService] = useState<string>('Pintura de Unhas Artesanais');
  const [formOperationType, setFormOperationType] = useState<FinancialOperationType>('recebimento_servico');
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethod>('pix');
  const [formGrossAmount, setFormGrossAmount] = useState<string>('');
  const [formChangeAmount, setFormChangeAmount] = useState<string>('0');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const now = new Date();

  // Filtered Financial Records
  const filteredRecords = useMemo(() => {
    return financialRecords.filter((rec) => {
      // Attendant filter
      if (selectedAttendant !== 'Todas' && rec.attendantName !== selectedAttendant) {
        return false;
      }

      // Date range filter
      if (dateFilter === 'hoje' && rec.date !== todayStr) {
        return false;
      }
      if (dateFilter === 'semana') {
        const rDate = new Date(rec.date);
        const diffDays = Math.abs(now.getTime() - rDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      }
      if (dateFilter === 'mes') {
        const rDate = new Date(rec.date);
        if (rDate.getMonth() !== now.getMonth() || rDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }

      // Operation filter
      if (operationTypeFilter !== 'Todas' && rec.operationType !== operationTypeFilter) {
        return false;
      }

      // Payment Method filter
      if (paymentMethodFilter !== 'Todas' && rec.paymentMethod !== paymentMethodFilter) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesClient = rec.clientName.toLowerCase().includes(q);
        const matchesService = rec.serviceOrDescription.toLowerCase().includes(q);
        const matchesAttendant = rec.attendantName.toLowerCase().includes(q);
        const matchesId = rec.id.toLowerCase().includes(q);
        if (!matchesClient && !matchesService && !matchesAttendant && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [financialRecords, selectedAttendant, dateFilter, operationTypeFilter, paymentMethodFilter, searchQuery, todayStr, now]);

  // Sorted Records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      if (sortBy === 'data_desc') {
        return new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      }
      if (sortBy === 'data_asc') {
        return new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      }
      if (sortBy === 'valor_desc') {
        return b.netAmount - a.netAmount;
      }
      if (sortBy === 'valor_asc') {
        return a.netAmount - b.netAmount;
      }
      if (sortBy === 'atendente_asc') {
        return a.attendantName.localeCompare(b.attendantName);
      }
      if (sortBy === 'cliente_asc') {
        return a.clientName.localeCompare(b.clientName);
      }
      return 0;
    });
  }, [filteredRecords, sortBy]);

  // Financial Totals (Totalizadores)
  const totals = useMemo(() => {
    const totalTransactions = filteredRecords.length;
    const totalGross = filteredRecords.reduce((acc, r) => acc + r.grossAmount, 0);
    const totalChange = filteredRecords.reduce((acc, r) => acc + (r.changeAmount || 0), 0);
    const totalNet = filteredRecords.reduce((acc, r) => acc + r.netAmount, 0);

    const totalPix = filteredRecords
      .filter((r) => r.paymentMethod === 'pix')
      .reduce((acc, r) => acc + r.netAmount, 0);

    const totalCashNet = filteredRecords
      .filter((r) => r.paymentMethod === 'dinheiro')
      .reduce((acc, r) => acc + r.netAmount, 0);

    const totalCard = filteredRecords
      .filter((r) => r.paymentMethod.startsWith('cartao'))
      .reduce((acc, r) => acc + r.netAmount, 0);

    const avgTicket = totalTransactions > 0 ? totalNet / totalTransactions : 0;

    return {
      totalTransactions,
      totalGross,
      totalChange,
      totalNet,
      totalPix,
      totalCashNet,
      totalCard,
      avgTicket,
    };
  }, [filteredRecords]);

  // Category breakdown by Attendant (Dividir categoria pelo nome da atendente)
  const attendantStats = useMemo(() => {
    const map: Record<string, { count: number; totalGross: number; totalNet: number }> = {};

    attendants.forEach((att) => {
      map[att] = { count: 0, totalGross: 0, totalNet: 0 };
    });

    filteredRecords.forEach((rec) => {
      const att = rec.attendantName || 'Equipe B & K';
      if (!map[att]) {
        map[att] = { count: 0, totalGross: 0, totalNet: 0 };
      }
      map[att].count += 1;
      map[att].totalGross += rec.grossAmount;
      map[att].totalNet += rec.netAmount;
    });

    return Object.entries(map).map(([name, stat]) => {
      const percent = totals.totalNet > 0 ? (stat.totalNet / totals.totalNet) * 100 : 0;
      return {
        name,
        count: stat.count,
        totalGross: stat.totalGross,
        totalNet: stat.totalNet,
        avg: stat.count > 0 ? stat.totalNet / stat.count : 0,
        percent,
      };
    });
  }, [filteredRecords, attendants, totals.totalNet]);

  // Actions
  const handleStatusToggle = (id: string, currentStatus: FinancialRecord['status']) => {
    const nextStatus = currentStatus === 'Recebido' ? 'Pendente' : 'Recebido';
    const updated = StorageService.updateFinancialRecord(id, { status: nextStatus });
    onUpdateFinancialRecords(updated);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Deseja excluir este registro financeiro?')) {
      const updated = StorageService.deleteFinancialRecord(id);
      onUpdateFinancialRecords(updated);
    }
  };

  const handleCreateNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formClient.trim()) {
      setFormError('Informe o nome da cliente.');
      return;
    }

    const gross = parseFloat(formGrossAmount.replace(',', '.')) || 0;
    if (gross <= 0) {
      setFormError('Informe um valor bruto válido maior que zero.');
      return;
    }

    let change = 0;
    if (formPaymentMethod === 'dinheiro') {
      change = parseFloat(formChangeAmount.replace(',', '.')) || 0;
    }

    const net = gross; // Líquido que entrou no caixa pelo serviço prestado

    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newRec = StorageService.addFinancialRecord({
      date: todayStr,
      time: nowTime,
      attendantName: formAttendant,
      clientName: formClient.trim(),
      operationType: formOperationType,
      serviceOrDescription: formService.trim(),
      paymentMethod: formPaymentMethod,
      grossAmount: gross,
      changeAmount: change,
      netAmount: net,
      status: 'Recebido',
      notes: formNotes.trim() || undefined,
    });

    const updated = StorageService.getFinancialRecords();
    onUpdateFinancialRecords(updated);
    setIsNewRecordOpen(false);

    // Reset fields
    setFormClient('');
    setFormGrossAmount('');
    setFormChangeAmount('0');
    setFormNotes('');
  };

  const handleSaveNewAttendant = () => {
    if (newAttendantName.trim()) {
      onAddAttendant(newAttendantName.trim());
      setFormAttendant(newAttendantName.trim());
      setNewAttendantName('');
      setIsAddingNewAttendant(false);
    }
  };

  const handlePrintLedger = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header of Financial Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600 block">
            Gestão & Caixa B & K Nails Designer
          </span>
          <h3 className="font-serif text-2xl font-black text-black">
            Controle Financeiro de Atendimento & Recebimento
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Acompanhe o faturamento, meios de pagamento, trocos entregues e divida a produção por atendente em lista concisa de uma linha.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrintLedger}
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-black text-stone-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Imprimir extrato de fechamento de caixa"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Imprimir Extrato</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewRecordOpen(true)}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Lançar Recebimento</span>
          </button>
        </div>
      </div>

      {/* 4 HIGHLIGHT TOTALIZERS (TOTALIZADORES) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Líquido em Caixa */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-pink-500/30 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Total Líquido Recebido</span>
            <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl sm:text-3xl font-black text-black tabular-nums">
              R$ {totals.totalNet.toFixed(2).replace('.', ',')}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
              <span>{totals.totalTransactions} operações realizadas</span>
            </div>
          </div>
        </div>

        {/* Total Pix */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-pink-100 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Recebido via PIX</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
              R$ {totals.totalPix.toFixed(2).replace('.', ',')}
            </span>
            <div className="text-[11px] text-stone-500 mt-1">
              Chave rápida do salão
            </div>
          </div>
        </div>

        {/* Total Dinheiro em Espécie e Troco */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-pink-100 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Dinheiro em Caixa</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
              R$ {totals.totalCashNet.toFixed(2).replace('.', ',')}
            </span>
            <div className="text-[11px] text-stone-500 mt-1">
              {totals.totalChange > 0 ? (
                <span className="text-pink-600 font-semibold">
                  (Trocos devolvidos: R$ {totals.totalChange.toFixed(2).replace('.', ',')})
                </span>
              ) : (
                'Sem trocos devolvidos'
              )}
            </div>
          </div>
        </div>

        {/* Total Cartões & Ticket Médio */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-pink-100 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Cartões (Crédito/Débito)</span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
              R$ {totals.totalCard.toFixed(2).replace('.', ',')}
            </span>
            <div className="text-[11px] text-stone-500 mt-1">
              Ticket Médio: <b>R$ {totals.avgTicket.toFixed(2).replace('.', ',')}</b>
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDIR CATEGORIA PELO NOME DA ATENDENTE (PRODUÇÃO POR DESIGNER) */}
      <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-600" />
            <h4 className="font-serif text-lg font-black text-black">
              Produção & Recebimento por Atendente
            </h4>
          </div>
          <span className="text-[11px] text-stone-500">
            Categorização individual de faturamento por profissional
          </span>
        </div>

        {/* Attendant Performance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {attendantStats.map((att) => {
            const isSelected = selectedAttendant === att.name;
            return (
              <div
                key={att.name}
                onClick={() => setSelectedAttendant(isSelected ? 'Todas' : att.name)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-pink-600 bg-pink-50/70 ring-2 ring-pink-500/20 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-black text-white text-[11px] font-black flex items-center justify-center">
                      {att.name.charAt(0)}
                    </div>
                    <span className="font-bold text-xs text-black">{att.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-pink-600 font-mono">
                    {att.percent.toFixed(1)}% do total
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">
                      Total Recebido
                    </span>
                    <span className="font-serif text-lg font-black text-black tabular-nums">
                      R$ {att.totalNet.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">
                      Atendimentos
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      {att.count} atend.
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div
                    className="bg-pink-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, att.percent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Side: Period pills & Attendant dropdown */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Date range filter */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl">
            {(['todos', 'hoje', 'semana', 'mes'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setDateFilter(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  dateFilter === p ? 'bg-white shadow-2xs text-black font-bold' : 'text-stone-600 hover:text-black'
                }`}
              >
                {p === 'todos' ? 'Todo o Período' : p}
              </button>
            ))}
          </div>

          {/* Attendant selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium text-[11px]">Atendente:</span>
            <select
              value={selectedAttendant}
              onChange={(e) => setSelectedAttendant(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-black outline-hidden focus:border-pink-500"
            >
              <option value="Todas">Todas as Atendentes</option>
              {attendants.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Operation type selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium text-[11px]">Operação:</span>
            <select
              value={operationTypeFilter}
              onChange={(e) => setOperationTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-black outline-hidden focus:border-pink-500"
            >
              <option value="Todas">Todas as Operações</option>
              <option value="recebimento_servico">Recebimento de Atendimento</option>
              <option value="sinal_reserva">Sinal / Reserva</option>
              <option value="venda_produto">Venda de Produto</option>
              <option value="taxa_adicional">Taxa Adicional / Reparo</option>
            </select>
          </div>
        </div>

        {/* Right Side: Search and Sorting */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* Sorting */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 outline-hidden focus:border-pink-500"
            >
              <option value="data_desc">Data: Mais recentes</option>
              <option value="data_asc">Data: Mais antigas</option>
              <option value="valor_desc">Valor: Maior primeiro</option>
              <option value="valor_asc">Valor: Menor primeiro</option>
              <option value="atendente_asc">Atendente: A-Z</option>
              <option value="cliente_asc">Cliente: A-Z</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 lg:w-52">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente ou serviço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-hidden focus:border-pink-500 placeholder:text-stone-400"
            />
          </div>
        </div>
      </div>

      {/* SINGLE-LINE TABULAR LEDGER (LISTA ORDENADA EM APENAS UMA LINHA) */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-black text-black">
              Extrato Financeiro em Linha Única
            </span>
            <span className="text-[11px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
              {sortedRecords.length} lançamentos
            </span>
          </div>

          <span className="text-[11px] text-stone-500">
            Total exibido: <b className="text-black font-mono">R$ {totals.totalNet.toFixed(2).replace('.', ',')}</b>
          </span>
        </div>

        {sortedRecords.length === 0 ? (
          <div className="text-center py-12 p-6">
            <DollarSign className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="font-serif text-base font-bold text-stone-800">
              Nenhum lançamento financeiro encontrado
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Altere os filtros acima ou registre uma nova entrada no caixa.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-stone-950 text-white uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-3.5">ID / Hora</th>
                  <th className="py-3 px-3.5">Data</th>
                  <th className="py-3 px-3.5">Atendente</th>
                  <th className="py-3 px-3.5">Cliente</th>
                  <th className="py-3 px-3.5">Tipo de Operação</th>
                  <th className="py-3 px-3.5">Serviço / Item</th>
                  <th className="py-3 px-3.5">Forma Pagto</th>
                  <th className="py-3 px-3.5 text-right">Valor Bruto</th>
                  <th className="py-3 px-3.5 text-right">Troco</th>
                  <th className="py-3 px-3.5 text-right">Valor Líquido</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {sortedRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-pink-50/40 transition-colors h-11 text-stone-900"
                  >
                    {/* ID / Hora */}
                    <td className="py-2.5 px-3.5 font-mono text-[11px] text-stone-500">
                      <span className="font-bold text-black">{rec.id}</span>
                      <span className="text-stone-400 ml-1.5">{rec.time}</span>
                    </td>

                    {/* Data */}
                    <td className="py-2.5 px-3.5 font-semibold text-stone-800 text-[11px]">
                      {rec.date.split('-').reverse().join('/')}
                    </td>

                    {/* Atendente (Badge Clean) */}
                    <td className="py-2.5 px-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 border border-pink-200 text-pink-900">
                        {rec.attendantName}
                      </span>
                    </td>

                    {/* Cliente */}
                    <td className="py-2.5 px-3.5 font-bold text-black max-w-[160px] truncate">
                      {rec.clientName}
                    </td>

                    {/* Tipo de Operação */}
                    <td className="py-2.5 px-3.5 text-stone-600 text-[11px]">
                      {StorageService.formatOperationType(rec.operationType)}
                    </td>

                    {/* Serviço / Item */}
                    <td className="py-2.5 px-3.5 text-stone-700 max-w-[200px] truncate text-[11px]">
                      {rec.serviceOrDescription}
                    </td>

                    {/* Forma Pagto */}
                    <td className="py-2.5 px-3.5">
                      <span className="font-semibold text-[11px] text-stone-800 flex items-center gap-1">
                        {rec.paymentMethod === 'pix' && <QrCode className="w-3 h-3 text-emerald-600" />}
                        {rec.paymentMethod === 'dinheiro' && <Banknote className="w-3 h-3 text-emerald-600" />}
                        {rec.paymentMethod.startsWith('cartao') && <CreditCard className="w-3 h-3 text-pink-600" />}
                        <span>
                          {rec.paymentMethod === 'pix'
                            ? 'PIX'
                            : rec.paymentMethod === 'dinheiro'
                            ? 'Dinheiro'
                            : rec.paymentMethod === 'cartao_credito'
                            ? 'Cartão Crédito'
                            : 'Cartão Débito'}
                        </span>
                      </span>
                    </td>

                    {/* Valor Bruto */}
                    <td className="py-2.5 px-3.5 text-right font-mono text-stone-600 text-[11px]">
                      R$ {rec.grossAmount.toFixed(2).replace('.', ',')}
                    </td>

                    {/* Troco */}
                    <td className="py-2.5 px-3.5 text-right font-mono text-[11px]">
                      {rec.changeAmount && rec.changeAmount > 0 ? (
                        <span className="text-pink-700 font-semibold">
                          - R$ {rec.changeAmount.toFixed(2).replace('.', ',')}
                        </span>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                    </td>

                    {/* Valor Líquido Recebido */}
                    <td className="py-2.5 px-3.5 text-right font-mono font-black text-black text-xs">
                      R$ {rec.netAmount.toFixed(2).replace('.', ',')}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(rec.id, rec.status)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          rec.status === 'Recebido'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : rec.status === 'Pendente'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-red-100 text-red-800'
                        }`}
                        title="Clique para alternar status"
                      >
                        {rec.status}
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Excluir lançamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: LANÇAR NOVO RECEBIMENTO DE CAIXA */}
      {isNewRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs">
                  BK
                </div>
                <div>
                  <h3 className="font-serif text-lg font-black text-black">
                    Novo Recebimento de Caixa
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Registre a operação financeira vinculada à atendente responsável.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRecordOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateNewRecord} className="space-y-4 mt-4 text-xs sm:text-sm">
              {/* Seleção de Atendente */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-900">
                    Atendente / Designer Responsável: *
                  </label>
                  {!isAddingNewAttendant && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAttendant(true)}
                      className="text-[11px] text-pink-600 hover:text-pink-800 font-semibold"
                    >
                      + Nova Atendente
                    </button>
                  )}
                </div>

                {isAddingNewAttendant ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nome da nova atendente..."
                      value={newAttendantName}
                      onChange={(e) => setNewAttendantName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNewAttendant}
                      className="px-3 py-1.5 bg-black text-white rounded-xl font-bold text-xs"
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAttendant(false)}
                      className="px-2 py-1.5 text-stone-400 hover:text-stone-700 text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <select
                    value={formAttendant}
                    onChange={(e) => setFormAttendant(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-semibold"
                  >
                    {attendants.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Cliente */}
              <div>
                <label className="block font-bold text-stone-900 mb-1">
                  Nome da Cliente: *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Amanda Bezerra"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-semibold"
                />
              </div>

              {/* Tipo de Operação & Serviço */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-900 mb-1">
                    Tipo de Operação:
                  </label>
                  <select
                    value={formOperationType}
                    onChange={(e) => setFormOperationType(e.target.value as FinancialOperationType)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden text-xs"
                  >
                    <option value="recebimento_servico">Recebimento Atendimento</option>
                    <option value="sinal_reserva">Sinal / Reserva Horário</option>
                    <option value="venda_produto">Venda de Produto / Home Care</option>
                    <option value="taxa_adicional">Taxa Adicional / Reparo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">
                    Descrição / Serviço:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Unha Encapsulada"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden text-xs"
                  />
                </div>
              </div>

              {/* Forma de Pagamento & Valores */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-900 mb-1">
                    Forma de Pagamento:
                  </label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-semibold text-xs"
                  >
                    <option value="pix">PIX</option>
                    <option value="dinheiro">Dinheiro em Espécie</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">
                    Valor Recebido (R$): *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 120,00"
                    value={formGrossAmount}
                    onChange={(e) => setFormGrossAmount(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-mono font-bold text-black text-sm"
                  />
                </div>
              </div>

              {/* Campo de Troco se Dinheiro */}
              {formPaymentMethod === 'dinheiro' && (
                <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-xl space-y-2">
                  <label className="block font-bold text-stone-900 text-xs">
                    Houve Troco Devolvido? (R$)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 30,00 (ou 0 se não teve troco)"
                    value={formChangeAmount}
                    onChange={(e) => setFormChangeAmount(e.target.value)}
                    className="w-full px-3.5 py-1.5 bg-white border border-stone-200 rounded-lg focus:border-pink-500 outline-hidden font-mono text-xs"
                  />
                  <span className="text-[10px] text-stone-500 block">
                    Registre o valor que saiu do caixa de troco para controle preciso.
                  </span>
                </div>
              )}

              {/* Observações */}
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Observações (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Comprovante arquivado, cliente satisfeita..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewRecordOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
