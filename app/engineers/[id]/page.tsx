import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, MessageSquare, DollarSign, Briefcase } from "lucide-react";
import PortfolioCard from "@/components/PortfolioCard";

export default async function EngineerProfile({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { id } = params;

  // Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Fetch Portfolio Items
  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("engineer_id", id)
    .order("created_at", { ascending: false });

  const portfolioItems = portfolio || [];

  return (
    <div className="min-h-screen pb-20">
      {/* Header / Hero Section */}
      <div className="bg-slate-900 border-b border-slate-800 pb-12 pt-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-800 bg-slate-800 overflow-hidden shadow-2xl relative">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-700 text-4xl text-slate-400 font-bold">
                  {profile.full_name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {profile.full_name}
              </h1>
              {profile.is_verified && (
                <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/10" />
              )}
            </div>
            
            <p className="text-slate-400 text-lg mb-6 max-w-2xl">
              {profile.bio || "No bio provided."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
              {profile.hourly_rate && (
                <div className="flex items-center text-slate-300 bg-slate-800/50 px-3 py-1 rounded-full text-sm">
                  <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                  {profile.hourly_rate}/hr
                </div>
              )}
              {profile.role === 'engineer' && (
                 <div className="flex items-center text-slate-300 bg-slate-800/50 px-3 py-1 rounded-full text-sm">
                   <Briefcase className="w-4 h-4 mr-1 text-purple-400" />
                   Engineer
                 </div>
              )}
            </div>

            {/* Hire Me Button */}
            <Link
              href={`/messages?userId=${profile.id}`}
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Hire Me
            </Link>
          </div>
        </div>
      </div>

      {/* Skills (Optional - if skills array exists) */}
      {profile.skills && profile.skills.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 mt-8">
             <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Skills</h3>
             <div className="flex flex-wrap gap-2">
                 {profile.skills.map((skill: string, index: number) => (
                     <span key={index} className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm">
                         {skill}
                     </span>
                 ))}
             </div>
          </div>
      )}

      {/* Portfolio Grid */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            Portfolio
            <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                {portfolioItems.length}
            </span>
        </h2>

        {portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item: any) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-500">No portfolio items yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
