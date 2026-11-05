import { Booking, SalonInfo, Consultant } from '../types';

/**
 * Service to generate high-resolution, luxury receipt vouchers in .JPG format
 * using HTML5 Canvas.
 */
export const ReceiptImageService = {
  /**
   * Generates a high-resolution JPG data URL for a booking receipt/voucher
   */
  async generateBookingJpgDataUrl(
    booking: Booking,
    salon: SalonInfo,
    consultant?: Consultant | null
  ): Promise<string> {
    const width = 800;
    const height = 1120;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Não foi possível inicializar o canvas 2D');
    }

    // Helper functions
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return dateStr;
    };

    const formatPaymentDesc = () => {
      switch (booking.paymentMethod) {
        case 'dinheiro':
          if (booking.needChange && booking.changeFor && booking.changeAmount) {
            return `Dinheiro (Leva R$ ${booking.changeFor.toFixed(2).replace('.', ',')} · Troco: R$ ${booking.changeAmount.toFixed(2).replace('.', ',')})`;
          }
          return 'Dinheiro em Espécie (Valor exato no local)';
        case 'pix':
          return `PIX Oficial (Chave: ${salon.pixKey})`;
        case 'cartao_credito':
          return 'Cartão de Crédito (Maquininha no local)';
        case 'cartao_debito':
          return 'Cartão de Débito (Maquininha no local)';
        default:
          return booking.paymentMethod;
      }
    };

    // 1. Background fill
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 2. Top Banner Header (Deep Black #121214)
    ctx.fillStyle = '#121214';
    ctx.fillRect(0, 0, width, 140);

    // Pink accent bar (#db2777)
    ctx.fillStyle = '#db2777';
    ctx.fillRect(0, 140, width, 8);

    // Monogram Box
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.roundRect(40, 28, 84, 84, 16);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BK', 82, 75);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('NAILS', 82, 95);

    // Salon title & niche
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px serif';
    ctx.fillText('BK NAILS DESIGN', 145, 54);
    ctx.font = 'italic 13px sans-serif';
    ctx.fillStyle = '#fbcfe8';
    ctx.fillText('Studio B&K Nails · Pinturas Artesanais', 145, 74);

    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`WhatsApp: ${salon.bookingWhatsapp} · Rio Branco - AC`, 145, 96);

    // Header Right: Official Voucher Badge
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.roundRect(width - 230, 32, 190, 76, 12);
    ctx.fill();

    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COMPROVANTE OFICIAL', width - 135, 55);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`#${booking.id}`, width - 135, 82);

    const now = new Date();
    const emissaoStr = `Emitido em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '10px sans-serif';
    ctx.fillText(emissaoStr, width - 135, 98);

    // 3. Section Title
    let y = 185;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 24px serif';
    ctx.fillText('Comprovante de Agendamento de Pintura Artesanal', 40, y);

    y += 24;
    ctx.fillStyle = '#71717a';
    ctx.font = '13px sans-serif';
    ctx.fillText(`Apresente este arquivo .JPG ou envie via WhatsApp para confirmação do seu atendimento.`, 40, y);

    y += 30;

    // 4. Two Columns: DADOS DA CLIENTE & CONSULTOR(A)
    const colW = (width - 80 - 20) / 2;
    const cardH = 135;

    // Left Box (Cliente)
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(40, y, colW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f4f4f5';
    ctx.beginPath();
    ctx.roundRect(40, y, colW, 34, [12, 12, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('👤 DADOS DA CLIENTE', 55, y + 22);

    ctx.fillStyle = '#71717a';
    ctx.font = '11px sans-serif';
    ctx.fillText('Nome Completo:', 55, y + 55);
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(booking.clientName, 55, y + 75);

    ctx.fillStyle = '#71717a';
    ctx.font = '11px sans-serif';
    ctx.fillText('Telefone / WhatsApp:', 55, y + 100);
    ctx.fillStyle = '#db2777';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(booking.clientPhone, 55, y + 120);

    // Right Box (Consultora)
    const rightX = 40 + colW + 20;
    ctx.fillStyle = '#fdf2f8';
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(rightX, y, colW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.roundRect(rightX, y, colW, 34, [12, 12, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#9d174d';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('👩‍🎨 CONSULTOR(A) ESCOLHIDO(A)', rightX + 15, y + 22);

    const consName = consultant?.name || booking.consultantName || 'Bárbara Designer';
    const consSpec =
      consultant?.specialty ||
      (consName.toLowerCase().includes('karla')
        ? 'Francesinha Reversa, Mármore Realista e Mão Livre'
        : 'Encapsuladas, Flores Secas e Arte 3D em Relevo');

    ctx.fillStyle = '#71717a';
    ctx.font = '11px sans-serif';
    ctx.fillText('Profissional Responsável:', rightX + 15, y + 55);
    ctx.fillStyle = '#be185d';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(consName, rightX + 15, y + 76);

    ctx.fillStyle = '#71717a';
    ctx.font = '11px sans-serif';
    ctx.fillText('Especialidade:', rightX + 15, y + 98);
    ctx.fillStyle = '#374151';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText(consSpec.slice(0, 42), rightX + 15, y + 118);

    y += cardH + 20;

    // 5. Full Width Box: DETALHES DA ARTE ARTESANAL & HORÁRIO
    const serviceH = 155;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(40, y, width - 80, serviceH, 12);
    ctx.fill();
    ctx.stroke();

    // Top Header
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(40, y, width - 80, 36, [12, 12, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('💅 DETALHES DA ARTE ARTESANAL & HORÁRIO MARCADO', 55, y + 23);

    // Right badge
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.roundRect(width - 40 - 240, y + 5, 230, 26, 6);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`DATA: ${formatDate(booking.date)} ÀS ${booking.time}`, width - 40 - 125, y + 22);

    // Service name
    ctx.textAlign = 'left';
    ctx.fillStyle = '#71717a';
    ctx.font = '12px sans-serif';
    ctx.fillText('Serviço / Pintura Artesanal Solicitada:', 55, y + 60);

    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 18px serif';
    ctx.fillText(booking.serviceName, 55, y + 84);

    // Date / Time / Status columns
    ctx.fillStyle = '#71717a';
    ctx.font = '11px sans-serif';
    ctx.fillText('Data Marcada:', 55, y + 112);
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(formatDate(booking.date), 55, y + 132);

    ctx.fillStyle = '#71717a';
    ctx.font = '11px sans-serif';
    ctx.fillText('Horário:', 240, y + 112);
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`${booking.time} (Acre)`, 240, y + 132);

    ctx.fillStyle = '#71717a';
    ctx.font = '11px sans-serif';
    ctx.fillText('Status do Agendamento:', 420, y + 112);
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`● ${booking.status || 'Confirmado'}`, 420, y + 132);

    if (booking.notes && booking.notes.trim()) {
      ctx.fillStyle = '#6b7280';
      ctx.font = 'italic 11px sans-serif';
      ctx.fillText(`Obs: ${booking.notes.trim()}`, 580, y + 132);
    }

    y += serviceH + 20;

    // 6. Box: VALOR DO SERVIÇO & FORMA DE PAGAMENTO
    const payH = 145;
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(40, y, width - 80, payH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f4f4f5';
    ctx.beginPath();
    ctx.roundRect(40, y, width - 80, 34, [12, 12, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('💰 VALOR TOTAL & FORMA DE PAGAMENTO', 55, y + 22);

    // Big Price Box right
    const priceBoxW = 200;
    const priceBoxX = width - 40 - priceBoxW - 15;
    ctx.fillStyle = '#fdf2f8';
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(priceBoxX, y + 45, priceBoxW, 85, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#9d174d';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TOTAL A PAGAR', priceBoxX + priceBoxW / 2, y + 66);

    ctx.fillStyle = '#be185d';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`R$ ${booking.servicePrice.toFixed(2).replace('.', ',')}`, priceBoxX + priceBoxW / 2, y + 98);

    ctx.fillStyle = '#71717a';
    ctx.font = '10px sans-serif';
    ctx.fillText('Pagamento no atendimento', priceBoxX + priceBoxW / 2, y + 118);

    // Left Payment description
    ctx.textAlign = 'left';
    ctx.fillStyle = '#71717a';
    ctx.font = '11px sans-serif';
    ctx.fillText('Condição Escolhida:', 55, y + 58);

    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(formatPaymentDesc(), 55, y + 78);

    if (booking.paymentMethod === 'dinheiro') {
      if (booking.needChange && booking.changeFor && booking.changeAmount) {
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`💵 Cédula: R$ ${booking.changeFor.toFixed(2).replace('.', ',')}  ➜  Troco a devolver: R$ ${booking.changeAmount.toFixed(2).replace('.', ',')}`, 55, y + 112);
      } else {
        ctx.fillStyle = '#4b5563';
        ctx.font = '12px sans-serif';
        ctx.fillText('💵 Cliente levará valor exato em dinheiro (não necessita de troco).', 55, y + 112);
      }
    } else if (booking.paymentMethod === 'pix') {
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`📲 Chave PIX (Telefone): ${salon.pixKey} · Titular: ${salon.pixReceiver}`, 55, y + 112);
    } else {
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px sans-serif';
      ctx.fillText('💳 Aceitamos cartões de crédito e débito via maquininha no ateliê.', 55, y + 112);
    }

    y += payH + 20;

    // 7. Important notice card (Yellow/Amber)
    const noticeH = 110;
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(40, y, width - 80, noticeH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('⚠️ INFORMAÇÕES IMPORTANTES PARA O SEU ATENDIMENTO:', 55, y + 25);

    ctx.fillStyle = '#78350f';
    ctx.font = '11px sans-serif';
    ctx.fillText('1. Tolerância de Chegada: O ateliê concede até 15 minutos de tolerância para o horário marcado.', 55, y + 46);
    ctx.fillText(`2. Atendimento & Agendamentos WhatsApp Oficial: ${salon.bookingWhatsapp} (Rio Branco - AC).`, 55, y + 66);
    ctx.fillText('3. Cartão Fidelidade: Cada atendimento concluído pontua automaticamente para resgate de cortesias!', 55, y + 86);

    y += noticeH + 20;

    // 8. Verification & Stamp
    ctx.strokeStyle = '#d4d4d8';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(width - 40, y);
    ctx.stroke();
    ctx.setLineDash([]);

    y += 24;
    const authCode = `BK-${booking.id.toUpperCase()}-${Date.now().toString().slice(-4)}`;
    ctx.fillStyle = '#71717a';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`AUTENTICIDADE: ${authCode}`, 40, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('✓ VOUCHER VÁLIDO & AUTENTICADO', width - 40, y);

    // 9. Footer bar
    ctx.fillStyle = '#121214';
    ctx.fillRect(0, height - 45, width, 45);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#e4e4e7';
    ctx.font = '11px sans-serif';
    ctx.fillText(
      `BK NAILS DESIGN (Studio B&K Nails) · Rio Branco - Acre · WhatsApp: ${salon.bookingWhatsapp}`,
      width / 2,
      height - 20
    );

    // Export as image/jpeg with high quality (0.95)
    return canvas.toDataURL('image/jpeg', 0.95);
  },

  /**
   * Triggers download of the booking voucher directly as a .jpg file
   */
  async downloadBookingJpg(
    booking: Booking,
    salon: SalonInfo,
    consultant?: Consultant | null
  ): Promise<void> {
    const dataUrl = await this.generateBookingJpgDataUrl(booking, salon, consultant);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `comprovante_agendamento_${booking.id}_bk_nails.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
};
