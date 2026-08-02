// app/cookie/page.tsx
import cookieData from '@/data/cookie.json';
import PolicyPage from '@/components/ui/policyPage';

export default function CookiePage() {
  return <PolicyPage data={cookieData} />;
}