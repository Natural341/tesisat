'use client';

import { MapPin, Mail, Facebook, Instagram, Twitter, Phone, Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/app/context/DataContext';

export default function Header() {
  const { siteConfig } = useData();

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
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
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

          {/* Right Side Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a href={`tel:${siteConfig.phone}`} className="bg-yellow-400 text-blue-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white hover:scale-105 transition-all shadow-lg hidden md:block">
              Teklif Al
            </a>
            <Menu className="w-6 h-6 md:hidden cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
}