import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className={`w-${size / 4} h-${size / 4} animate-spin text-kisan-green-600`} style={{ width: size, height: size }} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon: typeof Loader2; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; className: string }> = {
    booked: { label: 'Booked', className: 'badge-blue' },
    arrived: { label: 'Arrived', className: 'badge-orange' },
    in_progress: { label: 'In Progress', className: 'badge-orange' },
    completed: { label: 'Completed', className: 'badge-green' },
    cancelled: { label: 'Cancelled', className: 'badge-red' },
    pending: { label: 'Pending', className: 'badge-gray' },
    approved: { label: 'Approved', className: 'badge-green' },
    rejected: { label: 'Rejected', className: 'badge-red' },
    processing: { label: 'Processing', className: 'badge-orange' },
    failed: { label: 'Failed', className: 'badge-red' },
  };

  const config = statusMap[status] || { label: status, className: 'badge-gray' };
  return <span className={config.className}>{config.label}</span>;
}

export function StatCard({ icon: Icon, label, value, color = 'green' }: { icon: typeof Loader2; label: string; value: string | number; color?: 'green' | 'orange' | 'blue' | 'red' }) {
  const colorMap = {
    green: 'bg-kisan-green-50 text-kisan-green-600',
    orange: 'bg-kisan-orange-50 text-kisan-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="card">
      <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export function ScreenContainer({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50 animate-fade-in">{children}</div>;
}

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}
