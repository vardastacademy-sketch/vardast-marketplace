import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { dictionary } from '@/utils/i18n';
import { CheckCircle, XCircle, LogOut, Save, Trash2, Briefcase } from 'lucide-react';

export default async function AdminDashboard({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const t = dictionary[lang as keyof typeof dictionary];
  const supabase = await createClient();

  // 1. Verify Admin Role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (profile?.role !== 'admin') {
     redirect(`/${lang}/dashboard`);
  }

  // 2. Fetch Data
  const { data: reviewsWithDetails } = await supabase
     .from('reviews')
     .select('*, engineer:profiles!engineer_id(full_name)')
     .eq('status', 'pending');

  const { data: requests } = await supabase
     .from('requests')
     .select('*')
     .eq('status', 'open')
     .order('created_at', { ascending: false });

  const { data: siteContent } = await supabase
    .from('site_content')
    .select('*')
    .order('key');

  const { data: engineers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'engineer')
    .order('created_at', { ascending: false });

  return (
    <>
      <Navbar lang={lang} user={profile} />
      <div className="bg-gray-900 text-white py-4 px-8 flex justify-between items-center">
         <span className="font-mono text-sm">ADMIN MODE</span>
         <form action="/auth/signout" method="post">
           <button className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
             <LogOut size={14}/> {t.logout}
           </button>
         </form>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">

         {/* CMS SECTION */}
         <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">مدیریت محتوا (CMS)</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-4 grid gap-4">
                  {siteContent?.map((item) => (
                    <form key={item.key} action="/api/admin/content" method="POST" className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-lg">
                       <div className="md:col-span-3">
                          <span className="font-mono text-xs font-bold text-gray-500 block">{item.key}</span>
                          <span className="text-xs text-gray-400">{item.description}</span>
                       </div>
                       <div className="md:col-span-8">
                          <input
                            name="value"
                            defaultValue={item.value}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                          />
                          <input type="hidden" name="key" value={item.key} />
                          <input type="hidden" name="redirect_url" value={`/${lang}/admin`} />
                       </div>
                       <div className="md:col-span-1 text-right">
                          <button className="text-blue-600 hover:bg-blue-100 p-2 rounded transition">
                             <Save size={18} />
                          </button>
                       </div>
                    </form>
                  ))}
               </div>
            </div>
         </section>

         {/* REQUESTS MODERATION */}
         <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2 flex items-center gap-2">
               <Briefcase />
               مدیریت درخواست‌های کار ({requests?.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {requests?.length === 0 && <p className="text-gray-400">هیچ درخواست بازی وجود ندارد.</p>}
               {requests?.map((req) => (
                  <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm line-clamp-1">{req.title}</h4>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{req.category}</span>
                     </div>
                     <p className="text-xs text-gray-500 mb-4 line-clamp-2">{req.description}</p>

                     <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>{req.contact_type}: {req.contact_value}</span>
                        <form action="/api/admin/request/delete" method="POST" onSubmit={() => confirm('Delete this request?')}>
                           <input type="hidden" name="id" value={req.id} />
                           <input type="hidden" name="redirect_url" value={`/${lang}/admin`} />
                           <button className="text-red-500 hover:bg-red-50 p-1 rounded">
                              <Trash2 size={16} />
                           </button>
                        </form>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* REVIEWS MODERATION */}
         <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">نظرات در انتظار تایید ({reviewsWithDetails?.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {reviewsWithDetails?.length === 0 && <p className="text-gray-400">هیچ نظری برای بررسی وجود ندارد.</p>}
               {reviewsWithDetails?.map((rev: any) => (
                  <div key={rev.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                     <div className="flex justify-between mb-2">
                        <span className="font-bold">{rev.reviewer_name || 'Anonymous'}</span>
                        <span className="text-xs text-gray-500">برای: {rev.engineer?.full_name}</span>
                     </div>
                     <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded">{rev.comment}</p>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-amber-500 font-bold">{rev.rating} ستاره</span>
                        <div className="flex gap-2">
                           <form action="/api/admin/review" method="POST">
                              <input type="hidden" name="id" value={rev.id} />
                              <input type="hidden" name="action" value="approve" />
                              <input type="hidden" name="redirect_url" value={`/${lang}/admin`} />
                              <button className="text-green-600 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100 flex items-center gap-1">
                                 <CheckCircle size={14}/> تایید
                              </button>
                           </form>
                           <form action="/api/admin/review" method="POST">
                              <input type="hidden" name="id" value={rev.id} />
                              <input type="hidden" name="action" value="reject" />
                              <input type="hidden" name="redirect_url" value={`/${lang}/admin`} />
                              <button className="text-red-600 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 flex items-center gap-1">
                                 <XCircle size={14}/> رد
                              </button>
                           </form>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* ENGINEERS VERIFICATION */}
         <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">مدیریت متخصصین</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <table className="w-full text-right">
                  <thead className="bg-gray-50 text-xs text-gray-500">
                     <tr>
                        <th className="p-4">نام</th>
                        <th className="p-4">ایمیل</th>
                        <th className="p-4">وضعیت</th>
                        <th className="p-4">عملیات</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                     {engineers?.map((eng) => (
                        <tr key={eng.id}>
                           <td className="p-4 font-bold">{eng.full_name}</td>
                           <td className="p-4 text-gray-500">{eng.email}</td>
                           <td className="p-4">
                              {eng.is_verified
                                ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">تایید شده</span>
                                : <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">عادی</span>}
                           </td>
                           <td className="p-4">
                              <form action="/api/admin/verify" method="POST">
                                 <input type="hidden" name="id" value={eng.id} />
                                 <input type="hidden" name="new_status" value={(!eng.is_verified).toString()} />
                                 <input type="hidden" name="redirect_url" value={`/${lang}/admin`} />
                                 <button className="text-blue-600 hover:underline text-xs">
                                    {eng.is_verified ? 'لغو تایید' : 'تایید هویت'}
                                 </button>
                              </form>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </section>

      </main>
    </>
  );
}
