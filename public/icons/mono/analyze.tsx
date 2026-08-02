import * as React from "react"
import { SVGProps } from "react"

interface AnalyzeIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
  strokeWidth?: number
}

const AnalyzeIcon = ({ 
  size = 20, 
  color = "#10B981",
  strokeWidth = 1.8,
  ...props 
}: AnalyzeIconProps) => {
  const calculatedStrokeWidth = (size / 24) * strokeWidth
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={calculatedStrokeWidth}
        d="M4.007 12.431V10.67h11.987v1.762M10 8.45v3.629m-7.932 4.039a1.85 1.85 0 1 0 3.702 0 1.85 1.85 0 0 0-3.702 0Zm6.17-1.747h3.525v3.525H8.237V14.37Zm9.695 3.525h-4.23l2.114-3.878 2.116 3.878ZM12.645 4.748a2.645 2.645 0 1 0-3.702 2.419V8.45h2.115V7.167a2.642 2.642 0 0 0 1.587-2.42Z"
      />
    </svg>
  )
}

export default AnalyzeIcon