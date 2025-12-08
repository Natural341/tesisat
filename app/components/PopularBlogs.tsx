'use client';

import Link from 'next/link';
import { useData } from '@/app/context/DataContext';
import { ArrowRight, Calendar } from 'lucide-react';

export default function PopularBlogs() {
  const { blogPosts } = useData();
  
  // Filter for popular blogs or just take the first 3
  const popularPosts = blogPosts.filter(post => post.isPopular).slice(0, 3);
  
  // If no popular posts tagged, take the latest 3
  const displayPosts = popularPosts.length > 0 ? popularPosts : blogPosts.slice(0, 3);

  if (displayPosts.length === 0) return null;

  return (
    <section className="py-20 bg-blue-50 relative overflow-hidden">
       {/* Decorative Bg */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

       <div className="max-w-7xl mx-auto px-6 relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-yellow-600 font-bold uppercase tracking-wider text-sm">Bilgi Köşesi</span>
              <h2 className="text-4xl font-bold text-blue-900 mt-2">Popüler İçerikler</h2>
            </div>
            <Link href="/#blog" className="text-blue-900 font-bold hover:text-yellow-600 flex items-center gap-2 transition-colors">
               Tümünü Gör <ArrowRight className="w-4 h-4" />
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-blue-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-yellow-500 uppercase">{post.category}</span>
                  <h3 className="text-xl font-bold text-blue-900 mt-2 mb-3 group-hover:text-blue-700 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
         </div>
       </div>
    </section>
  );
}
