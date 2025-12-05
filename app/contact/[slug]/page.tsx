'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useData, Location } from '@/app/context/DataContext';

export default function LocationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { locations, siteConfig } = useData();
  const location = locations.find((l) => l.slug === slug || l.id === slug) || null;

  // Update SEO metadata
  useEffect(() => {
    if (location) {
      document.title = location.seoTitle || `${location.name} | Kaan Tesisat`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', location.seoDescription || location.excerpt || "");
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = location.seoDescription || location.excerpt || "";
        document.head.appendChild(newMeta);
      }
    }
  }, [location]);

  if (!location && locations.length > 0) {
    return (
       <main className="min-h-screen bg-slate-50">
           <Header />
           <div className="py-32 text-center">
               <h1 className="text-3xl font-bold text-blue-900">Bölge Bulunamadı</h1>
               <Link href="/" className="text-yellow-600 underline mt-4 block">Anasayfaya Dön</Link>
           </div>
           <Footer />
       </main>
    );
  }

  if (!location) return <div className="min-h-screen bg-white flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="bg-slate-50 min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img 
            src={location.image || "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1000"} 
            alt={location.name} 
            className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-blue-900/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 pb-16">
           <div className="max-w-7xl mx-auto px-6">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                 <MapPin className="w-3 h-3"/> Hizmet Bölgesi
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 shadow-black drop-shadow-lg">
                {location.name}
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl font-medium">
                {location.excerpt}
              </p>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Content */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-900 mb-8 transition-colors font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" /> Anasayfaya Dön
                    </Link>

                    <div 
                        className="prose prose-lg prose-slate max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: location.content || '<p>İçerik hazırlanıyor...</p>' }}
                    />
                    
                    {/* CTA Box inside content */}
                    <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-100 flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-blue-900 p-4 rounded-full text-white shrink-0">
                             <Clock className="w-8 h-8" />
                        </div>
                        <div>
                             <h3 className="text-xl font-bold text-blue-900 mb-2">7/24 Acil Tesisat</h3>
                             <p className="text-slate-600 text-sm">
                                {location.name} bölgesinde gece gündüz demeden hizmetinizdeyiz. 
                                Acil durumlarda bize anında ulaşabilirsiniz.
                             </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-yellow-400 sticky top-24">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6">İletişim Bilgileri</h3>
                    
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-900 h-fit">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefon</span>
                                <a href={`tel:${siteConfig.phone}`} className="text-lg font-bold text-blue-900 hover:text-yellow-600 transition-colors block">
                                    {siteConfig.phone}
                                </a>
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Şimdi Açık
                                </span>
                            </div>
                        </li>

                        <li className="flex gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-900 h-fit">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">E-Posta</span>
                                <a href={`mailto:${siteConfig.email}`} className="text-slate-700 hover:text-blue-900 transition-colors break-all">
                                    {siteConfig.email}
                                </a>
                            </div>
                        </li>

                        <li className="flex gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-900 h-fit">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Merkez Adres</span>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    {siteConfig.address}
                                </p>
                            </div>
                        </li>
                    </ul>

                    <a href={`tel:${siteConfig.phone}`} className="mt-8 w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                        <Phone className="w-5 h-5" /> Hemen Ara
                    </a>
                </div>
                
                {/* Service Guarantee Badge */}
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                    <div className="flex items-center gap-3 mb-3">
                         <CheckCircle className="w-6 h-6 text-green-600" />
                         <h4 className="font-bold text-blue-900">%100 Müşteri Memnuniyeti</h4>
                    </div>
                    <p className="text-sm text-slate-600">
                        Yaptığımız tüm işlemlere garanti veriyoruz. Sorun çözülmezse ücret talep etmiyoruz.
                    </p>
                </div>
            </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
