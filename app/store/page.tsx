import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/ProductCard";
import { Sparkles, Filter } from "lucide-react";

export default async function StorePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-12 text-center text-red-400">
        Error loading store items. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center p-2 bg-slate-900 border border-slate-800 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-amber-400 mr-2" />
            <span className="text-slate-300 text-sm font-medium">Digital Assets for Builders</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Vardast Asset Store
        </h1>
        <p className="text-lg text-slate-400">
          Premium prompts, workflows, and templates to accelerate your AI development.
        </p>
      </div>

      {/* Filters (Visual Only) */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/50">
        <div className="flex space-x-2">
            <button className="px-4 py-2 rounded-full bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors">All</button>
            <button className="px-4 py-2 rounded-full text-slate-400 hover:text-white text-sm font-medium hover:bg-slate-800 transition-colors">Prompts</button>
            <button className="px-4 py-2 rounded-full text-slate-400 hover:text-white text-sm font-medium hover:bg-slate-800 transition-colors">Workflows</button>
        </div>
        <button className="flex items-center text-slate-400 hover:text-white text-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
        </button>
      </div>

      {/* Product Grid */}
      {!products || products.length === 0 ? (
        <div className="text-center py-24">
            <p className="text-slate-500 text-lg">No products available in the store yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
