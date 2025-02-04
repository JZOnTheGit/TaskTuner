'use client';

interface StatsCardProps {
  title: string;
  value: number;
  bgColor: string;
}

export default function StatsCard({ title, value, bgColor }: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-4 sm:p-5`}>
      <h3 className="text-sm sm:text-base text-white/80 mb-1">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
    </div>
  );
} 