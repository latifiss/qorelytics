import * as React from "react"
import { SVGProps } from "react"

interface CloseIconProps extends SVGProps<SVGSVGElement> {
    size?: number
    color?: string
    strokeWidth?: number
}

const CloseIcon = ({ 
  size = 24, 
  color = "#13151B",
  strokeWidth = 1.8,
  ...props 
}: CloseIconProps) => {
  const calculatedStrokeWidth = (size / 24) * strokeWidth
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={calculatedStrokeWidth}
        d="M17.071 6.929L6.929 17.071M6.929 6.929L17.071 17.071"
      />
    </svg>
  )
}

export default CloseIcon