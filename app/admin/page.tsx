'use client';

import { useState } from 'react';
import { Trash2, Plus, Edit, Save, X, LayoutDashboard, LogOut, BookOpen, MapPin, Settings as SettingsIcon, Upload, FileText, LayoutGrid, Home as HomeIcon, List, ChevronRight, ExternalLink } from 'lucide-react';
import { useData, Service, BlogPost, Location, SiteConfig, CustomPage, MenuItem } from '@/app/context/DataContext';

// Tip Tanımlaması: Düzenlenebilir tüm öğelerin birleşimi
type EditableItem = Service | BlogPost | Location | CustomPage | MenuItem | SiteConfig;

// Helper to convert plain text to simple HTML
const convertToHtml = (plainText: string): string => {
  if (!plainText) return '';
  const paragraphs = plainText.split(/\n{2,}/).map(p => {
    const trimmedP = p.trim();
    return trimmedP ? `<p>${trimmedP.replace(/\n/g, '<br/>')}</p>` : '';
  });
  return paragraphs.filter(Boolean).join('');
};

// Helper to convert simple HTML back to plain text for editing
const convertToPlainText = (htmlContent: string): string => {
  if (!htmlContent) return '';
  let plainText = htmlContent.replace(/<br\s*\/?>/gi, '\n');
  plainText = plainText.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n\n');
  return plainText.trim();
};

