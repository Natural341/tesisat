'use client';

import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/app/context/DataContext';

export default function Footer() {
  const { siteConfig, locations, services } = useData();

  return (
    <footer className="bg-blue-950 text-white pt-20 pb-10 border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-yellow-400 uppercase tracking-wider">
              {siteConfig.brandName} <br/> <span className="text-white">{siteConfig.brandSuffix}</span>
            </h3>
            <p className="text-blue-200 leading-relaxed">
              {siteConfig.footerText}
            </p>
            <div className="flex gap-4">
              <a href={siteConfig.social.facebook} className="bg-blue-900 p-2 rounded-lg hover:bg-yellow-400 hover:text-blue-950 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={siteConfig.social.instagram} className="bg-blue-900 p-2 rounded-lg hover:bg-yellow-400 hover:text-blue-950 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={siteConfig.social.twitter} className="bg-blue-900 p-2 rounded-lg hover:bg-yellow-400 hover:text-blue-950 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hizmet Bölgeleri (New Dynamic Section) */}
          <div>
            <h4 className="text-xl font-bold mb-6 border-b-2 border-yellow-400 inline-block pb-2">Hizmet Bölgelerimiz</h4>
            <ul className="space-y-3 text-blue-200">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <Link href={`/contact/${loc.slug}`} className="hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm">
                    <ArrowRight className="w-3 h-3 text-yellow-500" />
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-6 border-b-2 border-yellow-400 inline-block pb-2">Hizmetlerimiz</h4>
            <ul className="space-y-3 text-blue-200">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link href={`/hizmetlerimiz/${service.id}`} className="hover:text-yellow-400 cursor-pointer flex items-center gap-2 text-sm">
                     <ArrowRight className="w-3 h-3 text-yellow-500" />
                     {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-6 border-b-2 border-yellow-400 inline-block pb-2">İletişim</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-yellow-400 p-2 rounded-full text-blue-950 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-blue-200">{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-yellow-400 p-2 rounded-full text-blue-950 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-blue-200 text-lg font-bold">{siteConfig.phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-yellow-400 p-2 rounded-full text-blue-950 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-blue-200">{siteConfig.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-900 pt-8 text-center text-blue-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {siteConfig.brandName} {siteConfig.brandSuffix}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
