import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Briefcase, MessageCircle, Clock, DollarSign } from "lucide-react";

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Vardast Architects":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "AI Image Gen":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "AI Video Gen":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "AI Web/App":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Automation":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
};

export default async function RequestsPage() {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-12 text-center text-red-400">
        Error loading requests. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Mission Board</h1>
          <p className="text-slate-400 mt-2">
            Find open opportunities or hire an expert for your next project.
          </p>
        </div>
        <Link
          href="/requests/new" // Assuming we might build this later, or just a placeholder
          className="mt-4 md:mt-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-colors flex items-center shadow-lg shadow-blue-500/20"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Post a Mission
        </Link>
      </div>

      {!requests || requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
          <Briefcase className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-300">
            No open missions right now
          </h3>
          <p className="text-slate-500 mt-2">
            Be the first to post a request!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
            {requests.map((request: any) => (
            <div
              key={request.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                      request.category
                    )}`}
                  >
                    {request.category}
                  </span>
                  <span className="flex items-center text-xs text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-200 mb-2">
                  {request.title}
                </h2>
                <p className="text-slate-400 text-sm line-clamp-2 max-w-3xl">
                  {request.description}
                </p>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 w-full md:w-auto">
                {request.budget && (
                  <div className="text-slate-200 font-bold text-lg flex items-center">
                    <DollarSign className="w-5 h-5 text-green-400 mr-1" />
                    {Number(request.budget).toLocaleString()}
                    <span className="text-xs text-slate-500 font-normal ml-1">
                      Toman
                    </span>
                  </div>
                )}
                
                <Link
                  href={`/messages?userId=${request.client_id}`}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Client
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
