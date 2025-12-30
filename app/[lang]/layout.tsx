import { locales } from '@/utils/i18n';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return <div className="flex-1 flex flex-col w-full">{children}</div>;
}
