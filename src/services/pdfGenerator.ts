import { jsPDF } from 'jspdf';
import { Booking, SalonInfo, Consultant } from '../types';

export const PDFService = {
  /**
   * Generates a stylized jsPDF instance for a booking receipt/voucher
   */
  generateBookingPDFDoc(
    booking: Booking,
    salon: SalonInfo,
    consultant?: Consultant | null
  ): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // Helper for formatting date
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    };

    // Helper for payment description
    const getPaymentDesc = () => {
      switch (booking.paymentMethod) {
        case 'dinheiro':
          if (booking.needChange && booking.changeFor && booking.changeAmount) {
            return `Dinheiro (Cédula: R$ ${booking.changeFor.toFixed(2).replace('.', ',')} | Troco: R$ ${booking.changeAmount.toFixed(2).replace('.', ',')})`;
          }
          return 'Dinheiro em Espécie (Valor exato no local)';
        case 'pix':
          return `PIX (Chave Celular: ${salon.pixKey})`;
        case 'cartao_credito':
          return 'Cartão de Crédito (Maquininha no local)';
        case 'cartao_debito':
          return 'Cartão de Débito (Maquininha no local)';
        default:
          return booking.paymentMethod;
      }
    };

    // ==========================================
    // TOP HEADER BANNER (Luxury Stone-950 + Pink Accent)
    // ==========================================
    doc.setFillColor(18, 18, 20); // #121214 deep black
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Pink highlight bar
    doc.setFillColor(219, 39, 119); // #db2777 pink-600
    doc.rect(0, 42, pageWidth, 2.5, 'F');

    // Salon Monogram Logo Box
    doc.setFillColor(219, 39, 119);
    doc.roundedRect(margin, 8, 24, 24, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('BK', margin + 12, 23, { align: 'center' });
    doc.setFontSize(6.5);
    doc.text('NAILS', margin + 12, 27.5, { align: 'center' });

    // Header Text
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(salon.name, margin + 30, 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(244, 114, 182); // pink-400
    doc.text(salon.niche.toUpperCase(), margin + 30, 23);

    doc.setFontSize(8);
    doc.setTextColor(214, 211, 209); // stone-300
    doc.text(`Ateliê em ${salon.city} - ${salon.state}  ·  WhatsApp: ${salon.bookingWhatsapp}`, margin + 30, 29);

    // Right Side: Voucher Badge
    doc.setFillColor(39, 39, 42); // stone-800
    doc.roundedRect(pageWidth - margin - 52, 9, 52, 22, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(244, 114, 182);
    doc.text('COMPROVANTE OFICIAL', pageWidth - margin - 26, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`#${booking.id}`, pageWidth - margin - 26, 22, { align: 'center' });

    doc.setFontSize(6.5);
    doc.setTextColor(161, 161, 170);
    const now = new Date();
    doc.text(`Emitido em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - margin - 26, 27.5, { align: 'center' });

    // ==========================================
    // BODY SECTION
    // ==========================================
    let currentY = 53;

    // Title & Welcome Message
    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(24, 24, 27);
    doc.text('Comprovante de Agendamento de Pintura Artesanal', margin, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(113, 113, 122);
    doc.text(
      'Apresente este comprovante no ateliê ou envie via WhatsApp para confirmação do seu atendimento exclusivo.',
      margin,
      currentY
    );

    currentY += 7;

    // ------------------------------------------
    // CARD 1: DADOS DA CLIENTE & CONSULTOR(A) (2 COLUMNS)
    // ------------------------------------------
    const colWidth = (contentWidth - 6) / 2;
    const cardHeight = 38;

    // Column Left: Dados da Cliente
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(228, 228, 231);
    doc.roundedRect(margin, currentY, colWidth, cardHeight, 3, 3, 'FD');

    // Title left
    doc.setFillColor(244, 244, 245);
    doc.rect(margin + 0.5, currentY + 0.5, colWidth - 1, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    doc.text('DADOS DA CLIENTE', margin + 4, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Nome Completo:', margin + 4, currentY + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(24, 24, 27);
    doc.text(booking.clientName, margin + 4, currentY + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Telefone / WhatsApp:', margin + 4, currentY + 26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(24, 24, 27);
    doc.text(booking.clientPhone, margin + 4, currentY + 31);

    // Column Right: Consultor(a) Responsável
    const rightColX = margin + colWidth + 6;
    doc.setFillColor(253, 242, 248); // pink-50
    doc.setDrawColor(244, 114, 182); // pink-400
    doc.roundedRect(rightColX, currentY, colWidth, cardHeight, 3, 3, 'FD');

    // Title right
    doc.setFillColor(251, 207, 232); // pink-200
    doc.rect(rightColX + 0.5, currentY + 0.5, colWidth - 1, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(157, 23, 77); // pink-900
    doc.text('CONSULTOR(A) / ATENDENTE ESCOLHIDO(A)', rightColX + 4, currentY + 5.5);

    const consultantDisplayName =
      consultant?.name || booking.consultantName || 'Bárbara Designer';
    const consultantSpecialty =
      consultant?.specialty ||
      (consultantDisplayName.toLowerCase().includes('karla')
        ? 'Francesinha Reversa, Mármore Realista e Mão Livre'
        : 'Encapsuladas, Flores Secas e Arte 3D em Relevo');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Profissional Responsável:', rightColX + 4, currentY + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(190, 24, 93); // pink-700
    doc.text(consultantDisplayName, rightColX + 4, currentY + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(113, 113, 122);
    doc.text('Especialidade:', rightColX + 4, currentY + 25);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    const splitSpecialty = doc.splitTextToSize(consultantSpecialty, colWidth - 8);
    doc.text(splitSpecialty, rightColX + 4, currentY + 29.5);

    currentY += cardHeight + 6;

    // ------------------------------------------
    // CARD 2: SERVIÇO & HORÁRIO DO ATENDIMENTO
    // ------------------------------------------
    const serviceCardHeight = 44;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(228, 228, 231);
    doc.roundedRect(margin, currentY, contentWidth, serviceCardHeight, 3, 3, 'FD');

    // Header bar
    doc.setFillColor(24, 24, 27);
    doc.rect(margin + 0.5, currentY + 0.5, contentWidth - 1, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('DETALHES DA ARTE ARTESANAL & HORÁRIO', margin + 4, currentY + 5.5);

    // Date and time badge
    doc.setFillColor(219, 39, 119);
    doc.roundedRect(contentWidth + margin - 52, currentY + 1.2, 50, 6, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `DATA: ${formatDate(booking.date)} ÀS ${booking.time}`,
      contentWidth + margin - 27,
      currentY + 5.2,
      { align: 'center' }
    );

    // Service details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Serviço / Pintura Artesanal Solicitada:', margin + 4, currentY + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(24, 24, 27);
    doc.text(booking.serviceName, margin + 4, currentY + 20);

    // Row with Date, Time, Status
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Data Agendada:', margin + 4, currentY + 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(24, 24, 27);
    doc.text(formatDate(booking.date), margin + 4, currentY + 33);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Horário Marcado:', margin + 48, currentY + 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(24, 24, 27);
    doc.text(`${booking.time} (Horário do Acre)`, margin + 48, currentY + 33);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Status:', margin + 98, currentY + 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text(booking.status || 'Confirmado', margin + 98, currentY + 33);

    // Notes if present
    if (booking.notes && booking.notes.trim()) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.text(`Observações: ${booking.notes}`, margin + 4, currentY + 39.5);
    }

    currentY += serviceCardHeight + 6;

    // ------------------------------------------
    // CARD 3: VALOR, PAGAMENTO & TROCO
    // ------------------------------------------
    const paymentCardHeight = 44;
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(228, 228, 231);
    doc.roundedRect(margin, currentY, contentWidth, paymentCardHeight, 3, 3, 'FD');

    // Title
    doc.setFillColor(244, 244, 245);
    doc.rect(margin + 0.5, currentY + 0.5, contentWidth - 1, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    doc.text('VALOR DO SERVIÇO & FORMA DE PAGAMENTO', margin + 4, currentY + 5.5);

    // Big Price on right
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(contentWidth + margin - 58, currentY + 11, 54, 26, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(153, 27, 27);
    doc.text('TOTAL DO SERVIÇO', contentWidth + margin - 31, currentY + 17, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(190, 24, 93);
    doc.text(
      `R$ ${booking.servicePrice.toFixed(2).replace('.', ',')}`,
      contentWidth + margin - 31,
      currentY + 25,
      { align: 'center' }
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Pagamento no atendimento', contentWidth + margin - 31, currentY + 31, { align: 'center' });

    // Payment details on left
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text('Forma de Pagamento Escolhida:', margin + 4, currentY + 15);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(24, 24, 27);
    doc.text(getPaymentDesc(), margin + 4, currentY + 20);

    // PIX details or Cash Change details
    if (booking.paymentMethod === 'pix') {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(113, 113, 122);
      doc.text(`Chave PIX (Telefone): ${salon.pixKey}  |  Titular: ${salon.pixReceiver}`, margin + 4, currentY + 27);
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text('Você pode efetuar a transferência previamente ou no momento da conclusão do serviço.', margin + 4, currentY + 32);
    } else if (booking.paymentMethod === 'dinheiro') {
      if (booking.needChange && booking.changeFor && booking.changeAmount) {
        doc.setFillColor(236, 253, 245);
        doc.setDrawColor(167, 243, 208);
        doc.roundedRect(margin + 4, currentY + 25, 110, 12, 2, 2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(6, 95, 70);
        doc.text(
          `Troco programado: Cédula informada R$ ${booking.changeFor.toFixed(2).replace('.', ',')} -> Devolveremos R$ ${booking.changeAmount.toFixed(2).replace('.', ',')}`,
          margin + 7,
          currentY + 32.5
        );
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(75, 85, 99);
        doc.text('Cliente informou que pagará com valor em dinheiro exato (não necessita de troco).', margin + 4, currentY + 28);
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(75, 85, 99);
      doc.text('Aceitamos cartões de débito e crédito no ateliê com maquininha física.', margin + 4, currentY + 28);
    }

    currentY += paymentCardHeight + 6;

    // ------------------------------------------
    // CARD 4: TERMOS, LOCALIZAÇÃO & REGRAS
    // ------------------------------------------
    const infoCardHeight = 36;
    doc.setFillColor(254, 243, 199); // amber-50
    doc.setDrawColor(251, 191, 36); // amber-400
    doc.roundedRect(margin, currentY, contentWidth, infoCardHeight, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('INFORMAÇÕES IMPORTANTES PARA O SEU ATENDIMENTO:', margin + 4, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 53, 15);
    doc.text('1. Tolerância de Chegada: O ateliê concede até 15 minutos de tolerância para o horário marcado.', margin + 4, currentY + 12);
    doc.text('2. Reagendamento / Cancelamento: Por gentileza, nos avise com no mínimo 2 horas de antecedência.', margin + 4, currentY + 17);
    doc.text(`3. Local de Atendimento: Ateliê B & K Nails Designer em ${salon.city} - ${salon.state}.`, margin + 4, currentY + 22);
    doc.text(`4. Atendimento via WhatsApp: Qualquer dúvida ou envio de foto de referência, chame no ${salon.bookingWhatsapp}.`, margin + 4, currentY + 27);
    doc.text('5. Cartão Fidelidade: Cada atendimento concluído pontua automaticamente para resgate de cortesias!', margin + 4, currentY + 32);

    currentY += infoCardHeight + 6;

    // ------------------------------------------
    // DIGITAL SIGNATURE & VERIFICATION STAMP
    // ------------------------------------------
    doc.setDrawColor(228, 228, 231);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(margin, currentY, contentWidth + margin, currentY);
    doc.setLineDashPattern([], 0); // reset

    currentY += 6;

    // Digital Hash Code
    const verificationCode = `BK-${booking.id.toUpperCase()}-${Date.now().toString().slice(-4)}`;
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text(`CÓDIGO DE AUTENTICIDADE: ${verificationCode}`, margin, currentY);

    // Stamp
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('VOUCHER VÁLIDO & AUTENTICADO', contentWidth + margin, currentY, { align: 'right' });

    // ==========================================
    // FOOTER (BOTTOM OF PAGE)
    // ==========================================
    const footerY = pageHeight - 14;
    doc.setFillColor(24, 24, 27);
    doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(214, 211, 209);
    doc.text(
      `${salon.name} · ${salon.niche} · ${salon.city} - ${salon.state}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
    doc.text(
      `Central de Agendamentos WhatsApp: ${salon.bookingWhatsapp}  |  Telefones: ${salon.phones.join(' / ')}`,
      pageWidth / 2,
      footerY + 4.5,
      { align: 'center' }
    );

    return doc;
  },

  /**
   * Directly triggers download of the booking voucher PDF
   */
  downloadBookingPDF(
    booking: Booking,
    salon: SalonInfo,
    consultant?: Consultant | null
  ): void {
    const doc = this.generateBookingPDFDoc(booking, salon, consultant);
    const fileName = `comprovante_agendamento_${booking.id}_bk_nails.pdf`;
    doc.save(fileName);
  },

  /**
   * Opens the PDF in a new tab for printing or viewing
   */
  openBookingPDF(
    booking: Booking,
    salon: SalonInfo,
    consultant?: Consultant | null
  ): void {
    const doc = this.generateBookingPDFDoc(booking, salon, consultant);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  },
};
