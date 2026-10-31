import React, { useState, useMemo } from 'react';
import { Search, Clock, Calendar, Check, Info, Sparkles } from 'lucide-react';
import { NailService } from '../types';

interface ProductCatalogProps {
  products: NailService[];
  onSelectService: (service: NailService) => void;
  onOpenBooking: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectService,
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailProduct, setDetailProduct] = useState<NailService | null>(null);

  const categories = useMemo(() => {
    const list = ['Todas'];
    products.forEach((p) => {
      if (!list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="catalogo" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Title & Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-pink-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
            Catálogo Exclusivo
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-black text-black mt-1">
            Pinturas & Nail Arts Artesanais
          </h2>
          <p className="text-stone-600 text-sm mt-1 max-w-xl">
            Escolha seu modelo favorito feito com amor e técnica milimétrica. Cada criação é personalizada para o formato das suas unhas.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar modelo ou estilo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden transition-all placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills / Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-pink-300 hover:text-pink-600'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-pink-100 p-8">
          <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-stone-900">Nenhum modelo encontrado</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Não encontramos itens com o termo "{searchQuery}". Tente pesquisar por outro nome ou selecione outra categoria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todas');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((service) => (
            <article
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-pink-100/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-4/3 overflow-hidden bg-pink-50">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to hero image if a specific URL has issues
                    (e.target as HTMLImageElement).src = '/src/assets/images/hero_bk_nails_1793339141928.jpg';
                  }}
                />

                {/* Category tag */}
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                  {service.category}
                </div>

                {/* Availability tag */}
                {!service.available && (
                  <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      Indisponível Temporariamente
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {service.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDetailProduct(service)}
                      className="text-stone-500 hover:text-pink-600 flex items-center gap-1 text-[11px] font-medium underline underline-offset-2"
                    >
                      <Info className="w-3 h-3" /> Detalhes
                    </button>
                  </div>

                  <h3 className="font-serif text-lg font-black text-black leading-snug group-hover:text-pink-600 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Card Footer: Price & Booking Action */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                      A partir de
                    </span>
                    <span className="text-lg font-bold text-pink-600 font-sans tabular-nums">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!service.available}
                    onClick={() => {
                      onSelectService(service);
                      onOpenBooking();
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      service.available
                        ? 'bg-stone-950 hover:bg-pink-600 text-white shadow-xs active:scale-95'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>Agendar</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-pink-100 animate-in fade-in duration-200">
            <div className="relative aspect-16/10">
              <img
                src={detailProduct.imageUrl}
                alt={detailProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setDetailProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-950/70 text-white flex items-center justify-center hover:bg-stone-950 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {detailProduct.category}
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-serif text-2xl font-bold text-stone-950">
                {detailProduct.name}
              </h3>

              <div className="flex items-center gap-4 text-xs text-stone-500 mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-pink-600" /> Duração estimada: {detailProduct.duration}
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">100% Manual</span>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-pink-50/60 border border-pink-100 text-xs sm:text-sm text-stone-700 leading-relaxed">
                {detailProduct.description}
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-100">
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Valor do investimento</span>
                  <span className="text-2xl font-bold text-pink-600 tabular-nums">
                    R$ {detailProduct.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const chosen = detailProduct;
                    setDetailProduct(null);
                    onSelectService(chosen);
                    onOpenBooking();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Este Modelo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
