import termsData from '@/data/terms.json';
import PolicyPage from '@/components/ui/policyPage';

export default function TermsPage() {
  return <PolicyPage data={termsData} />;
}