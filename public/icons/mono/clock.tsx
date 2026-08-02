import * as React from "react"
import { SVGProps } from "react"

interface ClockIconProps extends SVGProps<SVGSVGElement> {
    size?: number
    color?: string
}

const ClockIcon = ({ 
  size = 24, 
  color = "#13151B",
  ...props 
}: ClockIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g fill={color}>
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18.4c-4.634 0-8.4-3.766-8.4-8.4S7.366 3.6 12 3.6s8.4 3.766 8.4 8.4-3.766 8.4-8.4 8.4Z" />
        
        <path d="M12 5.6a1 1 0 0 0-1 1v5.086l2.657 2.657a1 1 0 0 0 1.414-1.414L13.2 11.2V6.6a1 1 0 0 0-1-1Z" />
      </g>
    </svg>
  )
}

export default ClockIcon