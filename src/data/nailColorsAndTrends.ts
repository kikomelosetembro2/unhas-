export interface NailPolishColor {
  id: string;
  name: string;
  code: string;
  hex: string;
  finish: 'Cremoso' | 'Cromado' | 'Glitter' | 'Matte' | 'Gel Vitrificado' | 'Perolado';
  category: 'Nudes & Clássicos' | 'Rosas & Blushes' | 'Pretos & Noturnos' | 'Metálicos & Brilhos' | 'Tons Marcantes';
  description: string;
}

export interface TrendDesign {
  id: string;
  name: string;
  ageGroup: '16-24' | '25-39' | '40-55' | '55+';
  ageGroupLabel: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  imageUrl: string;
  tags: string[];
  recommendedColors: string[];
}

export const NAIL_POLISH_COLORS: NailPolishColor[] = [
  // Rosas & Blushes
  {
    id: 'cor-1',
    name: 'Rosa Blush Suave',
    code: 'BK-01',
    hex: '#fbcfe8',
    finish: 'Gel Vitrificado',
    category: 'Rosas & Blushes',
    description: 'Tom leitoso suave com efeito clean girl e brilho de espelho.',
  },
  {
    id: 'cor-2',
    name: 'Pink Vibrante B&K',
    code: 'BK-02',
    hex: '#ec4899',
    finish: 'Cremoso',
    category: 'Rosas & Blushes',
    description: 'A cor assinatura do nosso ateliê, viva e cheia de personalidade.',
  },
  {
    id: 'cor-3',
    name: 'Rose Gold Shimmer',
    code: 'BK-03',
    hex: '#f472b6',
    finish: 'Perolado',
    category: 'Rosas & Blushes',
    description: 'Pérolas microfinas com reflexos rosê dourados.',
  },
  {
    id: 'cor-4',
    name: 'Magenta Luxo',
    code: 'BK-04',
    hex: '#be185d',
    finish: 'Cremoso',
    category: 'Rosas & Blushes',
    description: 'Tom profundo e aveludado para ocasiões noturnas elegantes.',
  },

  // Nudes & Clássicos
  {
    id: 'cor-5',
    name: 'Branco Renda / Leitoso',
    code: 'BK-05',
    hex: '#ffffff',
    finish: 'Gel Vitrificado',
    category: 'Nudes & Clássicos',
    description: 'Transparência perfeita para francesinhas e efeito ombrê.',
  },
  {
    id: 'cor-6',
    name: 'Nude Areia Natural',
    code: 'BK-06',
    hex: '#e7d8cb',
    finish: 'Cremoso',
    category: 'Nudes & Clássicos',
    description: 'Camelo suave que alonga visualmente as mãos e dedos.',
  },
  {
    id: 'cor-7',
    name: 'Baunilha Glazed',
    code: 'BK-07',
    hex: '#fef3c7',
    finish: 'Perolado',
    category: 'Nudes & Clássicos',
    description: 'Base suave com pó cromado translúcido estilo Hailey Bieber.',
  },

  // Pretos & Noturnos
  {
    id: 'cor-8',
    name: 'Preto Ônix Profundo',
    code: 'BK-08',
    hex: '#09090b',
    finish: 'Cremoso',
    category: 'Pretos & Noturnos',
    description: 'Preto puro pigmentado para traços milimétricos e nail art chic.',
  },
  {
    id: 'cor-9',
    name: 'Vinho Marsala Real',
    code: 'BK-09',
    hex: '#4a0404',
    finish: 'Cremoso',
    category: 'Pretos & Noturnos',
    description: 'Clássico sofisticado de alta densidade e glamour atemporal.',
  },

  // Metálicos & Brilhos
  {
    id: 'cor-10',
    name: 'Cromado Espelhado Prata',
    code: 'BK-10',
    hex: '#e2e8f0',
    finish: 'Cromado',
    category: 'Metálicos & Brilhos',
    description: 'Acabamento espelho líquido feito com pigmento mineral importado.',
  },
  {
    id: 'cor-11',
    name: 'Ouro 24k Foil',
    code: 'BK-11',
    hex: '#eab308',
    finish: 'Glitter',
    category: 'Metálicos & Brilhos',
    description: 'Flocos de folha dourada para aplicações pontuais ou marmorizados.',
  },
  {
    id: 'cor-12',
    name: 'Glitter Holográfico Diamond',
    code: 'BK-12',
    hex: '#cbd5e1',
    finish: 'Glitter',
    category: 'Metálicos & Brilhos',
    description: 'Reflexos de prisma multicor que explodem sob a luz do sol.',
  },
];

