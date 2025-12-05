'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useData, CustomPage } from '@/app/context/DataContext';

export default function PageDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { customPages } = useData();
  const page = customPages.find((p) => p.slug === slug || p.id === slug) || null;

  // Update SEO metadata
  useEffect(() => {
    if (page) {
      document.title = page.seoTitle || `${page.title} | Kurumsal Sayfa`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', page.seoDescription || page.excerpt);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = page.seoDescription || page.excerpt;
        document.head.appendChild(newMeta);
      }
    }
  }, [page]);

  if (!page && customPages.length > 0) {
    return (
       <main className="min-h-screen bg-slate-50">
           <Header />
           <div className="py-32 text-center">
               <h1 className="text-3xl font-bold text-blue-900">Sayfa Bulunamadı</h1>
               <Link href="/" className="text-yellow-600 underline mt-4 block">Anasayfaya Dön</Link>
           </div>
           <Footer />
       </main>
    );
  }

  if (!page) return <div className="min-h-screen bg-white flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="bg-slate-50 min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <img 
            src={page.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000"} 
            alt={page.title} 
            className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-blue-900/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 pb-16">
           <div className="max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 shadow-black drop-shadow-lg">
                {page.title}
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl font-medium">
                {page.excerpt}
              </p>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-16 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-900 mb-8 transition-colors font-medium text-sm">
                <ArrowLeft className="w-4 h-4" /> Anasayfaya Dön
            </Link>

            <div 
                className="prose prose-lg prose-slate max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </div>
      </div>

      <Footer />
    </main>
  );
}
