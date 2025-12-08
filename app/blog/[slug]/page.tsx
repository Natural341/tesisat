import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft, ArrowRight, Phone, Clock, ChevronRight } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import client from '@/app/lib/apollo-client';
import { GET_POST_BY_SLUG, GET_POSTS } from '@/app/lib/queries';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { data } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { slug },
    });

    if (!data?.post) return { title: 'Yazı Bulunamadı' };

    return {
      title: data.post.title,
      description: data.post.excerpt?.replace(/<[^>]+>/g, '').slice(0, 160) || `${data.post.title} makalesi.`,
    };
  } catch (e) {
    return { title: 'Blog' };
  }
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let post = null;
  let recentPosts: any[] = [];

  try {
    // 1. Mevcut yazıyı çek
    const { data: postData } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { slug },
    });
    post = postData?.post;

    // 2. Yan menü ve alt kısım için son yazıları çek
    const { data: listData } = await client.query({
      query: GET_POSTS,
    });
    recentPosts = listData?.posts?.nodes || [];

  } catch (error) {
    console.error("Blog verileri çekilemedi:", error);
  }

  if (!post) {
    return notFound();
  }

  // Şu anki yazıyı listeden çıkar (Benzer yazılar için)
  const relatedPosts = recentPosts.filter((p: any) => p.slug !== slug).slice(0, 2);
  // Yan menü için son 5 yazı
  const sidebarPosts = recentPosts.slice(0, 5);

  return (
    <main className="bg-slate-50 min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        {post.featuredImage?.node?.sourceUrl ? (
           <img src={post.featuredImage.node.sourceUrl} alt={post.title} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full bg-blue-900 flex items-center justify-center text-blue-200">Görsel Yok</div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 pb-12">
           <div className="max-w-7xl mx-auto px-6 text-white">
              <div className="flex gap-4 mb-3 text-sm font-bold uppercase tracking-wider text-yellow-400">
                 <span>{post.categories?.nodes?.[0]?.name || 'Blog'}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 shadow-black drop-shadow-lg max-w-4xl">{post.title}</h1>
              <div className="flex items-center gap-6 text-sm text-blue-100">
                 <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString('tr-TR')}
                 </div>
                 <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> {post.author?.node?.name || 'Admin'}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* SIDEBAR (Left Column) */}
        <aside className="lg:col-span-1 space-y-8 order-2 lg:order-1">
          
          {/* Recent Posts Widget */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-blue-900 mb-6 pb-2 border-b-2 border-yellow-400 inline-block">Son Yazılar</h3>
            <div className="space-y-4">
              {sidebarPosts.map((p: any) => (
                <Link 
                  key={p.id} 
                  href={`/blog/${p.slug}`}
                  className={`group flex flex-col gap-1 pb-3 border-b border-slate-100 last:border-0 ${p.slug === slug ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <span className="font-bold text-slate-700 group-hover:text-blue-900 transition-colors text-sm line-clamp-2">
                    {p.title}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(p.date).toLocaleDateString('tr-TR')}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Box */}
          <div className="bg-blue-900 p-8 rounded-xl shadow-lg text-white text-center sticky top-24">
             <Phone className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
             <h4 className="text-lg font-bold mb-2">Acil Tesisatçı mı Lazım?</h4>
             <p className="text-blue-200 mb-6 text-sm">Tıkanıklık ve su kaçağı sorunları için 7/24 hizmetinizdeyiz.</p>
             <a href="tel:05050639742" className="block bg-yellow-400 text-blue-900 font-bold py-3 rounded-lg hover:bg-white transition-colors text-sm">
               HEMEN ARA
             </a>
          </div>

        </aside>

        {/* MAIN CONTENT (Right Column) */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
              
              <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-900 mb-8 transition-colors font-medium text-sm">
                 <ArrowLeft className="w-4 h-4" /> Blog Listesine Dön
              </Link>

              <div 
                className="prose prose-lg prose-blue max-w-none prose-headings:text-blue-900 prose-p:text-slate-600 prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Author Box */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4 bg-slate-50 p-6 rounded-xl">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg shrink-0">
                    {(post.author?.node?.name || 'A').charAt(0)}
                 </div>
                 <div>
                    <span className="text-xs text-slate-500 uppercase font-bold">Yazar Hakkında</span>
                    <h4 className="text-lg font-bold text-blue-900">{post.author?.node?.name || 'Admin'}</h4>
                    <p className="text-sm text-slate-600">Profesyonel tesisat çözümleri ve bilgilendirici içerik yazarı.</p>
                 </div>
              </div>
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
               <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                 <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
                 İlginizi Çekebilir
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {relatedPosts.map((rp: any) => (
                   <Link href={`/blog/${rp.slug}`} key={rp.id} className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all border border-slate-100">
                      <div className="h-48 overflow-hidden relative">
                         {rp.featuredImage?.node?.sourceUrl ? (
                           <img src={rp.featuredImage.node.sourceUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         ) : (
                           <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">Görsel Yok</div>
                         )}
                      </div>
                      <div className="p-6">
                         <h4 className="font-bold text-blue-900 text-lg mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">{rp.title}</h4>
                         <div className="flex items-center text-xs text-slate-500 font-medium">
                            Oku <ChevronRight className="w-3 h-3 ml-1" />
                         </div>
                      </div>
                   </Link>
                 ))}
               </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}