
'use client';

import dynamic from 'next/dynamic';
import AppSidebarPlaceholder from '@/components/app-sidebar-placeholder';

const AppSidebar = dynamic(() => import('@/components/app-sidebar'), {
  ssr: false,
  loading: () => <AppSidebarPlaceholder />,
});

export default function SidebarLoader() {
  return <AppSidebar />;
}
