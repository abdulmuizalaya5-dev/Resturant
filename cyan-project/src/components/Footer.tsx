import React from 'react';
import Link from 'next/link';
import { ChefHat, Mail, Phone, MapPin, Star } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8 text-neutral-400 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl text-neutral-950 font-bold">
              <ChefHat size={18} />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">CyanReserve</span>
              <span className="block text-[8px] font-bold text-amber-500 uppercase tracking-widest leading-none">
                Fine Dining
              </span>
            </div>
          </Link>
          <p className="text-xs leading-relaxed text-neutral-500">
            A premium, reliable, and elegant marketplace for securing fine dining reservations at top-rated culinary establishments worldwide.
          </p>
          <div className="flex items-center gap-1 text-amber-500/80 text-xs">
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <span className="text-neutral-400 ml-1 font-semibold">5.0 App Rating</span>
          </div>
        </div>

        {/* Cuisines column */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Cuisines</h4>
          <ul className="space-y-2 text-sm text-neutral-500">
            <li><Link href="/restaurants?cuisine=French" className="hover:text-amber-400 transition-colors">French Fine Dining</Link></li>
            <li><Link href="/restaurants?cuisine=Japanese" className="hover:text-amber-400 transition-colors">Japanese Omakase</Link></li>
            <li><Link href="/restaurants?cuisine=Italian" className="hover:text-amber-400 transition-colors">Rustic Italian</Link></li>
            <li><Link href="/restaurants?cuisine=Steakhouse" className="hover:text-amber-400 transition-colors">Steakhouses</Link></li>
          </ul>
        </div>

        {/* Company column */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Portals</h4>
          <ul className="space-y-2 text-sm text-neutral-500">
            <li><Link href="/dashboard/customer" className="hover:text-amber-400 transition-colors">Customer Dashboard</Link></li>
            <li><Link href="/portal" className="hover:text-amber-400 transition-colors">Unified Portal Gateway</Link></li>
          </ul>
        </div>

        {/* Contact column */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">Contact & Support</h4>
          <ul className="space-y-3 text-xs text-neutral-500">
            <li className="flex items-center gap-2">
              <MapPin size={12} className="text-amber-500/80 shrink-0" />
              <span>784 reservation lane, Manhattan, NY</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={12} className="text-amber-500/80 shrink-0" />
              <span>+1 (800) 555-RESERVE</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={12} className="text-amber-500/80 shrink-0" />
              <span>support@cyanreserve.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copy / Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
        <p>© 2026 CyanReserve. All rights reserved. Built with Next.js & Tailwind CSS.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};
