'use client';

import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/scan': 'Scan Leaf',
  '/dashboard/diagnostics': 'Diagnostic History',
  '/dashboard/knowledge': 'Knowledge Base',
  '/dashboard/heatmaps': 'UAV Heatmaps',
  '/dashboard/estates': 'Estate Management',
};

export default function Header() {
  const pathname = usePathname();
  const pageTitle = BREADCRUMB_MAP[pathname] || 'Dashboard';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbRoot}>Dashboard</span>
          {pathname !== '/dashboard' && (
            <>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>{pageTitle}</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.statusPill}>
          <div className={styles.statusDot} />
          <span>Demo Mode</span>
        </div>
      </div>
    </header>
  );
}
