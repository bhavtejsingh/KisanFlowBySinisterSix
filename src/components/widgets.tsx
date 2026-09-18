import { ReactNode } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function OTPInput({ onComplete }: { onComplete: (otp: string) => void }) {
  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 focus:border-kisan-green-500 focus:outline-none focus:ring-4 focus:ring-kisan-green-500/10 transition-all"
          onChange={(e) => {
            const value = e.target.value;
            if (value && i < 5) {
              const next = e.target.nextElementSibling as HTMLInputElement;
              next?.focus();
            }
            const inputs = document.querySelectorAll('input[type="text"]');
            const otp = Array.from(inputs).map((inp) => (inp as HTMLInputElement).value).join('');
            if (otp.length === 6) onComplete(otp);
          }}
        />
      ))}
    </div>
  );
}

export function VerificationCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-kisan-green-50 to-kisan-green-100 border-2 border-kisan-green-200 p-5 animate-slide-up">
      {children}
    </div>
  );
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      {label && <div className="flex justify-between text-sm text-slate-600 mb-1.5">
        <span>{label}</span>
        <span className="font-semibold">{Math.round(pct)}%</span>
      </div>}
      <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-kisan-green-400 to-kisan-green-600 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Timeline({ steps }: { steps: { label: string; timestamp?: string; done: boolean; current?: boolean }[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            {step.done ? (
              <div className="w-8 h-8 rounded-full bg-kisan-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            ) : step.current ? (
              <div className="w-8 h-8 rounded-full bg-kisan-orange-500 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              </div>
            )}
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-12 ${step.done ? 'bg-kisan-green-300' : 'bg-slate-200'}`} />
            )}
          </div>
          <div className="pt-1 pb-8">
            <p className={`font-semibold ${step.done || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
              {step.label}
            </p>
            {step.timestamp && <p className="text-sm text-slate-500 mt-0.5">{step.timestamp}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SimpleBarChart({ data, labels, color = '#16a34a' }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end justify-between gap-1 h-32">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-md transition-all duration-700 ease-out hover:opacity-80"
              style={{ height: `${(val / max) * 100}%`, backgroundColor: color, minHeight: val > 0 ? '4px' : '0' }}
            />
          </div>
          <span className="text-xs text-slate-500 truncate">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let cumulative = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="16" />
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * circumference;
          const offset = (cumulative / total) * circumference;
          cumulative += seg.value;
          return (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${pct} ${circumference - pct}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
              className="transition-all duration-700"
            />
          );
        })}
        <text x="80" y="76" textAnchor="middle" className="text-2xl font-bold fill-slate-900">
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" className="text-xs fill-slate-500">
          Total
        </text>
      </svg>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-sm text-slate-600">{seg.label}</span>
            <span className="text-sm font-semibold text-slate-900 ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
