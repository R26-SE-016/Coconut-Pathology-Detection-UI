'use client';

import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.ring} />
        <div className={styles.ring} />
        <div className={styles.dot} />
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
