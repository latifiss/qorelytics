import * as React from "react"
import { SVGProps } from "react"

interface ScanIconProps extends SVGProps<SVGSVGElement> {
    size?: number
    color?: string
    strokeWidth?: number
    opacity?: number
}

const ScanIcon = ({ 
  size = 24, 
  color = "#13151B",
  strokeWidth = 1.8,
  opacity = 1,
  ...props 
}: ScanIconProps) => {
  const calculatedStrokeWidth = (size / 24) * strokeWidth
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={opacity}
        strokeWidth={calculatedStrokeWidth}
        d="M20 9V8a4 4 0 0 0-4-4h-1m5 11v1a4 4 0 0 1-4 4h-1m-6 0H8a4 4 0 0 1-4-4v-1m0-6V8a4 4 0 0 1 4-4h1"
      />
      <path
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth={calculatedStrokeWidth}
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
    </svg>
  )
}

export default ScanIcon