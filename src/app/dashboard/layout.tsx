import { Metadata } from 'next';
import DashboardNav from '@/components/dashboard/DashboardNav';

export const metadata: Metadata = {
  title: 'Dashboard - TaskTuner',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DashboardNav />
      <main className="p-4">{children}</main>
    </div>
  );
} 