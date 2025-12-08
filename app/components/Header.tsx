'use client';

import { useState } from 'react';
import { MapPin, Mail, Facebook, Instagram, Twitter, Phone, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/app/context/DataContext';

export default function Header() {
  const { siteConfig } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSubMenu = (id: string) => setOpenSubMenu(openSubMenu === id ? null : id);

  return (
    <header className="bg-blue-900 text-white sticky top-0 z-50 shadow-xl border-b border-blue-800">
      {/* Top Bar (Contact Info) - Hidden on Mobile */}
      <div className="bg-blue-950 py-4 px-6 border-b border-blue-900 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
             <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-yellow-400"/> {siteConfig.address}</div>
             <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
               <Mail className="w-3 h-3 text-yellow-400"/> {siteConfig.email}
             </a>
          </div>
          <div className="flex gap-3">
             <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="w-3 h-3 hover:text-yellow-400 cursor-pointer"/></a>
             <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="w-3 h-3 hover:text-yellow-400 cursor-pointer"/></a>
             <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="w-3 h-3 hover:text-yellow-400 cursor-pointer"/></a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group z-50">
             <div className="bg-yellow-400 p-2 rounded-lg group-hover:scale-105 transition-transform">
               <Phone className="w-6 h-6 text-blue-900" />
             </div>
             <div className="flex flex-col leading-none">
               <span className="text-lg font-bold tracking-tight uppercase">{siteConfig.brandName}</span>
               <span className="text-sm text-yellow-400 font-bold tracking-widest">{siteConfig.brandSuffix}</span>
             </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm uppercase tracking-wide">
            {siteConfig.menu?.map((item) => (
              item.children && item.children.length > 0 ? (
                <div key={item.id} className="relative group">
                  <Link href={item.url} className="flex items-center gap-1 hover:text-yellow-400 transition-colors py-2">
                    {item.title} <ChevronDown className="w-4 h-4" />
                  </Link>
                  <div className="absolute top-full left-0 w-56 bg-white text-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 border-t-4 border-yellow-400 z-50">
                    {item.children.map((subItem) => (
                      <Link key={subItem.id} href={subItem.url} className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-900 border-b border-slate-100 transition-colors last:border-0">
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.id} href={item.url} className="hover:text-yellow-400 transition-colors relative group">
                  {item.title}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                </Link>
              )
            ))}
          </nav>

          {/* Right Side Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <a href={`tel:${siteConfig.phone}`} className="bg-yellow-400 text-blue-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white hover:scale-105 transition-all shadow-lg hidden md:block">
              Teklif Al
            </a>
            <button onClick={toggleMenu} className="md:hidden text-white hover:text-yellow-400 transition-colors z-50">
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-blue-950/95 z-40 backdrop-blur-sm transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-28 px-8 pb-10 overflow-y-auto">
          <nav className="flex flex-col gap-6 text-lg font-bold">
            {siteConfig.menu?.map((item) => (
              <div key={item.id} className="border-b border-blue-900/50 pb-4 last:border-0">
                {item.children && item.children.length > 0 ? (
                  <div>
                    <button onClick={() => toggleSubMenu(item.id)} className="flex items-center justify-between w-full text-white hover:text-yellow-400">
                      {item.title}
                      <ChevronRight className={`w-5 h-5 transition-transform ${openSubMenu === item.id ? 'rotate-90' : ''}`} />
                    </button>
                    {openSubMenu === item.id && (
                      <div className="mt-4 flex flex-col gap-3 pl-4 border-l-2 border-yellow-400 ml-1">
                        {item.children.map((subItem) => (
                          <Link 
                            key={subItem.id} 
                            href={subItem.url} 
                            className="text-blue-200 hover:text-white text-base font-medium"
                            onClick={toggleMenu}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={item.url} className="block text-white hover:text-yellow-400" onClick={toggleMenu}>
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          
          <div className="mt-auto pt-8 space-y-4">
            <a href={`tel:${siteConfig.phone}`} className="block bg-yellow-400 text-blue-900 text-center py-4 rounded-xl font-bold hover:bg-white transition-colors">
              Hemen Ara: {siteConfig.phone}
            </a>
            <div className="flex justify-center gap-6 text-blue-300">
               <a href={siteConfig.social.facebook}><Facebook className="w-6 h-6"/></a>
               <a href={siteConfig.social.instagram}><Instagram className="w-6 h-6"/></a>
               <a href={siteConfig.social.twitter}><Twitter className="w-6 h-6"/></a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}