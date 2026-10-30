import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  Calendar,
  Check,
  Info,
  Sparkles,
  Star,
  MessageSquare,
  Quote,
  ThumbsUp,
  Heart,
  Send,
  Award,
} from 'lucide-react';
import { NailService, ProductReview, Testimonial } from '../types';
import { StorageService } from '../services/storage';

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

  // Reviews state
  const [reviewsTrigger, setReviewsTrigger] = useState<number>(0);
  const [reviewingProduct, setReviewingProduct] = useState<NailService | null>(null);
  const [reviewStars, setReviewStars] = useState<number>(5);
  const [reviewHoverStars, setReviewHoverStars] = useState<number>(0);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    StorageService.getTestimonials()
  );
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState<boolean>(false);
  const [testimonialName, setTestimonialName] = useState<string>('');
  const [testimonialService, setTestimonialService] = useState<string>('');
  const [testimonialRating, setTestimonialRating] = useState<number>(5);
  const [testimonialHoverRating, setTestimonialHoverRating] = useState<number>(0);
  const [testimonialComment, setTestimonialComment] = useState<string>('');
  const [testimonialSuccessToast, setTestimonialSuccessToast] = useState<string | null>(null);

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
    const query = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      if (!query) return matchesCategory;

      // Real-time matching primarily by service name, with category/description support
      const matchesName = p.name.toLowerCase().includes(query);
      const matchesCategoryName = p.category.toLowerCase().includes(query);
      const matchesDescription = p.description.toLowerCase().includes(query);

      return matchesCategory && (matchesName || matchesCategoryName || matchesDescription);
    });
  }, [products, selectedCategory, searchQuery]);

  // Product Rating Submissions
  const handleOpenReviewModal = (product: NailService) => {
    setReviewingProduct(product);
    setReviewStars(5);
    setReviewHoverStars(0);
    setReviewName('');
    setReviewComment('');
    setReviewSuccess(false);
  };

  const handleSubmitProductReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingProduct || !reviewName.trim() || !reviewComment.trim()) return;

    StorageService.addReview({
      serviceId: reviewingProduct.id,
      clientName: reviewName.trim(),
      rating: reviewStars,
      comment: reviewComment.trim(),
    });

    setReviewSuccess(true);
    setReviewsTrigger((prev) => prev + 1);

    setTimeout(() => {
      setReviewingProduct(null);
      setReviewSuccess(false);
    }, 1800);
  };

  // Testimonial Submissions
  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialName.trim() || !testimonialComment.trim()) return;

    const chosenService =
      testimonialService.trim() || (products[0] ? products[0].name : 'Pintura Artesanal');

    const created = StorageService.addTestimonial({
      clientName: testimonialName.trim(),
      clientCity: 'Rio Branco - AC',
      serviceName: chosenService,
      rating: testimonialRating,
      comment: testimonialComment.trim(),
    });

    setTestimonials([created, ...testimonials]);
    setIsTestimonialModalOpen(false);
    setTestimonialName('');
    setTestimonialComment('');
    setTestimonialSuccessToast('Depoimento enviado com sucesso! Agradecemos o carinho. 💅💖');
    setTimeout(() => setTestimonialSuccessToast(null), 4000);
  };

  // Helper for rendering star rating icons
  const renderStars = (rating: number, max = 5, sizeClass = 'w-3.5 h-3.5') => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, idx) => {
          const filled = idx < Math.floor(rating);
          return (
            <Star
              key={idx}
              className={`${sizeClass} ${
                filled ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <section id="catalogo" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Toast alert */}
      {testimonialSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-stone-950 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-4 duration-300 border border-stone-800">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{testimonialSuccessToast}</span>
        </div>
      )}

      {/* Title & Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-pink-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Catálogo Exclusivo B & K
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-black text-black mt-1">
            Pinturas & Nail Arts Artesanais
          </h2>
          <p className="text-stone-600 text-sm mt-1 max-w-xl">
            Escolha seu modelo favorito feito com amor e técnica milimétrica. Cada criação é personalizada para o formato das suas unhas.
          </p>
        </div>

        {/* Live Counter Badge */}
        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-3.5 py-1.5 rounded-full shrink-0">
          <span>Catálogo: <b>{products.length}</b> modelos</span>
          <span className="text-stone-300">|</span>
          <span className="text-pink-600 font-bold">{filteredProducts.length} exibidos</span>
        </div>
      </div>

      {/* Campo de Busca por Nome em Tempo Real */}
      <div className="bg-white rounded-2xl border border-pink-100 p-3 sm:p-4 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <label htmlFor="product-name-search" className="sr-only">
              Buscar serviço por nome
            </label>
            <Search className="w-4 h-4 text-pink-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="product-name-search"
              type="text"
              placeholder="Buscar serviço por nome em tempo real (ex: Francesinha, Mármore, Floral, 3D...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-500/20 outline-hidden transition-colors placeholder:text-stone-400 font-medium text-stone-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center text-xs transition-colors"
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-stone-600 shrink-0">
              <span className="bg-pink-50 text-pink-700 font-semibold px-2.5 py-1 rounded-lg border border-pink-200">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-stone-500 hover:text-pink-600 text-xs font-semibold underline underline-offset-2"
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>

        {/* Sugestões rápidas de busca por nome */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-100 flex-wrap text-xs">
          <span className="text-[11px] font-semibold text-stone-500 mr-1">
            Filtro rápido por nome:
          </span>
          {['Encapsulada', 'Francesinha', 'Mármore', 'Degradê', 'Floral', 'Cromado', 'Animal Print', '3D', 'Metalizada'].map(
            (tag) => {
              const isCurrent = searchQuery.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(isCurrent ? '' : tag)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-pink-600 text-white font-bold shadow-2xs'
                      : 'bg-stone-100 hover:bg-pink-50 hover:text-pink-600 text-stone-700 font-medium'
                  }`}
                >
                  {tag}
                </button>
              );
            }
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
          {filteredProducts.map((service) => {
            // Read dynamic rating per product (re-evaluated when reviewsTrigger changes)
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const ratingInfo = StorageService.getProductRating(service.id);
            const reviewsCount = ratingInfo.count;
            const avgRating = ratingInfo.avg;

            return (
              <article
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden border border-pink-100/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-4/3 overflow-hidden bg-pink-50">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/src/assets/images/hero_bk_nails_1793339141928.jpg';
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
                    {/* Top Row: Duration & Details */}
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-pink-600" />
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

                    {/* Product Name */}
                    <h3 className="font-serif text-lg font-black text-black leading-snug group-hover:text-pink-600 transition-colors">
                      {service.name}
                    </h3>

                    {/* 5-Star Rating Component for each product card */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100/70">
                      <div className="flex items-center gap-1.5">
                        {renderStars(avgRating, 5, 'w-3.5 h-3.5')}
                        <span className="text-xs font-bold text-stone-900 font-mono">
                          {avgRating.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          ({reviewsCount} {reviewsCount === 1 ? 'avaliação' : 'avaliações'})
                        </span>
                      </div>

                      {/* Button to submit feedback / review for this nail design */}
                      <button
                        type="button"
                        onClick={() => handleOpenReviewModal(service)}
                        className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
                        title="Deixar sua avaliação e nota sobre este modelo"
                      >
                        <Star className="w-3 h-3 text-pink-500" />
                        <span>Avaliar</span>
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
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
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* SEÇÃO: DEPOIMENTOS E AVALIAÇÕES DE CLIENTES               */}
      {/* ========================================================= */}
      <section className="mt-16 sm:mt-24 pt-12 border-t-2 border-pink-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5" /> Depoimentos & Avaliações
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-black text-black tracking-tight">
              A Experiência B & K Nails Designer
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
              Confira os relatos de clientes que confiam na precisão, durabilidade e acabamento exclusivo das nossas pinturas artesanais em Rio Branco - AC.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Score pill */}
            <div className="bg-stone-950 text-white px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-md">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-pink-400 block">Média Geral</span>
                <span className="text-xl font-black leading-none">4.9 / 5.0</span>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="text-[10px] text-stone-400 mt-0.5">Satisfação Comprovada</span>
              </div>
            </div>

            {/* Leave testimonial button */}
            <button
              type="button"
              onClick={() => setIsTestimonialModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Deixar Depoimento</span>
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-6 border border-pink-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 text-pink-100 group-hover:text-pink-200 transition-colors pointer-events-none">
                <Quote className="w-10 h-10" />
              </div>

              <div>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(test.rating, 5, 'w-4 h-4')}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic relative z-10">
                  "{test.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-black">
                    {test.clientName}
                  </h4>
                  <span className="text-[11px] text-stone-500 block">
                    {test.serviceName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Verificada
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    {test.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODAL: AVALIAR PRODUTO ESPECÍFICO (5 ESTRELAS)            */}
      {/* ========================================================= */}
      {reviewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-pink-600 fill-pink-600" />
                <h3 className="font-serif text-lg font-bold text-black">
                  Avaliar Arte Artesanal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingProduct(null)}
                className="text-stone-400 hover:text-stone-700 text-sm"
              >
                ✕
              </button>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-stone-900">Avaliação Registrada!</h4>
                <p className="text-xs text-stone-500">
                  Obrigada pelo feedback sobre o modelo "{reviewingProduct.name}".
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProductReview} className="space-y-4 mt-4 text-xs sm:text-sm">
                {/* Product Summary */}
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <img
                    src={reviewingProduct.imageUrl}
                    alt={reviewingProduct.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-black text-xs sm:text-sm leading-tight">
                      {reviewingProduct.name}
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      Categoria: {reviewingProduct.category} · R$ {reviewingProduct.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 text-center">
                    Sua nota para este modelo artesanal:
                  </label>
                  <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const active = (reviewHoverStars || reviewStars) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onMouseEnter={() => setReviewHoverStars(starVal)}
                          onMouseLeave={() => setReviewHoverStars(0)}
                          onClick={() => setReviewStars(starVal)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              active
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-center text-[11px] font-bold text-pink-600">
                    {reviewStars === 5 && '★★★★★ Perfeita / Impecável!'}
                    {reviewStars === 4 && '★★★★☆ Excelente trabalho!'}
                    {reviewStars === 3 && '★★★☆☆ Bom acabamento'}
                    {reviewStars === 2 && '★★☆☆☆ Regular'}
                    {reviewStars === 1 && '★☆☆☆☆ Precisa melhorar'}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 text-xs">
                    Seu Nome Completo: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Letícia Oliveira"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-medium"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 text-xs">
                    Seu relato sobre a durabilidade e acabamento: *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Conte o que achou da técnica, traços, durabilidade e brilho..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden resize-none"
                  />
                </div>

                {/* Existing reviews snippet for this product */}
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block mb-2">
                    Outras avaliações deste modelo:
                  </span>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {StorageService.getProductReviews(reviewingProduct.id).slice(0, 3).map((r) => (
                      <div key={r.id} className="p-2 rounded-xl bg-pink-50/50 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800">{r.clientName}</span>
                          <div className="flex text-amber-400">
                            {renderStars(r.rating, 5, 'w-2.5 h-2.5')}
                          </div>
                        </div>
                        <p className="text-stone-600 mt-0.5 italic">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setReviewingProduct(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Avaliação</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DEIXAR DEPOIMENTO GERAL (DEPOIMENTOS E AVALIAÇÕES) */}
      {/* ========================================================= */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-pink-600" />
                <h3 className="font-serif text-lg font-bold text-black">
                  Deixar Depoimento & Avaliação
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTestimonial} className="space-y-4 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 text-center">
                  Como você avalia sua experiência geral na B & K Nails Designer?
                </label>
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const active = (testimonialHoverRating || testimonialRating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onMouseEnter={() => setTestimonialHoverRating(starVal)}
                        onMouseLeave={() => setTestimonialHoverRating(0)}
                        onClick={() => setTestimonialRating(starVal)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            active
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 text-xs">
                  Seu Nome Completo: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz Vasconcelos"
                  value={testimonialName}
                  onChange={(e) => setTestimonialName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 text-xs">
                  Qual serviço ou modelo você realizou?
                </label>
                <select
                  value={testimonialService}
                  onChange={(e) => setTestimonialService(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden text-xs"
                >
                  <option value="">Selecione o serviço (ou digite abaixo)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (R$ {p.price.toFixed(2).replace('.', ',')})
                    </option>
                  ))}
                  <option value="Outro Design Exclusivo">Outro Design Exclusivo</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 text-xs">
                  Seu Depoimento sobre o Atendimento e Resultado: *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Conte como foi ser atendida na B & K Nails, o cuidado com as unhas, a pontualidade e os elogios que recebeu..."
                  value={testimonialComment}
                  onChange={(e) => setTestimonialComment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Depoimento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DETALHES COMPLETOS DO PRODUTO                      */}
      {/* ========================================================= */}
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
