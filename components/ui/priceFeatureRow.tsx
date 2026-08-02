import React from "react"

interface PriceFeatureRowProps {
  icon: React.ReactNode
  label: string
}

const PriceFeatureRow = ({ icon, label }: PriceFeatureRowProps) => {
  return (
    <div className="grid grid-cols-[24px_1fr] gap-2 w-full items-center py-1.5">
      <div className="flex items-center justify-start">
        {icon}
      </div>
      <span className="text-[18px] text-foreground">{label}</span>
    </div>
  )
}

export default PriceFeatureRow