export const TREND_DESIGNS: TrendDesign[] = [
  // FAIXA ETÁRIA: 16-24 ANOS (JOVEM & Y2K)
  {
    id: 'trend-1',
    name: 'Aura Nails com Micro-Strass & Coração 3D',
    ageGroup: '16-24',
    ageGroupLabel: 'Jovem & Expressiva (16 a 24 anos)',
    category: 'Y2K & Cyber Chic',
    price: 115.00,
    duration: '1h30min',
    description: 'Degradê radial suave no centro da unha em tom rosa chiclete ou lilás com relevo 3D em formato de coração e pontos de zircônia cintilante.',
    imageUrl: '/src/assets/images/hero_bk_nails_1793339141928.jpg',
    tags: ['Aura Nails', '3D Gel', 'Y2K Trend', 'Micro-strass'],
    recommendedColors: ['Rosa Blush Suave', 'Pink Vibrante B&K', 'Glitter Holográfico Diamond'],
  },
  {
    id: 'trend-2',
    name: 'Chrome Drips Metalizado com Traços Irregulares',
    ageGroup: '16-24',
    ageGroupLabel: 'Jovem & Expressiva (16 a 24 anos)',
    category: 'Cromados Futuristas',
    price: 120.00,
    duration: '1h25min',
    description: 'Gotas de gel em alto-relevo espelhado cromado em prata ou rose gold sobre base translúcida fosca, sucesso absoluto nas redes sociais.',
    imageUrl: '/src/assets/images/nail_reverse_french_1793339143817.jpg',
    tags: ['Cromado 3D', 'Líquido Espelhado', 'Moderna'],
    recommendedColors: ['Cromado Espelhado Prata', 'Preto Ônix Profundo'],
  },

  // FAIXA ETÁRIA: 25-39 ANOS (MODERNA & TRENDSETTER)
  {
    id: 'trend-3',
    name: 'Glazed Donut Nails com Micro Francesinha Orgânica',
    ageGroup: '25-39',
    ageGroupLabel: 'Moderna & Trendsetter (25 a 39 anos)',
    category: 'Clean Girl & Minimalismo',
    price: 105.00,
    duration: '1h15min',
    description: 'O acabamento perolado vitrificado mais desejado do momento, enriquecido com pontas micro-francesas em rosa suave ou dourado minimalista.',
    imageUrl: '/src/assets/images/hero_bk_nails_1793339141928.jpg',
    tags: ['Hailey Bieber', 'Glazed Donut', 'Micro French', 'Elegante'],
    recommendedColors: ['Baunilha Glazed', 'Branco Renda / Leitoso', 'Rose Gold Shimmer'],
  },
  {
    id: 'trend-4',
    name: 'Quartzo Rosa Marmorizado com Veios Dourados',
    ageGroup: '25-39',
    ageGroupLabel: 'Moderna & Trendsetter (25 a 39 anos)',
    category: 'Mármore Realista',
    price: 110.00,
    duration: '1h20min',
    description: 'Pintura aquarelada que reproduz a pedra natural de quartzo rosa com sutis veios dourados em folha de ouro 24k.',
    imageUrl: '/src/assets/images/nail_encapsulated_flowers_1793339144938.jpg',
    tags: ['Mármore Quartzo', 'Folha de Ouro', 'Luxo Contemporâneo'],
    recommendedColors: ['Rosa Blush Suave', 'Ouro 24k Foil', 'Nude Areia Natural'],
  },

  // FAIXA ETÁRIA: 40-55 ANOS (CLÁSSICA & SOFISTICADA)
  {
    id: 'trend-5',
    name: 'Francesinha Reversa em Tons Nude & Linhas Pretas Finas',
    ageGroup: '40-55',
    ageGroupLabel: 'Clássica & Sofisticada (40 a 55 anos)',
    category: 'Alta Precisão',
    price: 125.00,
    duration: '1h30min',
    description: 'Curvatura milimétrica com leito alongado, ponta nobre em preto e traço guia ultra-fino com pincel 000 que expressa sofisticação e autoridade.',
    imageUrl: '/src/assets/images/nail_reverse_french_1793339143817.jpg',
    tags: ['Francesinha Reversa', 'Traços Finos', 'Elegância Executiva'],
    recommendedColors: ['Preto Ônix Profundo', 'Nude Areia Natural', 'Branco Renda / Leitoso'],
  },
  {
    id: 'trend-6',
    name: 'Floral Botânico One Stroke em Tons Nude e Rosé',
    ageGroup: '40-55',
    ageGroupLabel: 'Clássica & Sofisticada (40 a 55 anos)',
    category: 'Mão Livre Autoral',
    price: 120.00,
    duration: '1h35min',
    description: 'Pétalas pintadas delicadamente com sombreado em degradê, folhagens finas e acabamento fosco suave acetinado de extrema classe.',
    imageUrl: '/src/assets/images/nail_floral_freehand_1793339143997.jpg',
    tags: ['One Stroke', 'Floral Nobre', 'Acabamento Acetinado'],
    recommendedColors: ['Rosa Blush Suave', 'Magenta Luxo', 'Nude Areia Natural'],
  },

  // FAIXA ETÁRIA: 55+ ANOS (MATURIDADE ELEGANTE & GLAMOUR)
  {
    id: 'trend-7',
    name: 'Esmaltação Nobre Marsala com Ponto de Luz em Zircônia',
    ageGroup: '55+',
    ageGroupLabel: 'Maturidade Elegante (55+ anos)',
    category: 'Alta Joalheria em Unhas',
    price: 100.00,
    duration: '1h10min',
    description: 'Base em vinho Marsala ultra-pigmentado com cuticulagem russa suave e aplicação pontual de 1 micro-zircônia Swarovski na base da unha anelar.',
    imageUrl: '/src/assets/images/hero_bk_nails_1793339141928.jpg',
    tags: ['Vinho Marsala', 'Ponto de Luz', 'Maturidade Glamour'],
    recommendedColors: ['Vinho Marsala Real', 'Ouro 24k Foil'],
  },
  {
    id: 'trend-8',
    name: 'Leitoso Clássico com Folhagem Dourada Sutil',
    ageGroup: '55+',
    ageGroupLabel: 'Maturidade Elegante (55+ anos)',
    category: 'Clássico Eterno',
    price: 95.00,
    duration: '1h05min',
    description: 'Esmaltação leitosa de alto brilho que rejuvenesce o aspecto das mãos, acompanhada de traço folheado minimalista em ouro na filha única.',
    imageUrl: '/src/assets/images/nail_encapsulated_flowers_1793339144938.jpg',
    tags: ['Unhas Rejuvenescidas', 'Leitoso Chic', 'Durabilidade'],
    recommendedColors: ['Branco Renda / Leitoso', 'Ouro 24k Foil', 'Rosa Blush Suave'],
  },
];
