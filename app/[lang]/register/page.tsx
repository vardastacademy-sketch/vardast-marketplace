'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function Register({ params }: { params: { lang: string } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async () => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) {
      setError(error.message);
    } else {
       alert(params.lang === 'fa' ? 'ثبت نام موفقیت آمیز بود! لطفا وارد شوید.' : 'Registration successful! Please login.');
       router.push(`/${params.lang}/login`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
           {params.lang === 'fa' ? 'ثبت نام مهندس' : 'Register as Expert'}
        </h1>

        {error && (
           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
             {error}
           </div>
        )}

        <div className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               {params.lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
            </label>
            <input
               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
               value={fullName}
               onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
             onClick={handleRegister}
             className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
             {params.lang === 'fa' ? 'ثبت نام' : 'Register'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
           {params.lang === 'fa' ? 'قبلا ثبت نام کرده‌اید؟' : "Already have an account?"} <Link href={`/${params.lang}/login`} className="text-blue-600 font-bold hover:underline">{params.lang === 'fa' ? 'ورود' : 'Login'}</Link>
        </div>
      </div>
    </div>
  );
}
