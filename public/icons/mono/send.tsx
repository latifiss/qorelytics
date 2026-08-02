import * as React from "react"
import { SVGProps } from "react"

interface SendIconProps extends SVGProps<SVGSVGElement> {
  size?: number
    color?: string
    strokeWidth?: number
}

const SendIcon = ({ 
  size = 24, 
  color = "#13151B",
  strokeWidth = 1.8,
  ...props 
}: SendIconProps) => {
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
        d="M12 19V5m7 7-7-7-7 7"
      />
    </svg>
  )
}

export default SendIcon