'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          paddingTop: 'var(--header-height)',
        }}
      >
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
