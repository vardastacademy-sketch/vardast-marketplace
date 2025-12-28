import { dictionary } from '@/utils/i18n';

export default function Footer({ lang }: { lang: string }) {
  const t = dictionary[lang as keyof typeof dictionary] || dictionary.fa;

  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">{t.copyright}</p>
        <p className="text-gray-400 text-xs mt-2">
           Developed by <span className="font-bold text-gray-500">Ostakaran</span>
        </p>
      </div>
    </footer>
  );
}
