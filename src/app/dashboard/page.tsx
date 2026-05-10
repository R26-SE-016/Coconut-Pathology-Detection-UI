'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  HiOutlineClipboardList,
  HiOutlineCamera,
  HiOutlineMap,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import StatCard from '@/components/StatCard';
import DiseaseChart from '@/components/DiseaseChart';
import DiseaseBadge from '@/components/DiseaseBadge';
import ConfidenceBar from '@/components/ConfidenceBar';
import { DEMO_DIAGNOSTICS, DEMO_ESTATES } from '@/lib/demo-data';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

export default function DashboardOverview() {
  const stats = useMemo(() => {
    const totalDiag = DEMO_DIAGNOSTICS.length;
    const healthyCount = DEMO_DIAGNOSTICS.filter(
      (d) => d.disease_class === 'healthy leaves'
    ).length;
    const diseasedCount = totalDiag - healthyCount;
    const avgConf =
      DEMO_DIAGNOSTICS.reduce((sum, d) => sum + d.confidence, 0) / totalDiag;

    return { totalDiag, healthyCount, diseasedCount, avgConf };
  }, []);

  // Weekly trend data
  const weeklyData = useMemo(() => {
    const days = ['May 5', 'May 6', 'May 7', 'May 8', 'May 9', 'May 10'];
    return days.map((day) => {
      const count = DEMO_DIAGNOSTICS.filter((d) =>
        d.captured_at?.includes(day.replace('May ', '2026-05-'))
      ).length;
      return { day, scans: count || Math.floor(Math.random() * 4) + 1 };
    });
  }, []);

  const recentDiag = DEMO_DIAGNOSTICS.slice(0, 6);

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          Welcome to <span className="gradient-text">CocoCastAI</span>
        </h1>
        <p>AI-Powered Coconut Pathology Detection — Accessible to Everyone</p>
      </div>

      {/* Quick Action */}
      <Link href="/dashboard/scan" style={{ textDecoration: 'none' }}>
        <div
          className="glass-card glow-border"
          style={{
            padding: 'var(--space-5) var(--space-6)',
            marginBottom: 'var(--space-8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(34, 197, 94, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                color: 'var(--green-400)',
              }}
            >
              <HiOutlineCamera />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Scan a Coconut Leaf
              </div>
              <div className="text-sm text-muted">
                Upload or capture a photo to instantly identify diseases using MobileNetV2
              </div>
            </div>
          </div>
          <div className="btn btn-primary">Start Scan →</div>
        </div>
      </Link>

      {/* KPI Cards */}
      <div className="grid-4 stagger" style={{ marginBottom: 'var(--space-8)' }}>
        <StatCard
          icon={<HiOutlineClipboardList />}
          label="Total Scans"
          value={stats.totalDiag}
          subtitle="Mobile diagnostics"
          trend={{ value: '+12%', positive: true }}
          accentColor="var(--green-500)"
        />
        <StatCard
          icon={<HiOutlineShieldCheck />}
          label="Healthy"
          value={stats.healthyCount}
          subtitle="Palms verified healthy"
          accentColor="var(--green-400)"
        />
        <StatCard
          icon={<HiOutlineClipboardList />}
          label="Diseases Found"
          value={stats.diseasedCount}
          subtitle="Requiring attention"
          accentColor="var(--red)"
        />
        <StatCard
          icon={<HiOutlineCamera />}
          label="Avg Confidence"
          value={`${(stats.avgConf * 100).toFixed(0)}%`}
          subtitle="MobileNetV2-INT8"
          accentColor="var(--purple)"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        <DiseaseChart diagnostics={DEMO_DIAGNOSTICS} title="Disease Distribution" />

        {/* Weekly Scan Trend */}
        <div className="glass-card-static" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-4)' }}>
            Weekly Scan Activity
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <CartesianGrid stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#111f2c',
                  border: '1px solid rgba(148,163,184,0.12)',
                  borderRadius: '10px',
                  color: '#f1f5f9',
                  fontSize: '0.8rem',
                }}
              />
              <Bar dataKey="scans" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Info Cards */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        {/* System B Card — Active */}
        <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--green-500)',
                  boxShadow: '0 0 8px rgba(34,197,94,0.4)',
                }}
              />
              <h3 style={{ fontSize: '0.95rem' }}>System B — Mobile Diagnostics</h3>
            </div>
            <span className="badge badge-green">Active</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            MobileNetV2-INT8 on-device inference for real-time field diagnostics. Classifies 6
            disease categories from handheld camera images — accessible to every farmer and
            field officer.
          </p>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <DiseaseBadge disease="bud rot" size="sm" />
            <DiseaseBadge disease="bud root dropping" size="sm" />
            <DiseaseBadge disease="gray leaf spot" size="sm" />
            <DiseaseBadge disease="leaf rot" size="sm" />
            <DiseaseBadge disease="stembleeding" size="sm" />
            <DiseaseBadge disease="healthy leaves" size="sm" />
          </div>
        </div>

        {/* System A Card — Coming Soon */}
        <div
          className="glass-card-static"
          style={{
            padding: 'var(--space-5)',
            opacity: 0.55,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--text-muted)',
                }}
              />
              <h3 style={{ fontSize: '0.95rem' }}>System A — UAV Analysis</h3>
            </div>
            <span className="badge badge-cyan">Coming Soon</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            SAHI + YOLOv11 pipeline for 4K orthomosaic analysis. Designed for estate owners and
            researchers with access to UAV imagery — macroscopic disease mapping at scale.
          </p>
          <div className="flex gap-2">
            <DiseaseBadge disease="v_cut" size="sm" />
            <DiseaseBadge disease="scorching" size="sm" />
            <DiseaseBadge disease="wilting" size="sm" />
          </div>
          {/* Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
            }}
          >
            <HiOutlineMap style={{ fontSize: '1.3rem', color: 'var(--text-muted)', opacity: 0.3 }} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card-static" style={{ padding: 'var(--space-5)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontSize: '0.95rem' }}>Recent Scans</h3>
          <Link href="/dashboard/diagnostics" className="text-sm" style={{ color: 'var(--green-400)' }}>
            View All →
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Disease</th>
              <th>Confidence</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {recentDiag.map((d) => (
              <tr key={d.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.8rem' }}>
                  {d.captured_at
                    ? new Date(d.captured_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </td>
                <td>
                  <DiseaseBadge disease={d.disease_class} size="sm" />
                </td>
                <td style={{ minWidth: 130 }}>
                  <ConfidenceBar value={d.confidence} />
                </td>
                <td className="text-sm text-muted">
                  {d.location.lat.toFixed(4)}, {d.location.lng.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
