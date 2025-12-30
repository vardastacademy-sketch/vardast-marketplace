import { Bot, Image, Video, AppWindow, Cog } from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'architects',
    slug: 'architects',
    icon: Bot,
    title_fa: 'معماران چت‌بات',
    title_en: 'Chatbot Architects',
    desc_fa: 'طراحی و توسعه ربات‌های هوشمند تلگرام و وب',
    desc_en: 'Design & Development of smart Chatbots',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'image-gen',
    slug: 'image-gen',
    icon: Image,
    title_fa: 'تولید تصویر هوشمند',
    title_en: 'AI Image Generation',
    desc_fa: 'متخصصین Midjourney و Stable Diffusion',
    desc_en: 'Midjourney & Stable Diffusion Experts',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'video-gen',
    slug: 'video-gen',
    icon: Video,
    title_fa: 'تولید ویدیو هوشمند',
    title_en: 'AI Video Generation',
    desc_fa: 'ساخت تیزر و ویدیو با Runway و Sora',
    desc_en: 'Video creation with Runway & Sora',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'web-app',
    slug: 'web-app',
    icon: AppWindow,
    title_fa: 'توسعه وب و اپلیکیشن',
    title_en: 'Web & App AI',
    desc_fa: 'ادغام هوش مصنوعی در وب‌سایت‌ها',
    desc_en: 'AI Integration in Web Apps',
    color: 'bg-green-50 text-green-600',
  },
  {
    id: 'automation',
    slug: 'automation',
    icon: Cog,
    title_fa: 'اتوماسیون کسب‌وکار',
    title_en: 'Business Automation',
    desc_fa: 'خودکارسازی فرآیندها با Zapier و Make',
    desc_en: 'Workflow Automation with Zapier/Make',
    color: 'bg-amber-50 text-amber-600',
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find(c => c.slug === slug);
}
