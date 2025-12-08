import { notFound } from 'next/navigation';
import client from '@/app/lib/apollo-client';
import { GET_PAGE_BY_SLUG } from '@/app/lib/queries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingButton from '../components/FloatingButton';

export const revalidate = 60; // Sayfaları 60 saniyede bir yeniden doğrula

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  try {
    const { data } = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: { slug },
    });

    if (!data?.page) {
      return {
        title: 'Sayfa Bulunamadı',
      };
    }

    return {
      title: data.page.title,
      description: data.page.seo?.metaDesc || `${data.page.title} sayfası.`,
    };
  } catch (error) {
    return {
      title: 'Hata',
    };
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  let pageData = null;

  try {
    const { data } = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: { slug },
    });
    pageData = data?.page;
  } catch (error) {
    console.error("Sayfa verisi çekilemedi:", error);
  }

  if (!pageData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <article className="flex-1">
        {/* Eğer öne çıkan görsel varsa Hero gibi göster */}
        {pageData.featuredImage?.node?.sourceUrl && (
          <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
             <img 
               src={pageData.featuredImage.node.sourceUrl} 
               alt={pageData.title} 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight text-center px-4">
                  {pageData.title}
                </h1>
             </div>
          </div>
        )}

        {/* Başlık (Eğer görsel yoksa burada göster) */}
        {!pageData.featuredImage?.node?.sourceUrl && (
           <div className="bg-blue-900 py-16">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{pageData.title}</h1>
              </div>
           </div>
        )}

        {/* Sayfa İçeriği (Elementor veya Gutenberg HTML) */}
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: pageData.content }} 
          />
        </div>
      </article>

      <Footer />
      <FloatingButton />
    </main>
  );
}
