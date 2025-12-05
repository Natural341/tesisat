import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "Su Tesisatında Sık Yapılan Hatalar",
    excerpt: "Ev sahiplerinin tesisat konusunda en sık yaptığı hataları ve çözüm yollarını derledik. Küçük ihmaller büyük sorunlara yol açabilir.",
    date: "05 Aralık 2023",
    author: "Ahmet Usta",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
    category: "İpuçları"
  },
  {
    id: 2,
    title: "Kırmadan Su Kaçağı Tespiti Nasıl Yapılır?",
    excerpt: "Teknolojik cihazlar sayesinde fayanslarınızı kırmadan su kaçağını noktasal olarak nasıl tespit ediyoruz?",
    date: "02 Aralık 2023",
    author: "Mehmet Usta",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&auto=format&fit=crop",
    category: "Teknoloji"
  },
  {
    id: 3,
    title: "Petek Temizliği Neden Önemlidir?",
    excerpt: "Kış aylarında ısınma sorunu yaşamamak ve faturalarınızı düşürmek için petek temizliğinin önemi.",
    date: "28 Kasım 2023",
    author: "Servis Ekibi",
    image: "https://images.unsplash.com/photo-1521207418485-99c705420785?q=80&w=600&auto=format&fit=crop",
    category: "Isınma"
  }
];

export default function Blog() {
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
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-100 group flex flex-col">
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-700 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                
                <Link href={`#`} className="mt-auto flex items-center gap-2 text-blue-900 font-bold text-sm hover:text-yellow-500 transition-colors pt-4 border-t border-slate-100">
                  Devamını Oku <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
