'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { initialServices, initialBlogPosts, initialLocations, initialSiteConfig, initialPages } from '../lib/initialData';

// --- Types ---
export interface Service {
  id: string;
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
  const [services, setServices] = useState<Service[]>(initialServices);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [customPages, setCustomPages] = useState<CustomPage[]>(initialPages);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from IndexedDB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const savedServices = await get('services');
        const savedBlogs = await get('blogPosts');
        const savedLocations = await get('locations');
        const savedPages = await get('customPages');
        const savedConfig = await get('siteConfig');

        if (savedServices) setServices(savedServices);
        if (savedBlogs) setBlogPosts(savedBlogs);
        if (savedLocations) setLocations(savedLocations);
        if (savedPages) setCustomPages(savedPages);
        // Merge saved config with initial config to ensure new fields (like 'about') exist
        if (savedConfig) {
            setSiteConfig({ ...initialSiteConfig, ...savedConfig, about: savedConfig.about || initialSiteConfig.about });
        } else {
            setSiteConfig(initialSiteConfig);
        }
      } catch (err) {
        console.error("Veri yüklenirken hata oluştu:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

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