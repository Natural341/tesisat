'use client';

import Link from 'next/link';
import { Wrench, Droplets, Settings, Trash2, Search, HardHat, ArrowRight } from 'lucide-react';
import { useData } from '@/app/context/DataContext';

// Icon mapping helper
const IconMap: Record<string, React.ElementType> = {
  Wrench: Wrench,
  Droplets: Droplets,
  Settings: Settings,
  Trash2: Trash2,
  Search: Search,
  HardHat: HardHat
};

export default function Services() {
  const { services } = useData();

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'Diğer Hizmetler';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <section className="py-24 bg-slate-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-bold uppercase tracking-wider text-sm">Uzman Çözümler</span>
          <h2 className="text-5xl font-bold text-blue-900 mb-4 mt-2">Profesyonel Hizmetlerimiz</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Eskişehir genelinde modern ekipmanlar ve uzman kadromuzla kırmadan dökmeden garantili hizmet sunuyoruz.
          </p>
        </div>

        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} className="mb-16 last:mb-0">
            <div className="flex items-center gap-4 mb-8">
               <h3 className="text-3xl font-bold text-blue-900">{category}</h3>
               <div className="h-px flex-grow bg-slate-200"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryServices.map((service) => {
                const isCustomIcon = service.iconName?.startsWith('data:');
                const IconComponent = !isCustomIcon ? (IconMap[service.iconName] || Wrench) : null;
                
                return (
                  <div key={service.id} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:border-yellow-400 transition-all group hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                    <div className="bg-blue-50 p-4 rounded-2xl inline-block w-fit mb-6 group-hover:bg-blue-900 transition-colors duration-300">
                      {isCustomIcon ? (
                        <img src={service.iconName} alt={service.title} className="w-8 h-8 object-contain filter group-hover:brightness-0 group-hover:invert-[.8] group-hover:sepia-[.5] group-hover:saturate-[10] group-hover:hue-rotate-[350deg]" />
                      ) : (
                        <IconComponent className="w-8 h-8 text-blue-900 group-hover:text-yellow-400 transition-colors duration-300" />
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-blue-900 mb-3 group-hover:text-blue-700">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                      {service.shortDesc}
                    </p>
                    
                    <Link href={`/hizmetlerimiz/${service.id}`} className="flex items-center gap-2 text-blue-900 font-bold hover:text-yellow-500 transition-colors mt-auto">
                      Detaylı İncele <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}