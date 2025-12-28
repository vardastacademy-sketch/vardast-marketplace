import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dictionary } from '@/utils/i18n';
import { getCategory } from '@/utils/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, ShieldCheck, Star, ArrowRight, Briefcase, Calendar, Phone, Mail, MessageCircle, Smartphone } from 'lucide-react';

// Contact Icon Helper
function ContactIcon({ type }: { type: string }) {
  switch(type) {
    case 'phone': return <Phone size={16} />;
    case 'email': return <Mail size={16} />;
    case 'telegram': return <MessageCircle size={16} />; // Use generic msg or send
    case 'whatsapp': return <Smartphone size={16} />;
    default: return <Phone size={16} />;
  }
}

export default async function CategoryPage({ params }: { params: { lang: string, slug: string } }) {
  const { lang, slug } = params;
  const t = dictionary[lang as keyof typeof dictionary];
  const category = getCategory(slug);

  if (!category) return notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from('profiles').select('*').eq('id', user.id).single() : { data: null };

  // Fetch Experts (Assuming we filter by some specialty, or for MVP just show all engineers or verify logic later)
  // For now, let's just fetch all verified engineers to populate the list,
  // ideally we would add a 'specialties' column to profiles.
  const { data: experts } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'engineer')
    .eq('is_verified', true)
    .order('rating', { ascending: false })
    .limit(10);

  // Fetch Job Requests for this category
  const { data: requests } = await supabase
    .from('requests')
    .select('*')
    .eq('category', slug)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  const isRtl = lang === 'fa';

  return (
    <>
      <Navbar lang={lang} user={profile} />

      <main className="flex-1 bg-gray-50 pb-20">

        {/* HEADER */}
        <div className="bg-white border-b border-gray-100 py-12">
           <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${category.color} bg-opacity-10 flex items-center justify-center`}>
                       <category.icon size={32} className={category.color.split(' ')[1]} />
                    </div>
                    <div>
                       <h1 className="text-3xl font-bold text-gray-900 mb-1">
                         {lang === 'fa' ? category.title_fa : category.title_en}
                       </h1>
                       <p className="text-gray-500">
                         {lang === 'fa' ? category.desc_fa : category.desc_en}
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-3 w-full md:w-auto">
                    <Link
                      href={`/${lang}/request/new?category=${slug}`}
                      className="flex-1 md:flex-none justify-center bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center gap-2"
                    >
                       <Plus size={20} /> {t.post_request}
                    </Link>
                 </div>
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

           {/* SECTION 1: TOP EXPERTS */}
           <section>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Star className="text-amber-400 fill-amber-400" />
                    {t.top_experts}
                 </h2>
                 {/* <Link href="#" className="text-blue-600 text-sm font-bold hover:underline">View All</Link> */}
              </div>

              {experts && experts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {experts.map(eng => (
                     <Link href={`/${lang}/engineer/${eng.id}`} key={eng.id} className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                              {eng.avatar_url ? <img src={eng.avatar_url} className="w-full h-full object-cover"/> : eng.full_name?.[0]}
                           </div>
                           <div>
                              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition text-sm">{eng.full_name}</h3>
                              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                                 <Star size={10} className="fill-current"/> {eng.rating?.toFixed(1)}
                              </div>
                           </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{eng.bio}</p>
                        <div className="w-full py-2 rounded-lg bg-gray-50 text-gray-600 text-xs font-bold text-center group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                           {t.view_profile}
                        </div>
                     </Link>
                   ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-2xl text-gray-400">
                   {t.experts_empty}
                </div>
              )}
           </section>

           {/* SECTION 2: JOB REQUESTS */}
           <section>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                 <Briefcase className="text-blue-600" />
                 {t.job_requests}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {requests && requests.length > 0 ? (
                    requests.map(req => (
                       <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-4">
                             <h3 className="font-bold text-lg text-gray-900">{req.title}</h3>
                             <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                               {req.budget || t.budget_negotiable}
                             </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                             {req.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t pt-4">
                             {req.deadline && (
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                   <Calendar size={14}/>
                                   <span>{t.deadline}: {req.deadline}</span>
                                </div>
                             )}
                             <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">
                                <ContactIcon type={req.contact_type} />
                                <span dir="ltr">{req.contact_value}</span>
                             </div>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="col-span-full text-center py-12 border border-dashed rounded-2xl text-gray-400">
                       {t.requests_empty}
                    </div>
                 )}
              </div>
           </section>

        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
