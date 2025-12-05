'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useData, BlogPost } from '@/app/context/DataContext';

export default function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { blogPosts } = useData();
  const post = blogPosts.find((p) => p.id === slug) || null;

  // Update SEO metadata
  useEffect(() => {
    if (post) {
      document.title = post.seoTitle || `${post.title} | Blog`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.seoDescription || post.excerpt);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = post.seoDescription || post.excerpt;
        document.head.appendChild(newMeta);
      }
    }
  }, [post]);

  if (!post && blogPosts.length > 0) {
    return (
       <main className="min-h-screen bg-slate-50">
           <Header />
           <div className="py-32 text-center">
               <h1 className="text-3xl font-bold text-blue-900">Yazı Bulunamadı</h1>
               <Link href="/blog" className="text-yellow-600 underline mt-4 block">Blog Listesine Dön</Link>
           </div>
           <Footer />
       </main>
    );
  }

  if (!post) return <div className="min-h-screen bg-white flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="bg-slate-50 min-h-screen font-sans">
      <Header />
      
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 pb-12">
           <div className="max-w-4xl mx-auto text-white">
              <div className="flex gap-4 mb-4 text-sm font-bold uppercase tracking-wider text-yellow-400">
                 <span>{post.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 shadow-black drop-shadow-lg">{post.title}</h1>
              <div className="flex items-center gap-6 text-sm text-blue-100">
                 <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {post.date}
                 </div>
                 <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> {post.author}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
            
            <Link href="/#blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-900 mb-8 transition-colors font-medium text-sm">
               <ArrowLeft className="w-4 h-4" /> Tüm Yazılara Dön
            </Link>

            <div 
              className="prose prose-lg prose-blue max-w-none prose-headings:text-blue-900 prose-p:text-slate-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Author Box */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
                  {post.author.charAt(0)}
               </div>
               <div>
                  <span className="text-xs text-slate-500 uppercase font-bold">Yazar</span>
                  <h4 className="text-lg font-bold text-blue-900">{post.author}</h4>
               </div>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
