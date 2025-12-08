'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Trash2, Plus, Edit, Save, X, LayoutDashboard, LogOut, BookOpen, MapPin, Settings as SettingsIcon, Upload, FileText, LayoutGrid, Home as HomeIcon, List, ChevronRight, ExternalLink } from 'lucide-react';
import { useData, Service, BlogPost, Location, SiteConfig, CustomPage, MenuItem } from '@/app/context/DataContext';

// ============ TYPE DEFINITIONS ============
type EditableItem = Service | BlogPost | Location | CustomPage | MenuItem | SiteConfig;
type ContentItem = Service | BlogPost | Location | CustomPage;
type TabType = 'dashboard' | 'services' | 'blog' | 'locations' | 'pages' | 'settings' | 'menu';

// Type guards
const isService = (item: EditableItem): item is Service => {
  return 'shortDesc' in item && 'iconName' in item;
};

const isBlogPost = (item: EditableItem): item is BlogPost => {
  return 'author' in item && 'date' in item && 'isPopular' in item;
};

const isLocation = (item: EditableItem): item is Location => {
  return 'name' in item && 'slug' in item && !('title' in item);
};

const isCustomPage = (item: EditableItem): item is CustomPage => {
  return 'title' in item && 'slug' in item && !('author' in item) && !('iconName' in item);
};

const isMenuItem = (item: EditableItem): item is MenuItem => {
  return 'url' in item && 'children' in item;
};

const isSiteConfig = (item: EditableItem): item is SiteConfig => {
  return 'brandName' in item && 'about' in item;
};

const isContentItem = (item: EditableItem): item is ContentItem => {
  return isService(item) || isBlogPost(item) || isLocation(item) || isCustomPage(item);
};

