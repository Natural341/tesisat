import Image from 'next/image';

export default function Hero() {
  return (
    <section id="home" className="relative w-full min-h-[800px] flex items-center overflow-hidden">
      
      {/* Layer 0: Construction Photo Background (Deepest) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Using a reliable placeholder for construction site since local file isn't available yet */}
        <Image 
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop" 
          alt="Construction Site Real" 
          fill
          className="object-cover"
          priority
        />
        {/* Blue Overlay to blend */}
        <div className="absolute inset-0 bg-blue-950/80"></div>
      </div>

      {/* Layer 1: bg_hero.png (Overlay Graphic) */}
      {/* User requested it to be smaller and show the background through transparent parts */}
      <div className="absolute right-0 top-0 w-full h-full z-10 pointer-events-none flex justify-end items-center opacity-40 mix-blend-soft-light">
         <div className="relative w-[80%] h-[80%]">
            <Image 
              src="/bg_hero.png" 
              alt="Overlay Graphic" 
              fill
              className="object-contain object-right"
            />
         </div>
      </div>

      {/* Layer 2: Content (Highest) */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 flex items-center h-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 md:p-14 rounded-3xl max-w-2xl shadow-2xl -mt-32 md:-mt-56">
            <div className="inline-block bg-yellow-400 text-blue-900 px-4 py-1 rounded mb-4 font-bold text-xs tracking-widest uppercase">
              Profesyonel Tesisat Çözümleri
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6 drop-shadow-lg">
              MODERN <br/>
              <span className="text-yellow-400">YAPI</span> & <br/>
              TESİSAT
            </h1>
            
            <p className="text-lg text-gray-200 mb-8 leading-relaxed font-light">
              Eskişehir&apos;in en güvenilir altyapı ve tesisat hizmetleri. 
              Eviniz ve iş yeriniz için kalıcı, garantili ve modern çözümler üretiyoruz.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-yellow-400 text-blue-900 px-8 py-3.5 rounded-lg font-bold hover:bg-white transition-all shadow-lg flex items-center gap-2">
                Hizmetleri Keşfet
              </button>
              <button className="border-2 border-white text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white hover:text-blue-900 transition-all">
                Bize Ulaşın
              </button>
            </div>
        </div>
      </div>
    </section>
  );
}
