'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineCamera, HiOutlineDocument } from 'react-icons/hi';
import styles from './UploadZone.module.css';

interface UploadZoneProps {
  onFileDrop: (file: File) => void;
  uploading?: boolean;
  progress?: number;
}

export default function UploadZone({ onFileDrop, uploading, progress }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        setSelectedFile(accepted[0]);
        onFileDrop(accepted[0]);
      }
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`${styles.zone} ${isDragActive ? styles.active : ''} ${uploading ? styles.uploading : ''}`}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className={styles.content}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress || 0}%` }} />
          </div>
          <p style={{ color: 'var(--green-400)', fontWeight: 600 }}>
            Analyzing... {Math.round(progress || 0)}%
          </p>
          {selectedFile && (
            <p className="text-xs text-muted">{selectedFile.name}</p>
          )}
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.iconWrap}>
            <HiOutlineCamera />
          </div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {isDragActive ? 'Drop your leaf image here' : 'Upload or capture a leaf image'}
          </p>
          <p className="text-sm text-muted">
            Take a photo with your camera or drag & drop an image (.jpg, .png, .webp)
          </p>
          {selectedFile && (
            <div className={styles.fileInfo}>
              <HiOutlineDocument />
              <span>{selectedFile.name}</span>
              <span className="text-muted">
                ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