export default function AdminPanel() {
  const { 
    services, blogPosts, locations, siteConfig, customPages,
    addService, updateService, deleteService, 
    addBlogPost, updateBlogPost, deleteBlogPost,
    addLocation, updateLocation, deleteLocation,
    addPage, updatePage, deletePage,
    updateSiteConfig
  } = useData();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'blog' | 'locations' | 'pages' | 'settings' | 'menu'>('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'home'>('general');
  const [isEditing, setIsEditing] = useState(false);
  
  // TİP GÜVENLİ STATE
  const [currentItem, setCurrentItem] = useState<EditableItem | null>(null); 
  
  const [plainTextContent, setPlainTextContent] = useState<string>(''); 
  const [plainTextFullContent, setPlainTextFullContent] = useState<string>(''); 
  
  const [parentMenuItemId, setParentMenuItemId] = useState<string | null>(null);

  // --- Helpers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentItem((prev) => {
            if (!prev) return null;
            return { ...prev, [field]: reader.result as string };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsFileChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'about', field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentItem((prev) => {
            if (!prev) return null;
            // SiteConfig tipine özgü işlem
            const config = prev as SiteConfig;
            return {
                ...config, 
                [section]: { ...config[section], [field]: reader.result as string }
            };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // TİP GÜVENLİ EDIT HANDLER
  const handleEdit = (item?: EditableItem, parentId: string | null = null) => {
    setPlainTextContent('');
    setPlainTextFullContent('');
    setParentMenuItemId(parentId);

    if (item) {
      setCurrentItem(item);
      // Tip kontrolleri ile içerik doldurma
      if ('content' in item && item.content) {
        setPlainTextContent(convertToPlainText(item.content));
      }
      if ('fullContent' in item && item.fullContent) {
        setPlainTextFullContent(convertToPlainText(item.fullContent));
      }
      if ('about' in item && item.about?.content) { // SiteConfig
          setPlainTextContent(convertToPlainText(item.about.content));
      }
    } else {
      // New Item Defaults
      if (activeTab === 'services') {
        setCurrentItem({ id: '', title: '', category: '', shortDesc: '', iconName: 'Wrench', fullContent: '', tags: [], seoTitle: '', seoDescription: '' } as Service);
      } else if (activeTab === 'blog') {
        setCurrentItem({
          id: '', title: '', excerpt: '', content: '', 
          date: new Date().toISOString().split('T')[0], 
          author: 'Admin', 
          image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600', 
          category: 'Genel',
          isPopular: false,
          seoTitle: '', seoDescription: ''
        } as BlogPost);
      } else if (activeTab === 'locations') {
         setCurrentItem({ id: '', name: '', slug: '', content: '', excerpt: '', image: '', seoTitle: '', seoDescription: '' } as Location);
      } else if (activeTab === 'pages') {
         setCurrentItem({ id: '', title: '', slug: '', content: '', excerpt: '', image: '', seoTitle: '', seoDescription: '' } as CustomPage);
      } else if (activeTab === 'menu') {
         setCurrentItem({ id: '', title: '', url: '#', children: [] } as MenuItem);
      }
    }
    setIsEditing(true);
  };

  const getPublicUrl = (item: EditableItem | null, type: string) => {
      if (!item) return null;
      
      // Ortak özelliklere güvenli erişim için type guard veya 'in' operatörü kullanımı
      let slug = '';
      let id = '';

      if ('slug' in item) slug = item.slug;
      if ('id' in item) id = item.id;

      const finalSlug = slug || id;
      if (!finalSlug) return null;
      
      if (type === 'services') return `/hizmetlerimiz/${finalSlug}`;
      if (type === 'locations') return `/contact/${finalSlug}`;
      if (type === 'blog') return `/blog/${finalSlug}`;
      if (type === 'pages') return `/sayfa/${finalSlug}`;
      return null;
  };

  const handleSave = () => {
    if (!currentItem) return;
    
    // Geçici olarak any kullanarak dinamik işlem yapıyoruz, çünkü tipler farklılaşıyor
    const itemToSave: any = { ...currentItem };

    // 1. Convert Text to HTML
    if (activeTab === 'locations' || activeTab === 'blog' || activeTab === 'pages') {
        itemToSave.content = convertToHtml(plainTextContent);
    }
    if (activeTab === 'services') {
        itemToSave.fullContent = convertToHtml(plainTextFullContent);
    }
    if (activeTab === 'settings' && settingsSubTab === 'home') {
        itemToSave.about.content = convertToHtml(plainTextContent);
    }

    // 2. Ensure Slug/ID generation
    if (!itemToSave.id && !itemToSave.slug) {
        const sourceText = itemToSave.title || itemToSave.name || '';
        const generatedSlug = sourceText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        itemToSave.id = generatedSlug;
        if (['locations', 'pages', 'blog', 'services'].includes(activeTab)) {
            itemToSave.slug = generatedSlug;
        }
    } else if (itemToSave.slug && !itemToSave.id) {
        itemToSave.id = itemToSave.slug;
    } else if (!itemToSave.slug && itemToSave.id) {
        itemToSave.slug = itemToSave.id;
    }

    // 3. Save Logic per Tab
    if (activeTab === 'services') {
      const service = itemToSave as Service;
      const isUpdate = services.some(s => s.id === service.id);
      if (isUpdate) updateService(service);
      else addService(service);

    } else if (activeTab === 'blog') {
      const post = itemToSave as BlogPost;
      const isUpdate = blogPosts.some(p => p.id === post.id);
      if (isUpdate) updateBlogPost(post);
      else addBlogPost(post);

    } else if (activeTab === 'locations') {
      const loc = itemToSave as Location;
      const isUpdate = locations.some(l => l.id === loc.id);
      if (isUpdate) updateLocation(loc);
      else addLocation(loc);

    } else if (activeTab === 'pages') {
        const page = itemToSave as CustomPage;
        const isUpdate = customPages.some(p => p.id === page.id);
        if (isUpdate) updatePage(page);
        else addPage(page);

    } else if (activeTab === 'menu') {
        const menuItem = itemToSave as MenuItem;
        let newMenu = [...siteConfig.menu];
        
        if (parentMenuItemId) {
            const parentIndex = newMenu.findIndex(m => m.id === parentMenuItemId);
            if (parentIndex > -1) {
                const parent = newMenu[parentIndex];
                let children = parent.children || [];
                
                if (menuItem.id) {
                    children = children.map(c => c.id === menuItem.id ? menuItem : c);
                } else {
                    menuItem.id = `sub-${parent.id}-${Date.now()}`;
                    children.push(menuItem);
                }
                newMenu[parentIndex] = { ...parent, children };
            }
        } else {
            if (menuItem.id) {
                newMenu = newMenu.map(m => m.id === menuItem.id ? menuItem : m);
            } else {
                menuItem.id = `nav-${Date.now()}`;
                newMenu.push(menuItem);
            }
        }
        updateSiteConfig({ ...siteConfig, menu: newMenu });
    } else if (activeTab === 'settings') {
       updateSiteConfig(itemToSave as SiteConfig);
       alert('Ayarlar başarıyla kaydedildi!');
       return; 
    }

    // 4. Post-Save Actions
    if (activeTab !== 'menu' && activeTab !== 'dashboard') {
        const publicUrl = getPublicUrl(itemToSave, activeTab);
        if (confirm('İçerik başarıyla kaydedildi!\n\nSayfayı yeni sekmede görüntülemek ister misiniz?')) {
            if(publicUrl) window.open(publicUrl, '_blank');
        }
    }

    setIsEditing(false);
    setCurrentItem(null);
    setPlainTextContent(''); 
    setPlainTextFullContent('');
    setParentMenuItemId(null);
  };

  const handleDelete = (id: string, parentId: string | null = null) => {
    if (confirm('Bu öğeyi silmek istediğinize emin misiniz?')) {
      if (activeTab === 'services') deleteService(id);
      else if (activeTab === 'blog') deleteBlogPost(id);
      else if (activeTab === 'locations') deleteLocation(id);
      else if (activeTab === 'pages') deletePage(id);
      else if (activeTab === 'menu') {
          let newMenu = [...siteConfig.menu];
          if (parentId) {
              const parentIndex = newMenu.findIndex(m => m.id === parentId);
              if (parentIndex > -1) {
                  newMenu[parentIndex].children = newMenu[parentIndex].children?.filter(c => c.id !== id);
              }
          } else {
              newMenu = newMenu.filter(m => m.id !== id);
          }
          updateSiteConfig({ ...siteConfig, menu: newMenu });
      }
    }
  };

  const publicUrl = getPublicUrl(currentItem, activeTab);

  // TİP GÜVENLİ LİSTE SEÇİMİ
  // Listelenecek verileri belirlerken tip dönüşümü yapıyoruz
  const renderList = () => {
      if (activeTab === 'services') return services;
      if (activeTab === 'blog') return blogPosts;
      if (activeTab === 'pages') return customPages;
      if (activeTab === 'locations') return locations;
      return [];
  };

  const currentList = renderList();

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-3xl font-black text-yellow-400 tracking-tight">CMS<span className="text-white">Panel</span></h2>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1 block">İçerik Yönetim Sistemi</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[ 
            { id: 'dashboard', label: 'Özet Paneli', icon: LayoutGrid },
            { id: 'services', label: 'Hizmetler', icon: LayoutDashboard },
            { id: 'pages', label: 'Kurumsal Sayfalar', icon: FileText },
            { id: 'blog', label: 'Blog Yazıları', icon: BookOpen },
            { id: 'locations', label: 'Hizmet Bölgeleri', icon: MapPin },
            { id: 'menu', label: 'Menü Yönetimi', icon: List },
            { id: 'settings', label: 'Site Ayarları', icon: SettingsIcon }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => { 
                  setActiveTab(tab.id as any); 
                  if(tab.id === 'settings') {
                      setCurrentItem(siteConfig);
                      setPlainTextContent(convertToPlainText(siteConfig.about.content));
                  }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id ? 'bg-yellow-400 text-slate-900 shadow-lg translate-x-1' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800 bg-slate-950">
          <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors text-sm w-full font-bold">
            <LogOut className="w-4 h-4" /> Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 lg:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 capitalize tracking-tight">
              {activeTab === 'dashboard' ? 'Genel Bakış' : 
               activeTab === 'menu' ? 'Menü Yapısı' :
               activeTab === 'services' ? 'Hizmet Yönetimi' : 
               activeTab === 'pages' ? 'Sayfa Yönetimi' :
               activeTab === 'blog' ? 'Blog Yönetimi' : 
               activeTab === 'locations' ? 'Bölge Yönetimi' : 'Genel Ayarlar'}
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">
                {activeTab === 'dashboard' ? 'Sitenizin genel durum özeti.' : 'İçerikleri ekleyin, düzenleyin veya silin.'}
            </p>
          </div>
          {activeTab !== 'settings' && activeTab !== 'dashboard' && (
            <button 
                onClick={() => handleEdit()}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95"
            >
                <Plus className="w-6 h-6 text-yellow-400" /> Yeni Ekle
            </button>
          )}
        </div>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[ 
                    { label: 'Toplam Hizmet', count: services.length, icon: LayoutDashboard, color: 'bg-blue-500', desc: 'Aktif hizmet kartı' },
                    { label: 'Kurumsal Sayfa', count: customPages.length, icon: FileText, color: 'bg-purple-500', desc: 'Yayınlanan sayfa' },
                    { label: 'Blog Yazısı', count: blogPosts.length, icon: BookOpen, color: 'bg-orange-500', desc: 'Paylaşılan içerik' },
                    { label: 'Hizmet Bölgesi', count: locations.length, icon: MapPin, color: 'bg-emerald-500', desc: 'Kapsanan lokasyon' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all cursor-default">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                            <h3 className="text-5xl font-black text-slate-800 mb-1">{stat.count}</h3>
                            <span className="text-xs text-slate-400 font-medium">{stat.desc}</span>
                        </div>
                        <div className={`${stat.color} p-5 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* SETTINGS FORM */}
        {activeTab === 'settings' && currentItem && (
           <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
                  <button 
                    onClick={() => setSettingsSubTab('general')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${settingsSubTab === 'general' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    Genel Bilgiler
                  </button>
                  <button 
                    onClick={() => setSettingsSubTab('home')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${settingsSubTab === 'home' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    <HomeIcon className="w-4 h-4 inline-block mr-2 -mt-1"/>
                    Anasayfa İçerikleri
                  </button>
              </div>

              <div className="p-8 lg:p-12 max-w-5xl">
                  {settingsSubTab === 'general' && (
                    <div className="space-y-8 animate-in fade-in">
                        {/* SiteConfig tipi olarak işlem görüyor */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Marka Adı</label>
                                <input type="text" value={(currentItem as SiteConfig).brandName} onChange={(e) => setCurrentItem({...currentItem, brandName: e.target.value} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Marka Soneki</label>
                                <input type="text" value={(currentItem as SiteConfig).brandSuffix} onChange={(e) => setCurrentItem({...currentItem, brandSuffix: e.target.value} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Footer Metni</label>
                            <textarea rows={3} value={(currentItem as SiteConfig).footerText} onChange={(e) => setCurrentItem({...currentItem, footerText: e.target.value} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Adres</label>
                            <input type="text" value={(currentItem as SiteConfig).address} onChange={(e) => setCurrentItem({...currentItem, address: e.target.value} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Telefon</label>
                                <input type="text" value={(currentItem as SiteConfig).phone} onChange={(e) => setCurrentItem({...currentItem, phone: e.target.value} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                                <input type="email" value={(currentItem as SiteConfig).email} onChange={(e) => setCurrentItem({...currentItem, email: e.target.value} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-slate-100">
                            <h4 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2"><Upload className="w-5 h-5"/> Sosyal Medya</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <input type="text" placeholder="Facebook URL" value={(currentItem as SiteConfig).social.facebook} onChange={(e) => setCurrentItem({...currentItem, social: { ...(currentItem as SiteConfig).social, facebook: e.target.value }} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                                <input type="text" placeholder="Instagram URL" value={(currentItem as SiteConfig).social.instagram} onChange={(e) => setCurrentItem({...currentItem, social: { ...(currentItem as SiteConfig).social, instagram: e.target.value }} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                                <input type="text" placeholder="Twitter URL" value={(currentItem as SiteConfig).social.twitter} onChange={(e) => setCurrentItem({...currentItem, social: { ...(currentItem as SiteConfig).social, twitter: e.target.value }} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                        </div>
                    </div>
                  )}

                  {/* HOME PAGE CONTENT SETTINGS */}
                  {settingsSubTab === 'home' && (
                    <div className="space-y-8 animate-in fade-in">
                        <h3 className="text-xl font-black text-slate-800 border-b pb-4">Hakkımızda Alanı Düzenle</h3>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label>
                            <input type="text" value={(currentItem as SiteConfig).about.title} onChange={(e) => setCurrentItem({...currentItem, about: { ...(currentItem as SiteConfig).about, title: e.target.value }} as SiteConfig)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                        </div>
                        
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Hakkımızda Görseli
                            </label>
                            <div className="flex items-start gap-6">
                                <input type="file" accept="image/*" onChange={(e) => handleSettingsFileChange(e, 'about', 'image')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
                                {(currentItem as SiteConfig).about.image && <img src={(currentItem as SiteConfig).about.image} className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-white" alt="Preview" />}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">İçerik Metni</label>
                            <p className="text-xs text-slate-500 mb-2">Paragraflar arası boşluk bırakarak yazın.</p>
                            <textarea rows={10} value={plainTextContent} onChange={(e) => setPlainTextContent(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium text-slate-600" />
                        </div>
                    </div>
                  )}

                  <div className="pt-8 mt-8 border-t border-slate-100">
                    <button onClick={handleSave} className="w-full bg-yellow-400 text-slate-900 font-bold py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                        <Save className="w-6 h-6" /> Tüm Ayarları Kaydet
                    </button>
                  </div>
              </div>
           </div>
        )}

        {/* MENU MANAGEMENT VIEW */}
        {activeTab === 'menu' && (
            <div className="space-y-6">
                {siteConfig.menu?.map((item: MenuItem) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:border-blue-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                                    <List className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                                    <p className="text-xs text-slate-500 font-mono">{item.url}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(undefined, item.id)} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Alt Menü
                                </button>
                                <button onClick={() => handleEdit(item)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                                    Düzenle
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                                    Sil
                                </button>
                            </div>
                        </div>

                        {/* Sub Items */}
                        {item.children && item.children.length > 0 && (
                            <div className="ml-10 space-y-2 border-l-2 border-slate-100 pl-4">
                                {item.children.map((subItem: MenuItem) => (
                                    <div key={subItem.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-sm text-slate-700">{subItem.title}</span>
                                            <span className="text-xs text-slate-400 font-mono">({subItem.url})</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(subItem, item.id)} className="text-blue-600 hover:text-blue-800 p-1">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(subItem.id, item.id)} className="text-red-500 hover:text-red-700 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}

        {/* LIST VIEW (Other Tabs) */}
        {activeTab !== 'settings' && activeTab !== 'dashboard' && activeTab !== 'menu' && (
            <div className="grid grid-cols-1 gap-4">
            {currentList.map((item: Service | BlogPost | Location | CustomPage) => {
                // Her tipte ortak olan veya kontrol edilerek erişilen özellikler
                const title = 'title' in item ? item.title : 'name' in item ? item.name : '';
                const description = 'shortDesc' in item ? item.shortDesc : 'excerpt' in item ? item.excerpt : '';
                const iconName = 'iconName' in item ? item.iconName : null;
                const image = 'image' in item ? item.image : null;
                const category = 'category' in item ? item.category : null;
                const isPopular = 'isPopular' in item ? item.isPopular : false;

                return (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer">
                <div className="flex items-center gap-6">
                    {/* Thumbnails */}
                    {(activeTab === 'blog' || activeTab === 'locations' || activeTab === 'pages') && (
                      image ? (
                        <img src={image} alt="t" className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold">NO IMG</div>
                      )
                    )}
                    
                    {activeTab === 'services' && (
                        iconName?.startsWith('data:') ? (
                            <img src={iconName} className="w-16 h-16 object-contain drop-shadow-md" alt="icon" />
                        ) : (
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900 font-bold text-2xl shadow-inner">
                                {title?.charAt(0)}
                            </div>
                        )
                    )}
                    
                    <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">{title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1 font-medium max-w-md">
                        {description}
                    </p>
                    {activeTab === 'services' && category && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] px-2 py-1 rounded-full mt-2 font-bold uppercase tracking-wide border border-blue-200">
                            {category}
                        </span>
                    )}
                    {activeTab === 'blog' && isPopular && (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 rounded-full mt-2 font-bold uppercase tracking-wide border border-yellow-200">
                            ★ Popüler
                        </span>
                    )}
                    </div>
                </div>
                <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item)} className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                    <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm">
                    <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                </div>
            )
            )}
            </div>
        )}
      </main>

      {/* MODAL */}
      {isEditing && currentItem && activeTab !== 'settings' && activeTab !== 'dashboard' && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                  <h3 className="text-2xl font-black text-slate-800">İçerik Düzenle</h3>
                  <p className="text-sm text-slate-500 font-medium">Detayları aşağıdan güncelleyebilirsiniz.</p>
              </div>
              <div className="flex items-center gap-2">
                  {/* VIEW ON SITE BUTTON */}
                  {publicUrl && (
                      <a 
                        href={publicUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-50 p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-2 text-xs font-bold px-4"
                      >
                        <ExternalLink className="w-4 h-4" /> Sitede Gör
                      </a>
                  )}
                  <button onClick={() => setIsEditing(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            </div> 
            
            <div className="p-8 space-y-8 overflow-y-auto flex-1 bg-slate-50/50">
              
              {/* ---------------- MENU FORM ---------------- */}
              {activeTab === 'menu' && (
                  <>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Menü Başlığı</label>
                        <input 
                        type="text" 
                        value={(currentItem as MenuItem).title} 
                        onChange={(e) => setCurrentItem({...currentItem, title: e.target.value} as MenuItem)}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"
                        placeholder="Örn: Hakkımızda"
                        />
                    </div>
                    
                    <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Link Türü & URL</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <button 
                                onClick={() => setCurrentItem({...currentItem, url: '#'} as MenuItem)}
                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase border-2 transition-colors ${(currentItem as MenuItem).url === '#' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                                Açılır Menü Başlığı (Link Yok)
                            </button>
                            <button 
                                onClick={() => setCurrentItem({...currentItem, url: '/'} as MenuItem)}
                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase border-2 transition-colors ${(currentItem as MenuItem).url !== '#' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                                Sayfa Linki
                            </button>
                        </div>

                        {(currentItem as MenuItem).url !== '#' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Manuel URL</label>
                                    <input 
                                        type="text" 
                                        value={(currentItem as MenuItem).url} 
                                        onChange={(e) => setCurrentItem({...currentItem, url: e.target.value} as MenuItem)}
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-600 outline-none font-mono text-sm"
                                    />
                                </div>
                                
                                <div className="border-t border-slate-100 pt-4">
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Veya Hazır Sayfa Seç:</label>
                                    <select 
                                        onChange={(e) => {
                                            if(e.target.value) setCurrentItem({...currentItem, url: e.target.value, title: e.target.options[e.target.selectedIndex].text.split(' (')[0]} as MenuItem)
                                        }}
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-600 outline-none font-medium"
                                    >
                                        <option value="">-- Seçim Yapın --</option>
                                        <optgroup label="Sayfalar">
                                            {customPages.map(p => <option key={p.id} value={`/sayfa/${p.slug}`}>{p.title}</option>)}
                                        </optgroup>
                                        <optgroup label="Hizmetler">
                                            {services.map(s => <option key={s.id} value={`/hizmetlerimiz/${s.id}`}>{s.title}</option>)}
                                        </optgroup>
                                        <optgroup label="Sabit Linkler">
                                            <option value="/#home">Anasayfa</option>
                                            <option value="/#about">Hakkımızda</option>
                                            <option value="/#services">Hizmetler</option>
                                            <option value="/#blog">Blog</option>
                                            <option value="/#contact">İletişim</option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                  </>
              )}

              {/* ---------------- LOCATIONS FORM ---------------- */}
              {activeTab === 'locations' && (
                  <>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Konum Adı</label>
                        <input 
                        type="text" 
                        value={(currentItem as Location).name} 
                        onChange={(e) => setCurrentItem({...currentItem, name: e.target.value} as Location)}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"
                        placeholder="Örn: Çamlıca Su Tesisatçısı"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">URL Bağlantısı (Slug)</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                            <span className="text-slate-400 mr-1 text-sm font-mono">/contact/</span>
                            <input 
                                type="text" 
                                value={(currentItem as Location).slug || ''} 
                                onChange={(e) => setCurrentItem({...currentItem, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')} as Location)}
                                className="bg-transparent focus:outline-none font-mono text-sm w-full text-blue-700"
                                placeholder="camlica-su-tesisat"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Boş bırakırsanız başlıktan otomatik oluşturulur.</p>
                    </div>
                    
                    <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Kapak Görseli
                        </label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
                        {(currentItem as Location).image && <img src={(currentItem as Location).image} className="mt-4 h-40 w-full object-cover rounded-xl shadow-md" alt="Preview" />}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Özet</label>
                        <textarea rows={2} value={(currentItem as Location).excerpt} onChange={(e) => setCurrentItem({...currentItem, excerpt: e.target.value} as Location)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa İçeriği</label>
                        <p className="text-xs text-slate-500 mb-2">Paragraflar arası boşluk bırakarak düz metin yazın.</p>
                        <textarea rows={8} value={plainTextContent} onChange={(e) => setPlainTextContent(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm text-slate-600" />
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-lg font-bold text-slate-800">SEO Ayarları</h4>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Başlığı (Meta Title)</label>
                            <input type="text" value={(currentItem as Location).seoTitle || ''} onChange={(e) => setCurrentItem({...currentItem, seoTitle: e.target.value} as Location)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru başlığı" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
                            <textarea rows={3} value={(currentItem as Location).seoDescription || ''} onChange={(e) => setCurrentItem({...currentItem, seoDescription: e.target.value} as Location)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru açıklaması" />
                        </div>
                    </div>
                  </>
              )}

              {/* ----------------PAGES FORM ---------------- */}
              {activeTab === 'pages' && (
                  <>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa Başlığı</label>
                        <input 
                        type="text" 
                        value={(currentItem as CustomPage).title} 
                        onChange={(e) => setCurrentItem({...currentItem, title: e.target.value} as CustomPage)}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">URL Bağlantısı (Slug)</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                            <span className="text-slate-400 mr-1 text-sm font-mono">/sayfa/</span>
                            <input 
                                type="text" 
                                value={(currentItem as CustomPage).slug || ''} 
                                onChange={(e) => setCurrentItem({...currentItem, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')} as CustomPage)}
                                className="bg-transparent focus:outline-none font-mono text-sm w-full text-blue-700"
                                placeholder="ornek-sayfa"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Boş bırakırsanız başlıktan otomatik oluşturulur.</p>
                    </div>
                    
                    <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Kapak Görseli
                        </label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
                        {(currentItem as CustomPage).image && <img src={(currentItem as CustomPage).image} className="mt-4 h-40 w-full object-cover rounded-xl shadow-md" alt="Preview" />}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Özet</label>
                        <textarea rows={2} value={(currentItem as CustomPage).excerpt} onChange={(e) => setCurrentItem({...currentItem, excerpt: e.target.value} as CustomPage)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa İçeriği</label>
                        <textarea rows={12} value={plainTextContent} onChange={(e) => setPlainTextContent(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm text-slate-600" />
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-lg font-bold text-slate-800">SEO Ayarları</h4>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Başlığı (Meta Title)</label>
                            <input type="text" value={(currentItem as CustomPage).seoTitle || ''} onChange={(e) => setCurrentItem({...currentItem, seoTitle: e.target.value} as CustomPage)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru başlığı" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
                            <textarea rows={3} value={(currentItem as CustomPage).seoDescription || ''} onChange={(e) => setCurrentItem({...currentItem, seoDescription: e.target.value} as CustomPage)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru açıklaması" />
                        </div>
                    </div>
                  </>
              )}

              {/* ---------------- SERVICES FORM ---------------- */}
              {activeTab === 'services' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Hizmet Başlığı</label>
                        <input type="text" value={(currentItem as Service).title} onChange={(e) => setCurrentItem({...currentItem, title: e.target.value} as Service)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"/>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                        <input 
                            type="text" 
                            value={(currentItem as Service).category || ''} 
                            onChange={(e) => setCurrentItem({...currentItem, category: e.target.value} as Service)} 
                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"
                            placeholder="Örn: Tıkanıklık Açma"
                            list="category-list"
                        />
                        <datalist id="category-list">
                            <option value="Tıkanıklık Açma" />
                            <option value="Su Kaçağı Tespiti" />
                            <option value="Petek Temizliği" />
                            <option value="Altyapı Hizmetleri" />
                            <option value="Temizlik Hizmetleri" />
                        </datalist>
                      </div>
                  </div>

                  <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">URL Bağlantısı (ID/Slug)</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                            <span className="text-slate-400 mr-1 text-sm font-mono">/hizmetlerimiz/</span>
                            <input 
                                type="text" 
                                value={(currentItem as Service).id || ''} 
                                onChange={(e) => setCurrentItem({...currentItem, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')} as Service)}
                                className="bg-transparent focus:outline-none font-mono text-sm w-full text-blue-700"
                                placeholder="tuvalet-tikanikligi"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Değiştirirseniz eski linkler çalışmayabilir.</p>
                  </div>

                  <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                     <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Upload className="w-4 h-4" /> İkon Yükle (SVG/PNG)
                     </label>
                     <div className="flex flex-col gap-4">
                         <label className="cursor-pointer w-fit bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">
                                Dosya Seç
                                <input type="file" accept="image/*,.svg" onChange={(e) => handleFileChange(e, 'iconName')} className="hidden"/>
                         </label>
                         
                         <div className="border-t border-slate-100 pt-4 w-full">
                            <label className="block text-xs font-bold text-slate-400 mb-2">Veya Hazır İkon Seçin:</label>
                            <select 
                                value={(currentItem as Service).iconName?.startsWith('data:') ? '' : (currentItem as Service).iconName}
                                onChange={(e) => setCurrentItem({...currentItem, iconName: e.target.value} as Service)}
                                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-600 outline-none font-medium"
                            >
                                <option value="">-- Özel İkon Yüklü --</option>
                                {['Wrench', 'Droplets', 'Settings', 'Trash2', 'Search', 'HardHat'].map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                         </div>
                     </div>
                     {(currentItem as Service).iconName?.startsWith('data:') && <img src={(currentItem as Service).iconName} className="mt-4 w-16 h-16 object-contain bg-slate-100 rounded-xl p-3 border border-slate-200" alt="Icon Preview" />}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Açıklama</label>
                    <textarea rows={2} value={(currentItem as Service).shortDesc} onChange={(e) => setCurrentItem({...currentItem, shortDesc: e.target.value} as Service)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Detaylı İçerik</label>
                    <textarea rows={6} value={plainTextFullContent} onChange={(e) => setPlainTextFullContent(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm text-slate-600" />
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-lg font-bold text-slate-800">SEO Ayarları</h4>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Başlığı (Meta Title)</label>
                            <input type="text" value={(currentItem as Service).seoTitle || ''} onChange={(e) => setCurrentItem({...currentItem, seoTitle: e.target.value} as Service)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru başlığı" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
                            <textarea rows={3} value={(currentItem as Service).seoDescription || ''} onChange={(e) => setCurrentItem({...currentItem, seoDescription: e.target.value} as Service)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru açıklaması" />
                        </div>
                    </div>
                </>
              )}

              {/* ---------------- BLOG FORM ---------------- */}
              {activeTab === 'blog' && (
                <>
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Yazı Başlığı</label>
                    <input type="text" value={(currentItem as BlogPost).title} onChange={(e) => setCurrentItem({...currentItem, title: e.target.value} as BlogPost)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"/>
                   </div>

                   <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">URL Bağlantısı (Slug)</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                            <span className="text-slate-400 mr-1 text-sm font-mono">/blog/</span>
                            <input 
                                type="text" 
                                value={(currentItem as BlogPost).id || ''} 
                                onChange={(e) => setCurrentItem({...currentItem, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')} as BlogPost)}
                                className="bg-transparent focus:outline-none font-mono text-sm w-full text-blue-700"
                                placeholder="yazi-basligi"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Boş bırakırsanız başlıktan otomatik oluşturulur.</p>
                   </div>
                   
                   <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Kapak Görseli
                        </label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
                        {(currentItem as BlogPost).image && <img src={(currentItem as BlogPost).image} className="mt-4 h-40 w-full object-cover rounded-xl shadow-md" alt="Preview" />}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                        <input type="text" value={(currentItem as BlogPost).category} onChange={(e) => setCurrentItem({...currentItem, category: e.target.value} as BlogPost)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"/>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarih</label>
                        <input type="date" value={(currentItem as BlogPost).date} onChange={(e) => setCurrentItem({...currentItem, date: e.target.value} as BlogPost)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"/>
                      </div>
                   </div>

                   <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <input type="checkbox" id="isPopular" checked={(currentItem as BlogPost).isPopular || false} onChange={(e) => setCurrentItem({...currentItem, isPopular: e.target.checked} as BlogPost)} className="w-5 h-5 text-blue-900 rounded focus:ring-blue-500" />
                      <label htmlFor="isPopular" className="text-sm font-bold text-slate-800 cursor-pointer">Bu yazıyı 'Popüler Bloglar' alanında göster</label>
                   </div>

                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Özet</label>
                    <textarea rows={2} value={(currentItem as BlogPost).excerpt} onChange={(e) => setCurrentItem({...currentItem, excerpt: e.target.value} as BlogPost)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Blog İçeriği</label>
                    <textarea rows={8} value={plainTextContent} onChange={(e) => setPlainTextContent(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm text-slate-600" />
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-lg font-bold text-slate-800">SEO Ayarları</h4>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Başlığı (Meta Title)</label>
                            <input type="text" value={(currentItem as BlogPost).seoTitle || ''} onChange={(e) => setCurrentItem({...currentItem, seoTitle: e.target.value} as BlogPost)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru başlığı" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
                            <textarea rows={3} value={(currentItem as BlogPost).seoDescription || ''} onChange={(e) => setCurrentItem({...currentItem, seoDescription: e.target.value} as BlogPost)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru açıklaması" />
                        </div>
                    </div>
                </>
              )}

            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-200">
                Vazgeç
              </button>
              <button onClick={handleSave} className="px-8 py-3 rounded-xl font-bold bg-yellow-400 text-slate-900 hover:bg-yellow-300 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                <Save className="w-5 h-5" /> Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}