'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { initialServices, initialBlogPosts, initialLocations, initialSiteConfig, initialPages } from '../lib/initialData';
import client from '../lib/apollo-client';
import { GET_POSTS, GET_SERVICES, GET_PAGES, GET_LOCATIONS, GET_MENU, GET_PAGE_BY_SLUG } from '../lib/queries';

// --- Types ---
export interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullContent: string;
  iconName: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
  isPopular: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  content?: string; // Rich text HTML
  excerpt?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  children?: MenuItem[];
}

export interface SiteConfig {
  brandName: string;
  brandSuffix: string;
  footerText: string;
  address: string;
  phone: string;
  email: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  about: {
    title: string;
    content: string;
    image: string;
  };
  menu: MenuItem[];
}

interface DataContextType {
  services: Service[];
  blogPosts: BlogPost[];
  locations: Location[];
  customPages: CustomPage[];
  siteConfig: SiteConfig;
  
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  
  addLocation: (location: Location) => void;
  updateLocation: (location: Location) => void;
  deleteLocation: (id: string) => void;

  addPage: (page: CustomPage) => void;
  updatePage: (page: CustomPage) => void;
  deletePage: (id: string) => void;

  updateSiteConfig: (config: SiteConfig) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // DEBUG LOGS
  console.log("DataProvider Rendering...");
  console.log("API URL:", process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
  // END DEBUG LOGS

  const [services, setServices] = useState<Service[]>(initialServices);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [customPages, setCustomPages] = useState<CustomPage[]>(initialPages);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from IndexedDB on mount, then sync with WordPress
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Load Local Data First (Fast UI)
        const savedServices = await get('services');
        const savedBlogs = await get('blogPosts');
        const savedLocations = await get('locations');
        const savedPages = await get('customPages');
        const savedConfig = await get('siteConfig');

        if (savedServices) setServices(savedServices);
        if (savedBlogs) setBlogPosts(savedBlogs);
        if (savedLocations) setLocations(savedLocations);
        if (savedPages) setCustomPages(savedPages);
        if (savedConfig) {
            setSiteConfig({ ...initialSiteConfig, ...savedConfig, about: savedConfig.about || initialSiteConfig.about });
        } else {
            setSiteConfig(initialSiteConfig);
        }

        // 2. Fetch from WordPress (Sync)
        await fetchFromWordPress();

      } catch (err) {
        console.error("Veri yüklenirken hata oluştu:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  async function fetchFromWordPress() {
    try {
      console.log("WordPress'ten veri çekiliyor...");
      
      // Fetch Services
      const { data: servicesData } = await client.query({ query: GET_SERVICES });
      
      if (servicesData?.services?.nodes) {
        const wpServices: Service[] = servicesData.services.nodes.map((node: any) => ({
          id: node.id,
          slug: node.slug,
          title: node.title,
          category: 'Genel',
          shortDesc: node.excerpt?.replace(/<[^>]+>/g, '').slice(0, 100) || node.content?.replace(/<[^>]+>/g, '').slice(0, 100) || '',
          fullContent: node.content,
          iconName: 'wrench', 
          tags: [],
          image: node.featuredImage?.node?.sourceUrl || '',
          seoTitle: node.title,
          seoDescription: node.excerpt?.replace(/<[^>]+>/g, '') || ''
        }));
        setServices(wpServices);
      }

      // Fetch Blog Posts
      const { data: postsData } = await client.query({ query: GET_POSTS });

      if (postsData?.posts?.nodes) {
        const wpPosts: BlogPost[] = postsData.posts.nodes.map((node: any) => ({
          id: node.id,
          slug: node.slug,
          title: node.title,
          excerpt: node.excerpt?.replace(/<[^>]+>/g, '') || '',
          content: node.content,
          date: new Date(node.date).toLocaleDateString('tr-TR'),
          author: node.author?.node?.name || 'Admin',
          image: node.featuredImage?.node?.sourceUrl || '/bg_hero.png',
          category: node.categories?.nodes?.[0]?.name || 'Genel',
          isPopular: false, 
          seoTitle: node.title,
          seoDescription: node.excerpt?.replace(/<[^>]+>/g, '') || ''
        }));
        setBlogPosts(wpPosts);
      }

       // Fetch Locations
       const { data: locationsData } = await client.query({ query: GET_LOCATIONS });
       if (locationsData?.locations?.nodes) {
         const wpLocations: Location[] = locationsData.locations.nodes.map((node: any) => ({
           id: node.id,
           name: node.title,
           slug: node.slug,
           excerpt: node.excerpt?.replace(/<[^>]+>/g, '') || '',
           content: node.content,
           image: node.featuredImage?.node?.sourceUrl || '',
           seoTitle: node.title,
           seoDescription: node.excerpt?.replace(/<[^>]+>/g, '') || ''
         }));
         setLocations(wpLocations);
       }
      
       // Fetch Menu and Settings
       const { data: menuData } = await client.query({ query: GET_MENU });
       
       if (menuData) {
         // 1. Update General Settings
         const { generalSettings } = menuData;
         let newBrandName = siteConfig.brandName;
         let newBrandSuffix = siteConfig.brandSuffix;

         if (generalSettings?.title) {
           const parts = generalSettings.title.split(' - ');
           if (parts.length > 1) {
             newBrandName = parts[0];
             newBrandSuffix = parts[1];
           } else {
             newBrandName = generalSettings.title;
             newBrandSuffix = ''; 
           }
         }

         setSiteConfig(prev => ({
             ...prev,
             brandName: newBrandName !== prev.brandName ? newBrandName : prev.brandName,
             brandSuffix: newBrandSuffix !== prev.brandSuffix ? newBrandSuffix : prev.brandSuffix,
             footerText: generalSettings?.description || prev.footerText,
         }));
         let wpMenuItems: MenuItem[] = [];
         
         if (menuData.menus?.nodes?.length > 0) {
            const wpMenu = menuData.menus.nodes[0];
            
            if (wpMenu.menuItems?.nodes) {
              wpMenuItems = wpMenu.menuItems.nodes
                .filter((item: any) => item.parentId === null) 
                .map((item: any) => ({
                  id: item.id,
                  title: item.label,
                  url: item.uri, 
                  children: item.childItems?.nodes?.map((child: any) => ({
                      id: child.id,
                      title: child.label,
                      url: child.uri
                  })) || []
                }));
            }
            
            // FORCE HOMEPAGE: Sabit Anasayfa öğesi
            const fixedHomeItem: MenuItem = { 
               id: 'nav-fixed-home', 
               title: 'Anasayfa', 
               url: '/' 
            };

            // WP'den gelen "Anasayfa" varsa filtrele (tekrar etmemesi için)
            const filteredWpItems = wpMenuItems.filter(i => 
                i.url !== '/' && 
                i.url !== 'http://localhost:3000/' && 
                i.title.toLowerCase() !== 'anasayfa'
            );

            const finalMenu = [fixedHomeItem, ...filteredWpItems];

            setSiteConfig(prev => ({
                ...prev,
                brandName: newBrandName !== prev.brandName ? newBrandName : prev.brandName,
                brandSuffix: newBrandSuffix !== prev.brandSuffix ? newBrandSuffix : prev.brandSuffix,
                footerText: generalSettings?.description || prev.footerText,
                menu: finalMenu
            }));
         }
       }

       // Fetch Homepage Content (Optional implementation)
       // const { data: homeData } = await client.query({ query: GET_PAGE_BY_SLUG, variables: { slug: '/' } });
       // if (homeData?.page) { ... }

      console.log("WordPress verileri başarıyla yüklendi.");

    } catch (error) {
      console.error("WordPress veri çekme hatası:", error);
      // Hata olsa bile local verilerle devam ediyoruz (Initial data or IndexedDB)
    }
  }


  // Save to IndexedDB whenever state changes
  useEffect(() => {
    if (isLoaded) {
      set('services', services).catch(err => console.error("Services kayıt hatası:", err));
    }
  }, [services, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      set('blogPosts', blogPosts).catch(err => console.error("Blog kayıt hatası:", err));
    }
  }, [blogPosts, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      set('locations', locations).catch(err => console.error("Locations kayıt hatası:", err));
    }
  }, [locations, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      set('customPages', customPages).catch(err => console.error("Pages kayıt hatası:", err));
    }
  }, [customPages, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      set('siteConfig', siteConfig).catch(err => console.error("Config kayıt hatası:", err));
    }
  }, [siteConfig, isLoaded]);

  // --- Service Actions ---
  const addService = (service: Service) => setServices(prev => [...prev, service]);
  const updateService = (updated: Service) => setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  const deleteService = (id: string) => setServices(prev => prev.filter(s => s.id !== id));

  // --- Blog Actions ---
  const addBlogPost = (post: BlogPost) => setBlogPosts(prev => [...prev, post]);
  const updateBlogPost = (updated: BlogPost) => setBlogPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const deleteBlogPost = (id: string) => setBlogPosts(prev => prev.filter(p => p.id !== id));

  // --- Location Actions ---
  const addLocation = (loc: Location) => setLocations(prev => [...prev, loc]);
  const updateLocation = (updated: Location) => setLocations(prev => prev.map(l => l.id === updated.id ? updated : l));
  const deleteLocation = (id: string) => setLocations(prev => prev.filter(l => l.id !== id));

  // --- Page Actions ---
  const addPage = (page: CustomPage) => setCustomPages(prev => [...prev, page]);
  const updatePage = (updated: CustomPage) => setCustomPages(prev => prev.map(p => p.id === updated.id ? updated : p));
  const deletePage = (id: string) => setCustomPages(prev => prev.filter(p => p.id !== id));

  // --- Config Actions ---
  const updateSiteConfig = (config: SiteConfig) => setSiteConfig(config);

  return (
    <DataContext.Provider value={{
      services, blogPosts, locations, siteConfig, customPages,
      addService, updateService, deleteService,
      addBlogPost, updateBlogPost, deleteBlogPost,
      addLocation, updateLocation, deleteLocation,
      addPage, updatePage, deletePage,
      updateSiteConfig
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
