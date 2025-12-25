import Link from "next/link";
import { Bot, Image, Video, AppWindow, Cog, Menu, User } from "lucide-react";

export default function Navbar() {
  const navItems = [
    {
      name: "Architects",
      href: "/category/architects",
      icon: <Bot className="w-4 h-4 mr-2" />,
      color: "text-blue-500 hover:text-blue-400",
    },
    {
      name: "AI Image",
      href: "/category/image-gen",
      icon: <Image className="w-4 h-4 mr-2" />,
      color: "text-purple-500 hover:text-purple-400",
    },
    {
      name: "AI Video",
      href: "/category/video-gen",
      icon: <Video className="w-4 h-4 mr-2" />,
      color: "text-orange-500 hover:text-orange-400",
    },
    {
      name: "Web/App",
      href: "/category/web-app",
      icon: <AppWindow className="w-4 h-4 mr-2" />,
      color: "text-green-500 hover:text-green-400",
    },
    {
      name: "Automation",
      href: "/category/automation",
      icon: <Cog className="w-4 h-4 mr-2" />,
      color: "text-amber-500 hover:text-amber-400",
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center font-bold text-xl text-slate-100">
              <span className="text-blue-600 mr-1">Vardast</span> Experts
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${item.color}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Login / Actions */}
          <div className="hidden md:block">
            <Link
              href="/login"
              className="flex items-center bg-slate-100 text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Login / Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button (Placeholder) */}
          <div className="-mr-2 flex md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
