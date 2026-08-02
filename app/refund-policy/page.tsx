import refundData from '@/data/refund.json';
import PolicyPage from '@/components/ui/policyPage';

export default function RefundPolicyPage() {
  return <PolicyPage data={refundData} />;
}