import React, { useState } from 'react';
import { Palette, Check, Sparkles, Filter, Info, ArrowRight } from 'lucide-react';
import { NAIL_POLISH_COLORS, NailPolishColor } from '../data/nailColorsAndTrends';

interface ColorPalettePickerProps {
  selectedColors: NailPolishColor[];
  onToggleColor: (color: NailPolishColor) => void;
  onClearColors: () => void;
  onProceedToBooking?: () => void;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  selectedColors,
  onToggleColor,
  onClearColors,
  onProceedToBooking,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  const categories = [
    'Todas',
    'Rosas & Blushes',
    'Nudes & Clássicos',
    'Pretos & Noturnos',
    'Metálicos & Brilhos',
  ];

  const filteredColors = activeCategory === 'Todas'
    ? NAIL_POLISH_COLORS
    : NAIL_POLISH_COLORS.filter((c) => c.category === activeCategory);

  return (
    <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Tabela Oficial de Esmaltação B & K</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-black text-black">
            Cores de Esmalte para seu Orçamento
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Selecione até 3 tons favoritos para combinar com o desenho e estilo artesanal escolhido.
          </p>
        </div>

        {/* Selected colors summary pill */}
        {selectedColors.length > 0 && (
          <div className="flex items-center gap-2 bg-pink-50 p-2.5 rounded-2xl border border-pink-200">
            <div className="flex -space-x-1.5">
              {selectedColors.map((c) => (
                <div
                  key={c.id}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-pink-900">
              {selectedColors.length} {selectedColors.length === 1 ? 'cor escolhida' : 'cores escolhidas'}
            </span>
            <button
              type="button"
              onClick={onClearColors}
              className="text-[11px] text-stone-500 hover:text-black font-semibold ml-1 underline"
            >
              Limpar
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-pink-50 hover:text-pink-700 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Colors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredColors.map((color) => {
          const isSelected = selectedColors.some((c) => c.id === color.id);
          const isWhiteTone = color.hex.toLowerCase() === '#ffffff';

          return (
            <div
              key={color.id}
              onClick={() => onToggleColor(color)}
              className={`group relative p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/30 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-pink-300 hover:shadow-2xs'
              }`}
            >
              {/* Color Swatch Circle */}
              <div className="relative mb-2.5">
                <div
                  className={`w-full h-14 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-102 ${
                    isWhiteTone ? 'border-stone-300' : 'border-black/10'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Code badge */}
                <span className="absolute bottom-1 right-1.5 text-[9px] font-mono font-bold bg-black/70 text-white px-1.5 py-0.5 rounded-sm">
                  {color.code}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-black leading-tight truncate">
                  {color.name}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                  <span>{color.finish}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary & Direct Booking Integration */}
      {selectedColors.length > 0 && (
        <div className="p-4 bg-pink-50/70 rounded-2xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-bold text-stone-900 block">
              Cores selecionadas para seu orçamento:
            </span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {selectedColors.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-pink-200 rounded-lg text-xs font-bold text-black"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name} ({c.finish})
                </span>
              ))}
            </div>
          </div>

          {onProceedToBooking && (
            <button
              type="button"
              onClick={onProceedToBooking}
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs shrink-0 transition-colors"
            >
              <span>Continuar Agendamento</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
