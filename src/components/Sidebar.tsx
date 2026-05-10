'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo';
import {
  HiOutlineViewGrid,
  HiOutlineMap,
  HiOutlineClipboardList,
  HiOutlineCamera,
  HiOutlineOfficeBuilding,
  HiOutlineBookOpen,
  HiOutlineLockClosed,
} from 'react-icons/hi';
import styles from './Sidebar.module.css';

const SYSTEM_B_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: HiOutlineViewGrid },
  { href: '/dashboard/scan', label: 'Scan Leaf', icon: HiOutlineCamera },
  { href: '/dashboard/diagnostics', label: 'Diagnostic History', icon: HiOutlineClipboardList },
  { href: '/dashboard/knowledge', label: 'Knowledge Base', icon: HiOutlineBookOpen },
];

const SYSTEM_A_ITEMS = [
  { href: '/dashboard/heatmaps', label: 'UAV Heatmaps', icon: HiOutlineMap },
  { href: '/dashboard/estates', label: 'Estate Management', icon: HiOutlineOfficeBuilding },
];

export default function Sidebar() {
  const pathname = usePathname();

  const renderNavItem = (item: typeof SYSTEM_B_ITEMS[0], locked = false) => {
    const isActive =
      item.href === '/dashboard'
        ? pathname === '/dashboard'
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${locked ? styles.navItemLocked : ''}`}
      >
        <item.icon className={styles.navIcon} />
        <span>{item.label}</span>
        {locked && <HiOutlineLockClosed className={styles.lockIcon} />}
        {isActive && !locked && <div className={styles.activeIndicator} />}
      </Link>
    );
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoSection}>
        <Logo size="md" />
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {/* System B — Mobile Diagnostics */}
        <div className={styles.navLabel}>
          <span className={styles.systemBadge} style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--green-400)' }}>
            B
          </span>
          Mobile Diagnostics
        </div>
        {SYSTEM_B_ITEMS.map((item) => renderNavItem(item))}

        {/* Divider */}
        <div className={styles.navDivider} />

        {/* System A — UAV Analysis */}
        <div className={styles.navLabel}>
          <span className={styles.systemBadge} style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)' }}>
            A
          </span>
          UAV Analysis
          <span className={styles.comingSoon}>Coming Soon</span>
        </div>
        {SYSTEM_A_ITEMS.map((item) => renderNavItem(item, true))}
      </nav>

      {/* System Info */}
      <div className={styles.footer}>
        <div className={styles.systemInfo}>
          <div className={styles.systemDot} />
          <span className="text-xs text-muted">System B Online</span>
        </div>
        <div className="text-xs text-muted" style={{ marginTop: 4 }}>
          v1.0.0 — R26-SE-016
        </div>
      </div>
    </aside>
  );
}
