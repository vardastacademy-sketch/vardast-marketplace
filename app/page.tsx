import Link from "next/link";
import { Bot, Image, Video, AppWindow, Cog, ArrowRight } from "lucide-react";

export default function Home() {
  const categories = [
    {
      id: "architects",
      title: "Vardast Architects",
      description: "Top-tier chatbot architects",
      icon: <Bot className="w-8 h-8 mb-2 text-blue-400" />,
      color: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50",
      span: "col-span-1 md:col-span-2 row-span-2",
    },
    {
      id: "image-gen",
      title: "AI Image Gen",
      description: "Midjourney & Stable Diffusion experts",
      icon: <Image className="w-6 h-6 mb-2 text-purple-400" />,
      color: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50",
      span: "col-span-1",
    },
    {
      id: "video-gen",
      title: "AI Video Gen",
      description: "Runway & Sora specialists",
      icon: <Video className="w-6 h-6 mb-2 text-orange-400" />,
      color: "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50",
      span: "col-span-1",
    },
    {
      id: "web-app",
      title: "AI Web/App",
      description: "Full-stack AI integrations",
      icon: <AppWindow className="w-6 h-6 mb-2 text-green-400" />,
      color: "bg-green-500/10 border-green-500/20 hover:border-green-500/50",
      span: "col-span-1 md:col-span-2",
    },
    {
      id: "automation",
      title: "Automation",
      description: "Zapier, Make.com, & n8n workflows",
      icon: <Cog className="w-6 h-6 mb-2 text-amber-400" />,
      color: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50",
      span: "col-span-1 md:col-span-2",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-20 mt-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-sm text-slate-300">
          Powered by Vardast
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-500">
          Find the best AI Experts for your <span className="text-blue-500">Vardast</span> Chatbot
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Connect with verified engineers to build, automate, and scale your AI solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/requests"
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
          >
            Post a Request
          </Link>
          <Link
            href="/engineers"
            className="px-8 py-3 rounded-full bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 transition-colors"
          >
            Browse Experts
          </Link>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="w-full max-w-6xl mx-auto mb-20">
        <h2 className="text-2xl font-bold mb-8 text-slate-100 flex items-center">
          Explore Categories <ArrowRight className="ml-2 w-5 h-5 text-slate-500" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className={`group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${cat.color} ${cat.span}`}
            >
              <div>
                <div className="transform group-hover:scale-110 transition-transform duration-300 origin-top-left">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mt-2">{cat.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{cat.description}</p>
              </div>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-slate-200" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Requests Preview */}
      <section className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Recent Jobs</h2>
          <Link href="/requests" className="text-blue-400 hover:text-blue-300 text-sm">
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
                  Architects
                </span>
                <span className="text-slate-500 text-sm">2h ago</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-200 mb-2">
                Need a complex workflow for customer support
              </h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                Looking for an expert to build a multi-step conversation flow that integrates with our CRM...
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium">$500 - $1k</span>
                <span className="text-slate-500">Remote</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