// Yeni isIdentifiable type guard'ı
const isIdentifiable = (x: any): x is { id: string; slug?: string } =>
  !!x && typeof x.id === 'string' && x.id.length > 0;

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
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'home'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<EditableItem | null>(null); 
  const [plainTextContent, setPlainTextContent] = useState<string>(''); 
  const [plainTextFullContent, setPlainTextFullContent] = useState<string>(''); 
  
  const [parentMenuItemId, setParentMenuItemId] = useState<string | null>(null);

  // --- Helpers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Service | keyof BlogPost | keyof Location | keyof CustomPage) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentItem((prev) => {
          if (!prev) return prev;
          return { ...prev, [field]: reader.result as string } as EditableItem;
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
          if (!prev || !isSiteConfig(prev)) return prev;
          return {
            ...prev, 
            [section]: { ...prev[section], [field]: reader.result as string }
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getPublicUrl = (item: ContentItem | null, type: string): string | null => {
    if (!isIdentifiable(item)) return null;

    // item is now narrowed to { id: string; slug?: string }
    const slug = (item.slug && item.slug.length) ? item.slug : item.id;

    if (type === 'services') return `/hizmetlerimiz/${slug}`;
    if (type === 'locations') return `/contact/${slug}`;
    if (type === 'blog') return `/blog/${slug}`;
    if (type === 'pages') return `/sayfa/${slug}`;
    return null;
  };

  const handleEdit = (item?: Service | BlogPost | Location | CustomPage | MenuItem | null, parentId: string | null = null): void => {
    setPlainTextContent('');
    setPlainTextFullContent('');
    setParentMenuItemId(parentId);
    
    if (item) {
        setCurrentItem(item);
        if (activeTab === 'locations' && isLocation(item)) {
            setPlainTextContent(convertToPlainText(item.content || ''));
        } else if (activeTab === 'blog' && isBlogPost(item)) {
            setPlainTextContent(convertToPlainText(item.content || ''));
        } else if (activeTab === 'pages' && isCustomPage(item)) {
            setPlainTextContent(convertToPlainText(item.content || ''));
        } else if (activeTab === 'services' && isService(item)) {
            setPlainTextFullContent(convertToPlainText(item.fullContent || ''));
        }
    } else {
        // New Item Defaults
        if (activeTab === 'services') {
            const newService: Service = { id: '', slug: '', title: '', category: '', shortDesc: '', iconName: 'Wrench', fullContent: '', tags: [], seoTitle: '', seoDescription: '' };
            setCurrentItem(newService);
        } else if (activeTab === 'blog') {
            const newBlogPost: BlogPost = {
                id: '', slug: '', title: '', excerpt: '', content: '', 
                date: new Date().toISOString().split('T')[0], 
                author: 'Admin', 
                image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600', 
                category: 'Genel',
                isPopular: false,
                seoTitle: '', seoDescription: ''
            };
            setCurrentItem(newBlogPost);
        } else if (activeTab === 'locations') {
             const newLocation: Location = { id: '', name: '', slug: '', content: '', excerpt: '', image: '', seoTitle: '', seoDescription: '' };
             setCurrentItem(newLocation);
        } else if (activeTab === 'pages') {
             const newPage: CustomPage = { id: '', title: '', slug: '', content: '', excerpt: '', image: '', seoTitle: '', seoDescription: '' };
             setCurrentItem(newPage);
        } else if (activeTab === 'menu') {
             const newMenuItem: MenuItem = { id: '', title: '', url: '#', children: [] };
             setCurrentItem(newMenuItem);
        }
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentItem) return;

    // Clone the current item for modifications
    let itemToSave = { ...currentItem };

    // 1. Convert Text to HTML based on type
    if (isLocation(itemToSave) || isBlogPost(itemToSave) || isCustomPage(itemToSave)) {
        (itemToSave as Location | BlogPost | CustomPage).content = convertToHtml(plainTextContent);
    }
    if (isService(itemToSave)) {
        itemToSave.fullContent = convertToHtml(plainTextFullContent);
    }
    if (isSiteConfig(itemToSave) && settingsSubTab === 'home') {
        itemToSave.about.content = convertToHtml(plainTextContent);
    }

    // 2. Ensure Slug/ID generation if empty (for new items)
    if (isContentItem(itemToSave)) {
        const contentItem = itemToSave as ContentItem;
        if (!contentItem.id) {
            const sourceText = 'title' in contentItem ? contentItem.title : ('name' in contentItem ? contentItem.name : '');
            const generatedSlug = sourceText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            contentItem.id = generatedSlug;
            if ('slug' in contentItem) {
                (contentItem as Location | CustomPage).slug = generatedSlug;
            }
        }
        itemToSave = contentItem;
    }

    // 3. Save Logic per Tab
    if (activeTab === 'services' && isService(itemToSave)) {
      const isUpdate = services.some(s => s.id === itemToSave.id);
      if (isUpdate) updateService(itemToSave);
      else addService(itemToSave);

    } else if (activeTab === 'blog' && isBlogPost(itemToSave)) {
      const isUpdate = blogPosts.some(p => p.id === itemToSave.id);
      if (isUpdate) updateBlogPost(itemToSave);
      else addBlogPost(itemToSave);

    } else if (activeTab === 'locations' && isLocation(itemToSave)) {
      const isUpdate = locations.some(l => l.id === itemToSave.id);
      if (isUpdate) updateLocation(itemToSave);
      else addLocation(itemToSave);

    } else if (activeTab === 'pages' && isCustomPage(itemToSave)) {
        const isUpdate = customPages.some(p => p.id === itemToSave.id);
        if (isUpdate) updatePage(itemToSave);
        else addPage(itemToSave);

    } else if (activeTab === 'menu' && isMenuItem(itemToSave)) {
        const menuItem = itemToSave;
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
    } else if (activeTab === 'settings' && isSiteConfig(itemToSave)) {
       updateSiteConfig(itemToSave);
       alert('Ayarlar başarıyla kaydedildi!');
       return; 
    }

    // 4. Post-Save Actions
    if (activeTab !== 'menu' && activeTab !== 'dashboard' && activeTab !== 'settings' && isContentItem(itemToSave)) {
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

  // Get public URL for current item (only for content items)
  const publicUrl = currentItem && isContentItem(currentItem) ? getPublicUrl(currentItem, activeTab) : null;

  // Type-safe current item accessors
  const currentService = currentItem && isService(currentItem) ? currentItem : null;
  const currentBlogPost = currentItem && isBlogPost(currentItem) ? currentItem : null;
  const currentLocation = currentItem && isLocation(currentItem) ? currentItem : null;
  const currentPage = currentItem && isCustomPage(currentItem) ? currentItem : null;
  const currentMenuItem = currentItem && isMenuItem(currentItem) ? currentItem : null;
  const currentSiteConfig = currentItem && isSiteConfig(currentItem) ? currentItem : null;

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
            { id: 'dashboard' as const, label: 'Özet Paneli', icon: LayoutGrid },
            { id: 'services' as const, label: 'Hizmetler', icon: LayoutDashboard },
            { id: 'pages' as const, label: 'Kurumsal Sayfalar', icon: FileText },
            { id: 'blog' as const, label: 'Blog Yazıları', icon: BookOpen },
            { id: 'locations' as const, label: 'Hizmet Bölgeleri', icon: MapPin },
            { id: 'menu' as const, label: 'Menü Yönetimi', icon: List },
            { id: 'settings' as const, label: 'Site Ayarları', icon: SettingsIcon }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => { 
                  setActiveTab(tab.id); 
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
        {activeTab === 'settings' && currentSiteConfig && (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Marka Adı</label>
                                <input type="text" value={currentSiteConfig.brandName} onChange={(e) => setCurrentItem({...currentSiteConfig, brandName: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Marka Soneki</label>
                                <input type="text" value={currentSiteConfig.brandSuffix} onChange={(e) => setCurrentItem({...currentSiteConfig, brandSuffix: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Footer Metni</label>
                            <textarea rows={3} value={currentSiteConfig.footerText} onChange={(e) => setCurrentItem({...currentSiteConfig, footerText: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Adres</label>
                            <input type="text" value={currentSiteConfig.address} onChange={(e) => setCurrentItem({...currentSiteConfig, address: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Telefon</label>
                                <input type="text" value={currentSiteConfig.phone} onChange={(e) => setCurrentItem({...currentSiteConfig, phone: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                                <input type="email" value={currentSiteConfig.email} onChange={(e) => setCurrentItem({...currentSiteConfig, email: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-slate-100">
                            <h4 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2"><Upload className="w-5 h-5"/> Sosyal Medya</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <input type="text" placeholder="Facebook URL" value={currentSiteConfig.social.facebook} onChange={(e) => setCurrentItem({...currentSiteConfig, social: { ...currentSiteConfig.social, facebook: e.target.value }})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                                <input type="text" placeholder="Instagram URL" value={currentSiteConfig.social.instagram} onChange={(e) => setCurrentItem({...currentSiteConfig, social: { ...currentSiteConfig.social, instagram: e.target.value }})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                                <input type="text" placeholder="Twitter URL" value={currentSiteConfig.social.twitter} onChange={(e) => setCurrentItem({...currentSiteConfig, social: { ...currentSiteConfig.social, twitter: e.target.value }})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
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
                            <input type="text" value={currentSiteConfig.about.title} onChange={(e) => setCurrentItem({...currentSiteConfig, about: { ...currentSiteConfig.about, title: e.target.value }})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium" />
                        </div>
                        
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Hakkımızda Görseli
                            </label>
                            <div className="flex items-start gap-6">
                                <input type="file" accept="image/*" onChange={(e) => handleSettingsFileChange(e, 'about', 'image')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
                                {currentSiteConfig.about.image && <img src={currentSiteConfig.about.image} className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-white" alt="Preview" />}
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
                                <button onClick={() => handleEdit(null, item.id)} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors flex items-center gap-1">
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

        {/* LIST VIEW - Services */}
        {activeTab === 'services' && (
            <div className="grid grid-cols-1 gap-4">
            {services.map((item: Service) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer">
                <div className="flex items-center gap-6">
                    {item.iconName?.startsWith('data:') ? (
                        <img src={item.iconName} className="w-16 h-16 object-contain drop-shadow-md" alt="icon" />
                    ) : (
                        <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900 font-bold text-2xl shadow-inner">
                            {item.title?.charAt(0)}
                        </div>
                    )}
                    
                    <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1 font-medium max-w-md">
                        {item.shortDesc}
                    </p>
                    {item.category && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] px-2 py-1 rounded-full mt-2 font-bold uppercase tracking-wide border border-blue-200">
                            {item.category}
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
            ))}
            </div>
        )}

        {/* LIST VIEW - Blog */}
        {activeTab === 'blog' && (
            <div className="grid grid-cols-1 gap-4">
            {blogPosts.map((item: BlogPost) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer">
                <div className="flex items-center gap-6">
                    {item.image ? (
                        <img src={item.image} alt="t" className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    ) : (
                        <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold">NO IMG</div>
                    )}
                    
                    <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1 font-medium max-w-md">
                        {item.excerpt}
                    </p>
                    {item.isPopular && (
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
            ))}
            </div>
        )}

        {/* LIST VIEW - Pages */}
        {activeTab === 'pages' && (
            <div className="grid grid-cols-1 gap-4">
            {customPages.map((item: CustomPage) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer">
                <div className="flex items-center gap-6">
                    {item.image ? (
                        <img src={item.image} alt="t" className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    ) : (
                        <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold">NO IMG</div>
                    )}
                    
                    <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1 font-medium max-w-md">
                        {item.excerpt}
                    </p>
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
            ))}
            </div>
        )}

        {/* LIST VIEW - Locations */}
        {activeTab === 'locations' && (
            <div className="grid grid-cols-1 gap-4">
            {locations.map((item: Location) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer">
                <div className="flex items-center gap-6">
                    {item.image ? (
                        <img src={item.image} alt="t" className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    ) : (
                        <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold">NO IMG</div>
                    )}
                    
                    <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">{item.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1 font-medium max-w-md">
                        {item.excerpt}
                    </p>
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
            ))}
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
              {activeTab === 'menu' && currentMenuItem && (
                  <>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Menü Başlığı</label>
                        <input 
                        type="text" 
                        value={currentMenuItem.title} 
                        onChange={(e) => setCurrentItem({...currentMenuItem, title: e.target.value})}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"
                        placeholder="Örn: Hakkımızda"
                        />
                    </div>
                    
                    <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Link Türü & URL</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <button 
                                onClick={() => setCurrentItem({...currentMenuItem, url: '#'})}
                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase border-2 transition-colors ${currentMenuItem.url === '#' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                                Açılır Menü Başlığı (Link Yok)
                            </button>
                            <button 
                                onClick={() => setCurrentItem({...currentMenuItem, url: '/'})}
                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase border-2 transition-colors ${currentMenuItem.url !== '#' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                                Sayfa Linki
                            </button>
                        </div>

                        {currentMenuItem.url !== '#' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Manuel URL</label>
                                    <input 
                                        type="text" 
                                        value={currentMenuItem.url} 
                                        onChange={(e) => setCurrentItem({...currentMenuItem, url: e.target.value})}
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-600 outline-none font-mono text-sm"
                                    />
                                </div>
                                
                                <div className="border-t border-slate-100 pt-4">
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Veya Hazır Sayfa Seç:</label>
                                    <select 
                                        onChange={(e) => {
                                            if(e.target.value) setCurrentItem({...currentMenuItem, url: e.target.value, title: e.target.options[e.target.selectedIndex].text.split(' (')[0]})
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
              {activeTab === 'locations' && currentLocation && (
                  <>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Konum Adı</label>
                        <input 
                        type="text" 
                        value={currentLocation.name} 
                        onChange={(e) => setCurrentItem({...currentLocation, name: e.target.value})}
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
                                value={currentLocation.slug || ''} 
                                onChange={(e) => setCurrentItem({...currentLocation, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')})}
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
                        {currentLocation.image && <img src={currentLocation.image} className="mt-4 h-40 w-full object-cover rounded-xl shadow-md" alt="Preview" />}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Özet</label>
                        <textarea rows={2} value={currentLocation.excerpt} onChange={(e) => setCurrentItem({...currentLocation, excerpt: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" />
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
                            <input type="text" value={currentLocation.seoTitle || ''} onChange={(e) => setCurrentItem({...currentLocation, seoTitle: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru başlığı" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
                            <textarea rows={3} value={currentLocation.seoDescription || ''} onChange={(e) => setCurrentItem({...currentLocation, seoDescription: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru açıklaması" />
                        </div>
                    </div>
                  </>
              )}

              {/* ----------------PAGES FORM ---------------- */}
              {activeTab === 'pages' && currentPage && (
                  <>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa Başlığı</label>
                        <input 
                        type="text" 
                        value={currentPage.title} 
                        onChange={(e) => setCurrentItem({...currentPage, title: e.target.value})}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">URL Bağlantısı (Slug)</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                            <span className="text-slate-400 mr-1 text-sm font-mono">/sayfa/</span>
                            <input 
                                type="text" 
                                value={currentPage.slug || ''} 
                                onChange={(e) => setCurrentItem({...currentPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')})}
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
                        {currentPage.image && <img src={currentPage.image} className="mt-4 h-40 w-full object-cover rounded-xl shadow-md" alt="Preview" />}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Özet</label>
                        <textarea rows={2} value={currentPage.excerpt} onChange={(e) => setCurrentItem({...currentPage, excerpt: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa İçeriği</label>
                        <textarea rows={12} value={plainTextContent} onChange={(e) => setPlainTextContent(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm text-slate-600" />
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-lg font-bold text-slate-800">SEO Ayarları</h4>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Başlığı (Meta Title)</label>
                            <input type="text" value={currentPage.seoTitle || ''} onChange={(e) => setCurrentItem({...currentPage, seoTitle: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru başlığı" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
                            <textarea rows={3} value={currentPage.seoDescription || ''} onChange={(e) => setCurrentItem({...currentPage, seoDescription: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru açıklaması" />
                        </div>
                    </div>
                  </>
              )}

              {/* ---------------- SERVICES FORM ---------------- */}
              {activeTab === 'services' && currentService && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Hizmet Başlığı</label>
                        <input type="text" value={currentService.title} onChange={(e) => setCurrentItem({...currentService, title: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"/>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                        <input 
                            type="text" 
                            value={currentService.category || ''} 
                            onChange={(e) => setCurrentItem({...currentService, category: e.target.value})} 
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
                                value={currentService.id || ''} 
                                onChange={(e) => setCurrentItem({...currentService, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')})}
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
                                value={currentService.iconName?.startsWith('data:') ? '' : currentService.iconName}
                                onChange={(e) => setCurrentItem({...currentService, iconName: e.target.value})}
                                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-blue-600 outline-none font-medium"
                            >
                                <option value="">-- Özel İkon Yüklü --</option>
                                {['Wrench', 'Droplets', 'Settings', 'Trash2', 'Search', 'HardHat'].map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                         </div>
                     </div>
                     {currentService.iconName?.startsWith('data:') && <img src={currentService.iconName} className="mt-4 w-16 h-16 object-contain bg-slate-100 rounded-xl p-3 border border-slate-200" alt="Icon Preview" />}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Açıklama</label>
                    <textarea rows={2} value={currentService.shortDesc} onChange={(e) => setCurrentItem({...currentService, shortDesc: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Detaylı İçerik</label>
                    <textarea rows={6} value={plainTextFullContent} onChange={(e) => setPlainTextFullContent(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm text-slate-600" />
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-lg font-bold text-slate-800">SEO Ayarları</h4>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Başlığı (Meta Title)</label>
                            <input type="text" value={currentService.seoTitle || ''} onChange={(e) => setCurrentItem({...currentService, seoTitle: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru başlığı" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
                            <textarea rows={3} value={currentService.seoDescription || ''} onChange={(e) => setCurrentItem({...currentService, seoDescription: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru açıklaması" />
                        </div>
                    </div>
                </>
              )}

              {/* ---------------- BLOG FORM ---------------- */}
              {activeTab === 'blog' && currentBlogPost && (
                <>
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Yazı Başlığı</label>
                    <input type="text" value={currentBlogPost.title} onChange={(e) => setCurrentItem({...currentBlogPost, title: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"/>
                   </div>

                   <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">URL Bağlantısı (Slug)</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                            <span className="text-slate-400 mr-1 text-sm font-mono">/blog/</span>
                            <input 
                                type="text" 
                                value={currentBlogPost.id || ''} 
                                onChange={(e) => setCurrentItem({...currentBlogPost, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')})}
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
                        {currentBlogPost.image && <img src={currentBlogPost.image} className="mt-4 h-40 w-full object-cover rounded-xl shadow-md" alt="Preview" />}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                        <input type="text" value={currentBlogPost.category} onChange={(e) => setCurrentItem({...currentBlogPost, category: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"/>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tarih</label>
                        <input type="date" value={currentBlogPost.date} onChange={(e) => setCurrentItem({...currentBlogPost, date: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm"/>
                      </div>
                   </div>

                   <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <input type="checkbox" id="isPopular" checked={currentBlogPost.isPopular || false} onChange={(e) => setCurrentItem({...currentBlogPost, isPopular: e.target.checked})} className="w-5 h-5 text-blue-900 rounded focus:ring-blue-500" />
                      <label htmlFor="isPopular" className="text-sm font-bold text-slate-800 cursor-pointer">Bu yazıyı Popüler Bloglar alanında göster</label>
                   </div>

                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Özet</label>
                    <textarea rows={2} value={currentBlogPost.excerpt} onChange={(e) => setCurrentItem({...currentBlogPost, excerpt: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Blog İçeriği</label>
                    <textarea rows={8} value={plainTextContent} onChange={(e) => setPlainTextContent(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm text-slate-600" />
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-lg font-bold text-slate-800">SEO Ayarları</h4>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Başlığı (Meta Title)</label>
                            <input type="text" value={currentBlogPost.seoTitle || ''} onChange={(e) => setCurrentItem({...currentBlogPost, seoTitle: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru başlığı" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
                            <textarea rows={3} value={currentBlogPost.seoDescription || ''} onChange={(e) => setCurrentItem({...currentBlogPost, seoDescription: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none font-medium shadow-sm" placeholder="Arama motoru açıklaması" />
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
