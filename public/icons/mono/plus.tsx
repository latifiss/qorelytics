import * as React from "react"
import { SVGProps } from "react"

interface PlusIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const PlusIcon = ({ 
  size = 24, 
  color = "#13151B",
  strokeWidth = 1.7,
  ...props 
}: PlusIconProps) => {
  const calculatedStrokeWidth = (size / 24) * strokeWidth;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={calculatedStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export default PlusIcon