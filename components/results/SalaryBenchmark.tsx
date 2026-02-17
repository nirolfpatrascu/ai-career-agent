import type { SalaryAnalysis } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface SalaryBenchmarkProps {
  salary: SalaryAnalysis;
}

export default function SalaryBenchmark({ salary }: SalaryBenchmarkProps) {
  const currentMid = salary.currentRoleMarket.mid;
  const targetMid = salary.targetRoleMarket.mid;
  const currentCurrency = salary.currentRoleMarket.currency;
  const targetCurrency = salary.targetRoleMarket.currency;

  // Normalize to same currency for bar comparison (use raw numbers for visual)
  const maxSalary = Math.max(salary.targetRoleMarket.high, salary.currentRoleMarket.high);
  const currentWidth = maxSalary > 0 ? (currentMid / maxSalary) * 100 : 0;
  const targetWidth = maxSalary > 0 ? (targetMid / maxSalary) * 100 : 0;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Salary Analysis</h2>
          <p className="text-xs text-text-secondary mt-0.5">All figures are gross annual (before tax)</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Salary comparison bars */}
        <div className="card space-y-6">
          {/* Current role */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-secondary">Current Role Market</p>
              <p className="text-sm text-text-secondary">{salary.currentRoleMarket.region}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-10 rounded-lg bg-background overflow-hidden relative">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-zinc-700 to-zinc-600 flex items-center justify-end px-3 transition-all duration-1000"
                    style={{ width: `${Math.max(currentWidth, 30)}%` }}
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {formatCurrency(currentMid, currentCurrency)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-text-secondary">
                  <span>{formatCurrency(salary.currentRoleMarket.low, currentCurrency)}</span>
                  <span>{formatCurrency(salary.currentRoleMarket.high, currentCurrency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider with arrow */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-card-border" />
            <div className="flex items-center gap-2 text-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span className="text-sm font-semibold">{salary.growthPotential}</span>
            </div>
            <div className="flex-1 h-px bg-card-border" />
          </div>

          {/* Target role */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-secondary">Target Role Market</p>
              <p className="text-sm text-text-secondary">{salary.targetRoleMarket.region}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-10 rounded-lg bg-background overflow-hidden relative">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-success/80 to-success flex items-center justify-end px-3 transition-all duration-1000"
                    style={{ width: `${Math.max(targetWidth, 30)}%` }}
                  >
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(targetMid, targetCurrency)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-text-secondary">
                  <span>{formatCurrency(salary.targetRoleMarket.low, targetCurrency)}</span>
                  <span>{formatCurrency(salary.targetRoleMarket.high, targetCurrency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best monetary move */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💡</span>
            <h3 className="font-semibold text-text-primary">Best Monetary Move</h3>
          </div>
          <p className="text-text-secondary leading-relaxed">
            {salary.bestMonetaryMove}
          </p>
        </div>

        {/* Negotiation tips */}
        {salary.negotiationTips.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎯</span>
              <h3 className="font-semibold text-text-primary">Negotiation Tips</h3>
            </div>
            <div className="space-y-3">
              {salary.negotiationTips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-primary font-bold text-sm flex-shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
