'use client';

import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Footer from "./components/Footer";
import FloatingButton from "./components/FloatingButton";
import PopularBlogs from "./components/PopularBlogs";
import { useData } from '@/app/context/DataContext';

export default function Home() {
  const { siteConfig } = useData();

  return (
    <main className="min-h-screen bg-slate-50 scroll-smooth">
      <Header />
      <Hero />
      
      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] bg-slate-200 rounded-3xl overflow-hidden group shadow-2xl">
             <img 
               src={siteConfig.about.image}
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               alt="Hakkımızda"
             />
             <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/20 transition-colors"></div>
          </div>
          
          <div className="space-y-6">
             <span className="text-yellow-500 font-bold tracking-wider uppercase">Hakkımızda</span>
             <h2 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
               {siteConfig.about.title}
             </h2>
             <div 
                className="text-slate-600 text-lg leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: siteConfig.about.content }}
             />
             <ul className="space-y-4 pt-4">
               {["Garantili İşçilik", "7/24 Acil Destek", "Modern Ekipmanlar"].map((item, i) => (
                 <li key={i} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <span className="text-slate-900 font-bold">{item}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>

      <PopularBlogs />

      <div id="services">
        <Services />
      </div>

      {/* Blog Section - Content managed via Admin and displayed in PopularBlogs or separate page */}
      <div id="blog"></div>
      
      <div id="contact">
        <Footer />
      </div>
      <FloatingButton />
    </main>
  );
}
