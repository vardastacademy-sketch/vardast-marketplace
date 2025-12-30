import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = formData.get('id');
  const redirect_url = formData.get('redirect_url') as string;

  const supabase = await createClient();

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return new Response('Forbidden', { status: 403 });

  await supabase.from('requests').delete().eq('id', id);

  return redirect(redirect_url);
}
