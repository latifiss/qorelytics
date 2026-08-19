'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ComparisonFeature {
  name: string
  free: string | boolean
  pro: string | boolean
  team: string | boolean
}

interface ComparisonTableProps {
  features: ComparisonFeature[]
  className?: string
}

const ComparisonTable = ({ features, className = '' }: ComparisonTableProps) => {
  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-neutral-900 dark:text-white mx-auto" strokeWidth={2.5} />
      ) : (
        <X className="w-5 h-5 text-neutral-400 dark:text-neutral-600 mx-auto" strokeWidth={2.5} />
      )
    }
    return <span className="text-[18px] font-normal text-neutral-600 dark:text-neutral-400">{value}</span>
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="min-w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-1 shadow-tab">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="sticky left-0 z-10 text-left py-4 px-6 text-[18px] font-medium text-neutral-500 dark:text-neutral-400 rounded-tl-2xl bg-neutral-50 dark:bg-neutral-900/50">
                  Feature
                </th>
                <th className="text-center py-4 px-6 text-[18px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50">Free</th>
                <th className="text-center py-4 px-6 text-[18px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50">Pro</th>
                <th className="text-center py-4 px-6 text-[18px] font-medium text-neutral-500 dark:text-neutral-400 rounded-tr-2xl bg-neutral-50 dark:bg-neutral-900/50">Team</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    'border-b border-neutral-200 dark:border-neutral-800 transition-colors bg-white dark:bg-[#171b1d] hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                  )}
                >
                  <td className="sticky left-0 z-10 py-3 px-6 text-[18px] font-normal text-neutral-900 dark:text-white bg-white dark:bg-[#171b1d] hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    {feature.name}
                  </td>
                  <td className="py-3 px-6 text-center">{renderValue(feature.free)}</td>
                  <td className="py-3 px-6 text-center">{renderValue(feature.pro)}</td>
                  <td className="py-3 px-6 text-center">{renderValue(feature.team)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTable