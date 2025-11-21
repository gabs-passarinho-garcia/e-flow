import { useNavigate } from 'react-router-dom';
import type { Station } from '../types';

interface StationDrawerProps {
  station: Station;
  onClose: () => void;
}

export default function StationDrawer({ station, onClose }: StationDrawerProps) {
  const navigate = useNavigate();

  const handleStartCharging = () => {
    // Mantém a lógica de ir para o pagamento
    navigate(`/payment/${station.id}`);
  };

  return (
    <>
      {/* Overlay escuro no fundo (opcional, ajuda no foco) */}
      <div 
        className="fixed inset-0 bg-black/20 z-[1050]" 
        onClick={onClose}
        aria-hidden="true" // Overlay visual, não precisa de foco
      />

      {/* O Drawer em si */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[1100] max-h-[85vh] overflow-y-auto animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="station-name"
      >
        
        {/* Imagem de Capa (Mockada baseada no design) */}
        <div className="w-full h-48 relative">
            <img 
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop" 
              alt="Eletroposto" 
              className="w-full h-full object-cover rounded-t-[32px]"
            />
            {/* Botão Fechar (X) flutuante - CORRIGIDO */}
            <button 
                onClick={onClose}
                aria-label="Fechar detalhes da estação"
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-8 -mt-6 relative bg-white rounded-t-[32px]">
            {/* Handle (tracinho cinza) */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-6" />

            {/* Cabeçalho */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <div>
                        <h2 id="station-name" className="text-2xl font-bold text-gray-900 leading-none mb-1">{station.name}</h2>
                        <p className="text-gray-500 text-xs max-w-[200px]">{station.address}</p>
                    </div>
                </div>
                
                {/* Ações (Bookmark, Share, Menu) - CORRIGIDO */}
                <div className="flex gap-3 text-gray-400">
                    <button aria-label="Salvar estação"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
                    <button aria-label="Compartilhar estação"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
                </div>
            </div>

            {/* Avaliação e Status */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                        <svg key={i} className="w-5 h-5 text-[#FF4C24] fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                    <svg className="w-5 h-5 text-[#FF4C24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>

                <div className="bg-primary-300 px-4 py-1.5 rounded-full text-xs font-bold text-black flex flex-col leading-tight items-end">
                    <span>Status: Normal</span>
                    <span className="text-[10px] font-normal opacity-80">Última Manutenção: Set</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button className="pb-3 border-b-2 border-gray-900 font-semibold text-gray-900 flex-1">Visão Geral</button>
                <button className="pb-3 border-b-2 border-transparent font-medium text-gray-400 flex-1">Avaliações</button>
            </div>

            {/* Lista de Carregadores */}
            <h3 className="font-bold text-gray-500 text-sm mb-4">Carregadores Disponíveis</h3>
            
            <div className="space-y-4 mb-8">
                {/* Item da Lista - Mockado para parecer com o design */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#5B4EFF] flex items-center justify-center text-white font-bold text-xs">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm font-medium">CCS • 180 Kw</span>
                        </div>
                    </div>
                    <div className="bg-primary-400 px-4 py-1 rounded-full text-sm font-bold text-black shadow-sm">
                        1 | 2
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#5B4EFF] flex items-center justify-center text-white font-bold text-xs">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm font-medium">CCS • 90 Kw</span>
                        </div>
                    </div>
                    <div className="bg-[#FF4C24] px-4 py-1 rounded-full text-sm font-bold text-white shadow-sm">
                        2 | 2
                    </div>
                </div>

                <div className="flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#5B4EFF] flex items-center justify-center text-white font-bold text-xs">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm font-medium">CCS • 40 Kw</span>
                        </div>
                    </div>
                    <div className="bg-gray-200 px-4 py-1 rounded-full text-sm font-bold text-gray-500">
                        0 | 2
                    </div>
                </div>
            </div>

            {/* Botão Principal - Já tem texto, então OK */}
            <button 
                onClick={handleStartCharging}
                className="w-full bg-gray-200 text-gray-500 font-bold text-lg py-4 rounded-2xl hover:bg-primary-400 hover:text-black transition-colors shadow-sm"
            >
                Agendar uma Recarga
            </button>

        </div>
      </div>
    </>
  );
}