'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function Login({ params }: { params: { lang: string } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push(`/${params.lang}/dashboard`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
           {params.lang === 'fa' ? 'ورود به حساب کاربری' : 'Login'}
        </h1>

        {error && (
           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
             {error}
           </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               {params.lang === 'fa' ? 'ایمیل' : 'Email'}
            </label>
            <input
               type="email"
               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               {params.lang === 'fa' ? 'رمز عبور' : 'Password'}
            </label>
            <input
               type="password"
               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
             onClick={handleLogin}
             className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
             {params.lang === 'fa' ? 'ورود' : 'Login'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
           {params.lang === 'fa' ? 'حساب کاربری ندارید؟' : "Don't have an account?"} <Link href={`/${params.lang}/register`} className="text-blue-600 font-bold hover:underline">{params.lang === 'fa' ? 'ثبت نام' : 'Register'}</Link>
        </div>
      </div>
    </div>
  );
}
