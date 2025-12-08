'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, CheckCircle } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useData } from '@/app/context/DataContext';

export default function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { services } = useData();
  const service = services.find((s) => s.slug === slug);

  // Update SEO metadata
  useEffect(() => {
    if (service) {
      document.title = service.seoTitle || `${service.title} | Kaan Tesisat`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', service.seoDescription || service.shortDesc);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = service.seoDescription || service.shortDesc;
        document.head.appendChild(newMeta);
      }
    }
  }, [service]);

  // Loading or Not Found state
  if (!service && services.length > 0) {
     // If services loaded but id not found
     return (
        <main className="min-h-screen bg-slate-50">
            <Header />
            <div className="py-32 text-center">
                <h1 className="text-3xl font-bold text-blue-900">Hizmet Bulunamadı</h1>
                <Link href="/" className="text-yellow-600 underline mt-4 block">Anasayfaya Dön</Link>
            </div>
            <Footer />
        </main>
     );
  }
  
  if (!service) return <div className="min-h-screen bg-white flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="bg-slate-50 min-h-screen font-sans">
      <Header />
      
      {/* Page Header */}
      <div className="bg-blue-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{service.title}</h1>
          <div className="flex justify-center gap-2 text-blue-200 text-sm font-medium">
            <Link href="/" className="hover:text-yellow-400">Anasayfa</Link> 
            <span>/</span> 
            <Link href="/#services" className="hover:text-yellow-400">Hizmetlerimiz</Link>
            <span>/</span>
            <span className="text-yellow-400">{service.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-blue-900 mb-6 pb-2 border-b-2 border-yellow-400 inline-block">Hizmetlerimiz</h3>
            <nav className="space-y-2">
              {services.map((s) => (
                <Link 
                  key={s.id} 
                  href={`/hizmetlerimiz/${s.slug}`}
                  className={`block p-3 rounded-lg transition-all text-sm font-medium flex justify-between items-center ${s.slug === slug ? 'bg-blue-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600 hover:text-blue-900 hover:translate-x-1'}`}
                >
                  {s.title}
                  {s.slug === slug && <ArrowRight className="w-4 h-4" />}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick Contact Box */}
          <div className="bg-blue-900 p-8 rounded-xl shadow-lg text-white text-center">
             <Phone className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
             <h4 className="text-xl font-bold mb-2">Acil Tesisatçı mı Lazım?</h4>
             <p className="text-blue-200 mb-6 text-sm">7/24 Hızlı ve güvenilir servis hizmeti için hemen arayın.</p>
             <a href="tel:05050639742" className="block bg-yellow-400 text-blue-900 font-bold py-3 rounded-lg hover:bg-white transition-colors">
               0505 063 97 42
             </a>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
            <div 
              className="prose prose-lg prose-blue max-w-none prose-headings:text-blue-900 prose-p:text-slate-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: service.fullContent }}
            />
            
            {/* Features / Tags */}
            <div className="mt-8 pt-8 border-t border-slate-100">
               <h4 className="text-lg font-bold text-blue-900 mb-4">Hizmet Özellikleri</h4>
               <div className="flex flex-wrap gap-3">
                 {service.tags?.map((tag: string, index: number) => (
                   <span key={index} className="bg-blue-50 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                     <CheckCircle className="w-4 h-4 text-yellow-500" />
                     {tag}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>

      </div>
      
      <Footer />
    </main>
  );
}
