import privacyData from '@/data/privacy.json';
import PolicyPage from '@/components/ui/policyPage';

export default function PrivacyPage() {
  return <PolicyPage data={privacyData} />;
}