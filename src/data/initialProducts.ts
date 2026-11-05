import { NailService, SalonInfo, Consultant } from '../types';

// Direct ESM asset imports guaranteed by Vite bundler
import prod1Img from '../assets/images/nail_encapsulated_flowers_1793339144938.jpg';
import prod2Img from '../assets/images/nail_reverse_french_1793339143817.jpg';
import prod3Img from '../assets/images/nail_marble_realistic_1793825714651.jpg';
import prod4Img from '../assets/images/nail_ombre_glitter_1793825714204.jpg';
import prod5Img from '../assets/images/nail_floral_freehand_1793339143997.jpg';
import prod6Img from '../assets/images/nail_chrome_geometric_1793825715489.jpg';
import prod7Img from '../assets/images/nail_thematic_art_1793825730001.jpg';
import prod8Img from '../assets/images/nail_animal_print_1793825715018.jpg';
import prod9Img from '../assets/images/nail_3d_rhinestones_1793825730967.jpg';
import prod10Img from '../assets/images/nail_abstract_metallic_1793825730956.jpg';

import barbaraImg from '../assets/images/consultant_barbara_1793825731470.jpg';
import karlaImg from '../assets/images/consultant_karla_1793825743872.jpg';
import heroImg from '../assets/images/hero_bk_nails_1793339141928.jpg';

export const HERO_IMAGE = heroImg;
export const CONSULTANT_BARBARA_IMAGE = barbaraImg;
export const CONSULTANT_KARLA_IMAGE = karlaImg;

export const PRODUCT_IMAGES_MAP: Record<string, string> = {
  'prod-1': prod1Img,
  'prod-2': prod2Img,
  'prod-3': prod3Img,
  'prod-4': prod4Img,
  'prod-5': prod5Img,
  'prod-6': prod6Img,
  'prod-7': prod7Img,
  'prod-8': prod8Img,
  'prod-9': prod9Img,
  'prod-10': prod10Img,
};

export const SALON_DATA: SalonInfo = {
  name: 'B & K NAILS DESIGNER',
  niche: 'Exclusivamente Pinturas de Unhas Artesanais',
  city: 'Rio Branco',
  state: 'Acre',
  phones: ['(68) 98118-0360', '(68) 98114-2626'],
  bookingWhatsapp: '(68) 98118-0360',
  rawWhatsappNumber: '5568981180360',
  address: 'Rio Branco - Acre',
  pixKey: '68981180360',
  pixReceiver: 'B & K Nails Designer',
  openingHours: 'Segunda a Sábado, das 08h00 às 18h30',
};

export const INITIAL_CONSULTANTS: Consultant[] = [
  {
    id: 'cons-1',
    name: 'Bárbara Designer',
    role: 'Consultora & Nail Designer Sênior',
    specialty: 'Unhas Encapsuladas, Flores Secas e Arte 3D com Pedrarias',
    phone: '(68) 98118-0360',
    imageUrl: barbaraImg,
    active: true,
    shiftHours: '08:00 às 18:30 (Seg a Sáb)',
    bio: 'Mais de 7 anos de experiência em pinturas artesanais de alta precisão, especialista em encapsulamento com flores naturais e pedrarias.',
  },
  {
    id: 'cons-2',
    name: 'Karla Designer',
    role: 'Consultora & Nail Designer Artística',
    specialty: 'Francesinha Reversa, Mármore Realista e Mão Livre',
    phone: '(68) 98114-2626',
    imageUrl: karlaImg,
    active: true,
    shiftHours: '08:00 às 18:30 (Seg a Sáb)',
    bio: 'Especialista em nail art geométrica, traços finos milimétricos com pincel 000, efeitos cromados e aquarela mármore.',
  },
];

export const INITIAL_PRODUCTS: NailService[] = [
  {
    id: 'prod-1',
    name: 'Unha Encapsulada com Glitter e Flores Secas',
    category: 'Encapsulada',
    price: 120.00,
    duration: '1h30min',
    durationMinutes: 90,
    description: 'Técnica de encapsulamento com micro-flores naturais desidratadas, flocos de glitter holográfico dourado e acabamento em gel ultrabrilho com durabilidade superior.',
    imageUrl: prod1Img,
    available: true,
    featured: true,
  },
  {
    id: 'prod-2',
    name: 'Nail Art Francesinha Reversa com Traços Finos',
    category: 'Francesinha',
    price: 100.00,
    duration: '1h20min',
    durationMinutes: 80,
    description: 'Leito estruturado com curvatura C perfeita, sorriso reverso em pink/preto com contorno em traços finos milimétricos desenhados manualmente com pincel 000.',
    imageUrl: prod2Img,
    available: true,
    featured: true,
  },
  {
    id: 'prod-3',
    name: 'Pintura Artesanal Mármore Realista (Par de Unhas)',
    category: 'Mármore',
    price: 85.00,
    duration: '1h00min',
    durationMinutes: 60,
    description: 'Efeito mármore Carrara ou Ônix reproduzido à mão com técnica em aquarela e nuances de folha de ouro ou veios rosados. Preço referente ao par destaque.',
    imageUrl: prod3Img,
    available: true,
  },
  {
    id: 'prod-4',
    name: 'Design de Degradê Ombrê Glitterizado',
    category: 'Degradê',
    price: 90.00,
    duration: '1h10min',
    durationMinutes: 70,
    description: 'Transição suave e impecável do rosa suave ao branco leitoso ou glitter cintilante, com dispersão manual de micropartículas refletoras de luz.',
    imageUrl: prod4Img,
    available: true,
  },
  {
    id: 'prod-5',
    name: 'Pintura Floral Feita à Mão Livre',
    category: 'Mão Livre',
    price: 110.00,
    duration: '1h30min',
    durationMinutes: 90,
    description: 'Flores delicadas, botões de rosas e folhagens botânicas pintadas pétala por pétala com técnica One Stroke e micro-pincéis de alta precisão.',
    imageUrl: prod5Img,
    available: true,
    featured: true,
  },
  {
    id: 'prod-6',
    name: 'Efeito Cromado com Desenho Geométrico Manual',
    category: 'Efeitos',
    price: 95.00,
    duration: '1h15min',
    durationMinutes: 75,
    description: 'Pó espelhado premium em tom pérola ou rosê gold com divisões geométricas minimalistas feitas à mão em preto e finalização em top coat vitrificado.',
    imageUrl: prod6Img,
    available: true,
  },
  {
    id: 'prod-7',
    name: 'Nail Art Temática (Personagens / Estampas)',
    category: 'Mão Livre',
    price: 130.00,
    duration: '1h40min',
    durationMinutes: 100,
    description: 'Pintura artística exclusiva com ilustrações personalizadas, padrões sofisticados de alta costura ou silhuetas autorais pintadas individualmente.',
    imageUrl: prod7Img,
    available: true,
  },
  {
    id: 'prod-8',
    name: 'Pintura com Efeito Animal Print Feito à Mão',
    category: 'Mão Livre',
    price: 85.00,
    duration: '1h00min',
    durationMinutes: 60,
    description: 'Estampa de onça, zebra ou tartaruga em estilo chic moderno sobre base nude translúcida com contornos artesanais em preto profundo e toques dourados.',
    imageUrl: prod8Img,
    available: true,
  },
  {
    id: 'prod-9',
    name: 'Arte 3D em Relevo com Pedrarias Aplicadas',
    category: '3D & Pedraria',
    price: 140.00,
    duration: '1h45min',
    durationMinutes: 105,
    description: 'Escultura tridimensional em gel construtor (laços, conchas ou pétalas 3D) enriquecida com cristais de zircônia e micro-pérolas de fixação ultra-resistente.',
    imageUrl: prod9Img,
    available: true,
    featured: true,
  },
  {
    id: 'prod-10',
    name: 'Pintura Metalizada com Traços Abstratos',
    category: 'Efeitos',
    price: 90.00,
    duration: '1h10min',
    durationMinutes: 70,
    description: 'Linhas orgânicas fluidas em gel foil metalizado ouro e prata sobre base fosca ou brilhante, criando um visual vanguardista e contemporâneo.',
    imageUrl: prod10Img,
    available: true,
  },
];
