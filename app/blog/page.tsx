import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import client from '@/app/lib/apollo-client';
import { GET_POSTS } from '@/app/lib/queries';

export const revalidate = 60; // 60 saniyede bir yenile

export default async function Blog() {
  let posts: any[] = [];

  try {
    const { data } = await client.query({
      query: GET_POSTS,
    });
    posts = data?.posts?.nodes || [];
  } catch (error) {
    console.error("Blog yazıları çekilemedi:", error);
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <Header />
      
      <div className="bg-blue-900 py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1426024120108-994343e338b3?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <h1 className="text-5xl font-bold relative z-10 mb-4">Blog & Haberler</h1>
        <p className="text-blue-200 relative z-10 max-w-xl mx-auto">Tesisat dünyasından güncel haberler, ipuçları ve çözüm önerileri.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-100 group flex flex-col">
                <div className="h-56 relative overflow-hidden">
                  {post.featuredImage?.node?.sourceUrl ? (
                     <img 
                     src={post.featuredImage.node.sourceUrl} 
                     alt={post.title} 
                     className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                   />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                        Görsel Yok
                    </div>
                  )}
                 
                  <div className="absolute top-4 left-4 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {post.categories?.nodes?.[0]?.name || "Genel"}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author?.node?.name || 'Yönetici'}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-700 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  {/* Excerpt yoksa content'ten üret */}
                  <div className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow"
                     dangerouslySetInnerHTML={{ 
                       __html: post.excerpt || post.content?.substring(0, 150) + '...' 
                     }}
                  />
                  
                  <Link href={`/blog/${post.slug}`} className="mt-auto flex items-center gap-2 text-blue-900 font-bold text-sm hover:text-yellow-500 transition-colors pt-4 border-t border-slate-100">
                    Devamını Oku <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500 py-10">
              <h3 className="text-xl font-bold">Henüz yazı eklenmemiş.</h3>
              <p>WordPress panelinden yeni yazılar ekleyebilirsiniz.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}