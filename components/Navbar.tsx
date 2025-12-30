'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { dictionary } from '@/utils/i18n';
import { LogOut, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ lang, user }: { lang: string, user?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = dictionary[lang as keyof typeof dictionary] || dictionary.fa; // Fallback to fa if lang not found immediately

  const toggleLang = () => {
    const newLang = lang === 'fa' ? 'en' : 'fa';
    // Replace /fa/ with /en/ or vice versa in the URL
    // If pathname is just /, we need to handle it, but middleware forces /[lang]
    const segments = pathname.split('/');
    if (segments[1] === lang) {
      segments[1] = newLang;
      router.push(segments.join('/'));
    } else {
        router.push(`/${newLang}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href={`/${lang}`} className="flex-shrink-0 flex items-center gap-2">
               <div className="w-8 h-8 bg-ostad-blue rounded-lg flex items-center justify-center text-white font-bold text-xl bg-blue-600">
                O
               </div>
               <span className="font-bold text-xl text-gray-900 tracking-tight hidden sm:block">
                 {lang === 'fa' ? 'اوستاکاران' : 'Ostakaran'}
               </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleLang}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition bg-gray-50 px-3 py-1 rounded-md"
            >
              {lang === 'fa' ? 'English' : 'فارسی'}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                 <span className="text-sm font-medium text-gray-700">
                   {user.full_name || user.email}
                 </span>
                 <Link
                   href={`/${lang}/dashboard`}
                   className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                 >
                   {t.dashboard}
                 </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${lang}/login`}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  {t.login}
                </Link>
                <Link
                  href={`/${lang}/register`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200"
                >
                   {lang === 'fa' ? 'ثبت نام' : 'Join'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
             <button
                onClick={toggleLang}
                className="text-xs font-bold text-gray-500 border border-gray-200 px-2 py-1 rounded"
              >
                {lang === 'fa' ? 'EN' : 'FA'}
              </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          <div className="px-4 pt-4 space-y-3">
             {user ? (
               <>
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User size={20} className="text-gray-500"/>
                    <span className="text-sm font-bold text-gray-800">{user.full_name}</span>
                 </div>
                 <Link
                   href={`/${lang}/dashboard`}
                   className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                   onClick={() => setIsOpen(false)}
                 >
                   {t.dashboard}
                 </Link>
               </>
             ) : (
                <>
                  <Link
                    href={`/${lang}/login`}
                    className="block w-full text-center text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {t.login}
                  </Link>
                   <Link
                    href={`/${lang}/register`}
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {lang === 'fa' ? 'ثبت نام متخصص' : 'Join as Expert'}
                  </Link>
                </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
