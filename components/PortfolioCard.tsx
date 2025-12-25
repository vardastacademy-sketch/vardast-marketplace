import Link from "next/link";
import { ExternalLink, Globe, Instagram, Send } from "lucide-react";

interface PortfolioItem {
  id: string;
  client_name: string;
  client_logo_url: string | null;
  project_link: string | null;
  platform_type: "Telegram" | "Instagram" | "Web" | string;
}

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "Telegram":
        return <Send className="w-5 h-5 text-blue-400" />;
      case "Instagram":
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case "Web":
        return <Globe className="w-5 h-5 text-green-400" />;
      default:
        return <Globe className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-600 transition-colors shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Client Logo or Placeholder */}
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
            {item.client_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.client_logo_url}
                alt={item.client_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-slate-500">
                {item.client_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">
              {item.client_name}
            </h3>
            <div className="flex items-center text-xs text-slate-500 mt-0.5">
              {getIcon(item.platform_type)}
              <span className="ml-1.5">{item.platform_type} Bot</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {item.project_link ? (
          <Link
            href={item.project_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors group"
          >
            View Live Bot
            <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center justify-center w-full px-4 py-2 bg-slate-800/50 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
          >
            Link Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
