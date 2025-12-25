"use client";

import { ShoppingBag, Lock, Sparkles } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: number;
  type: "prompt" | "workflow" | string;
  asset_url: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const handleBuy = () => {
    alert("Payment Gateway Mockup: Redirecting to payment...");
  };

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all hover:-translate-y-1 shadow-lg">
      {/* Image Preview with Blur */}
      <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
        {/* Abstract Gradient Placeholder if no image */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        
        {/* Actual Image if available */}
        {product.asset_url && (
             // eslint-disable-next-line @next/next/no-img-element
            <img 
                src={product.asset_url} 
                alt={product.title}
                className="w-full h-full object-cover opacity-50 blur-sm group-hover:blur-none transition-all duration-500"
            />
        )}

        {/* Premium Lock Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center text-white/80 group-hover:opacity-0 transition-opacity duration-300">
            <Lock className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Premium Asset</span>
          </div>
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
             <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
                 product.type === 'prompt' 
                 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                 : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
             }`}>
                 {product.type}
             </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase">Price</span>
            <span className="text-xl font-bold text-white">
              ${Number(product.price).toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={handleBuy}
            className="flex items-center px-4 py-2 bg-slate-100 text-slate-900 hover:bg-white rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-white/5"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
