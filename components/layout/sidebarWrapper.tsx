'use client';

import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('@/components/ui/sidebar'), {
  ssr: false,
});

export default function SidebarWrapper() {
  return <Sidebar />;
}