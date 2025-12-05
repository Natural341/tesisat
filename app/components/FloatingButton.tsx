'use client';

import { Phone } from 'lucide-react';
import { useData } from '@/app/context/DataContext';

export default function FloatingButton() {
  const { siteConfig } = useData();

  return (
    <a 
      href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}
      className="fixed right-4 bottom-8 z-[9999] flex flex-col items-center gap-2 group"
    >
      <div className="relative">
        {/* Pulse Effect */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        
        {/* Button */}
        <div className="relative bg-blue-900 text-white p-4 rounded-full shadow-2xl border-2 border-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all cursor-pointer transform group-hover:scale-110">
          <Phone className="w-6 h-6" />
        </div>
      </div>
      
      {/* Tooltip / Label */}
      <div className="bg-white text-blue-900 text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap">
        Hemen Ara
      </div>
    </a>
  );
}
