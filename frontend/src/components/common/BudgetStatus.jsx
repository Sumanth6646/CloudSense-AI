import {
  Wallet,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import { budgetData } from "../../data/costdata";
import { formatCurrency } from "../../utils/currency";

function BudgetStatus() {
  const percentage =
    (budgetData.spent / budgetData.budget) * 100;

  const remaining =
    budgetData.budget - budgetData.spent;

  const isNearLimit = percentage >= 85;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Wallet size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Budget Status
            </h2>

            <p className="text-xs text-slate-500">
              Current monthly budget usage
            </p>
          </div>
        </div>

        {isNearLimit && (
          <AlertCircle
            size={20}
            className="text-amber-500"
          />
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(
                budgetData.spent,
                undefined,
                { maximumFractionDigits: 0 }
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              of {formatCurrency(
                budgetData.budget,
                undefined,
                { maximumFractionDigits: 0 }
              )} budget
            </p>
          </div>

          <p
            className={`text-sm font-bold ${
              isNearLimit
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {percentage.toFixed(1)}%
          </p>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isNearLimit
                ? "bg-amber-500"
                : "bg-blue-600"
            }`}
            style={{
              width: `${Math.min(percentage, 100)}%`,
            }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={15}
              className={
                isNearLimit
                  ? "text-amber-500"
                  : "text-emerald-500"
              }
            />

            <span className="text-xs text-slate-500">
              Remaining budget
            </span>
          </div>

          <span className="text-sm font-bold text-slate-800">
            {formatCurrency(
              remaining,
              undefined,
              { maximumFractionDigits: 0 }
            )}
          </span>
        </div>
      </div>
    </section>
  );
}

export default BudgetStatus;

