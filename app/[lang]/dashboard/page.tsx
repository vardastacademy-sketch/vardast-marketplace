import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { dictionary } from '@/utils/i18n';
import Link from 'next/link';
import { Plus, Trash2, Edit2, LogOut } from 'lucide-react';

export default async function Dashboard({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const t = dictionary[lang as keyof typeof dictionary];
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/login`);
  }

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Redirect Admin
  if (profile?.role === 'admin') {
     redirect(`/${lang}/admin`);
  }

  // Fetch Projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('engineer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <Navbar lang={lang} user={profile} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-2xl font-bold">{t.dashboard}</h1>
           <form action="/auth/signout" method="post">
              <button className="flex items-center gap-2 text-red-500 hover:text-red-700">
                 <LogOut size={20}/> {t.logout}
              </button>
           </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Profile Editor */}
           <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="font-bold text-lg mb-4">{lang === 'fa' ? 'ویرایش پروفایل' : 'Edit Profile'}</h2>
                 <form action="/api/profile/update" method="POST" className="space-y-4">
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="redirect_url" value={`/${lang}/dashboard`} />

                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">{t.full_name}</label>
                       <input name="full_name" defaultValue={profile.full_name} className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fa' ? 'لینک آواتار' : 'Avatar URL'}</label>
                       <input name="avatar_url" defaultValue={profile.avatar_url} className="w-full border rounded-lg px-3 py-2 text-left" dir="ltr" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">{t.bio}</label>
                       <textarea name="bio" defaultValue={profile.bio} className="w-full border rounded-lg px-3 py-2 h-24 resize-none" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fa' ? 'لینک تماس' : 'Contact Link'}</label>
                       <input name="contact_link" defaultValue={profile.contact_link} className="w-full border rounded-lg px-3 py-2 text-left" dir="ltr" />
                    </div>

                    <button type="submit" className="w-full bg-ostad-blue text-white py-2 rounded-lg font-bold">
                       {t.save}
                    </button>
                 </form>
              </div>
           </div>

           {/* Projects Manager */}
           <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="font-bold text-lg">{t.projects}</h2>
                 <Link href={`/${lang}/dashboard/project/new`} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16}/> {lang === 'fa' ? 'پروژه جدید' : 'New Project'}
                 </Link>
              </div>

              <div className="space-y-4">
                 {projects?.map(proj => (
                    <div key={proj.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                       <div>
                          <h3 className="font-bold">{proj.business_name}</h3>
                          <span className="text-xs text-gray-500 uppercase">{proj.platform}</span>
                       </div>
                       <div className="flex gap-2">
                          <form action="/api/project/delete" method="POST" onSubmit={() => confirm('Are you sure?')}>
                             <input type="hidden" name="id" value={proj.id} />
                             <input type="hidden" name="redirect_url" value={`/${lang}/dashboard`} />
                             <button type="submit" className="p-2 text-gray-400 hover:text-red-600">
                                <Trash2 size={18}/>
                             </button>
                          </form>
                       </div>
                    </div>
                 ))}
                 {projects?.length === 0 && (
                    <div className="text-center py-10 text-gray-400 border border-dashed rounded-xl">
                       {lang === 'fa' ? 'پروژه‌ای ندارید.' : 'No projects yet.'}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </main>
    </>
  );
}
