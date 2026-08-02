import * as React from "react"
import { SVGProps } from "react"

interface LeftIconProps extends SVGProps<SVGSVGElement> {
  size?: number
    color?: string
    strokeWidth?: number
}

const LeftIcon = ({ 
  size = 24, 
  color = "#13151B",
  strokeWidth = 1.8,
  ...props 
}: LeftIconProps) => {
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
        strokeWidth={calculatedStrokeWidth}
        d="m15 18-6-6 6-6"
      />
    </svg>
  )
}

export default LeftIcon