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
        <Check className="w-5 h-5 text-foreground mx-auto" strokeWidth={2.5} />
      ) : (
        <X className="w-5 h-5 text-muted mx-auto" strokeWidth={2.5} />
      )
    }
    return <span className="text-[18px] font-normal text-muted-foreground">{value}</span>
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="min-w-full rounded-2xl border border-subtle bg-fill-alpha-subtle p-1 shadow-tab">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-subtle bg-fill-alpha-subtle">
                <th className="sticky left-0 z-10 text-left py-4 px-6 text-[18px] font-medium text-muted-foreground rounded-tl-2xl bg-fill-alpha-subtle">
                  Feature
                </th>
                <th className="text-center py-4 px-6 text-[18px] font-medium text-muted-foreground bg-fill-alpha-subtle">Free</th>
                <th className="text-center py-4 px-6 text-[18px] font-medium text-muted-foreground bg-fill-alpha-subtle">Pro</th>
                <th className="text-center py-4 px-6 text-[18px] font-medium text-muted-foreground rounded-tr-2xl bg-fill-alpha-subtle">Team</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    'border-b border-subtle transition-colors bg-surface hover:bg-fill-alpha-subtle'
                  )}
                >
                  <td className="sticky left-0 z-10 py-3 px-6 text-[18px] font-normal text-foreground bg-surface hover:bg-fill-alpha-subtle">
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