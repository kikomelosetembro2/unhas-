import {
  Smartphone,
  Monitor,
  Wifi,
  Battery,
  Signal,
  Grid,
  Calendar,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Award,
} from 'lucide-react';

interface MobileFrameWrapperProps {
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  activeTab: 'catalog' | 'admin' | 'about' | 'loyalty';
  setActiveTab: (tab: 'catalog' | 'admin' | 'about' | 'loyalty') => void;
  onOpenBooking: () => void;
  whatsappNumber: string;
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  isMobilePreview,
  setIsMobilePreview,
  activeTab,
  setActiveTab,
  onOpenBooking,
  whatsappNumber,
  children,
}) => {
  if (!isMobilePreview) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-900/95 py-6 px-4 flex flex-col items-center justify-start">
      {/* Simulation Info Bar above the phone frame */}
      <div className="max-w-md w-full bg-stone-950/90 border border-stone-800 text-white rounded-2xl p-3 mb-4 shadow-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-pink-500 shrink-0" />
          <span className="font-semibold text-stone-200">
            Simulador Mobile B & K Nails
          </span>
        </div>

        <button
          onClick={() => setIsMobilePreview(false)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors text-[11px] font-medium"
        >
          <Monitor className="w-3 h-3 text-pink-400" />
          <span>Voltar para Tela Cheia</span>
        </button>
      </div>

      {/* Realistic Smartphone Chassis */}
      <div className="relative w-full max-w-[410px] rounded-[48px] bg-stone-950 p-3 shadow-2xl ring-1 ring-white/10 border-4 border-stone-800 flex flex-col">
        {/* Smartphone Screen Viewport */}
        <div className="relative w-full bg-white rounded-[38px] overflow-hidden flex flex-col h-[820px] shadow-inner">
          {/* iOS-Style Status Bar */}
          <div className="bg-stone-950 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none shrink-0 z-50">
            <span className="font-semibold text-[13px] tracking-tight">14:30</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-stone-900 border border-stone-800 ml-auto mr-2" />
            </div>

            <div className="flex items-center gap-1.5 text-stone-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Mobile Scrollable Canvas */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative pb-20">
            {children}
          </div>

          {/* Mobile Bottom Navigation Bar (Thumb Zone) */}
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 px-4 py-2 flex items-center justify-around shadow-lg">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex flex-col items-center gap-1 min-w-[48px] transition-colors ${
                activeTab === 'catalog' ? 'text-pink-600' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Catálogo</span>
            </button>

            <button
              onClick={() => setActiveTab('loyalty')}
              className={`flex flex-col items-center gap-1 min-w-[48px] transition-colors ${
                activeTab === 'loyalty' ? 'text-pink-600' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Fidelidade</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="flex flex-col items-center -mt-5 group"
            >
              <div className="w-12 h-12 rounded-full bg-pink-600 group-hover:bg-pink-700 text-white flex items-center justify-center shadow-md shadow-pink-600/30 group-active:scale-95 transition-all">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-pink-600 mt-1">Agendar</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 min-w-[48px] transition-colors ${
                activeTab === 'admin' ? 'text-pink-600' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Admin</span>
            </button>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 min-w-[50px] text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-[10px] font-semibold">WhatsApp</span>
            </a>
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-300 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
