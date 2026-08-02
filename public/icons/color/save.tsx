import * as React from "react"
import { SVGProps } from "react"

interface SaveIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const SaveIcon = ({ 
  size = 24, 
  color = "#55B6FF",
  ...props 
}: SaveIconProps) => {
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
        fill={color}
        d="M7 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14.14a.4.4 0 0 1-.658.306l-3.698-3.114a1 1 0 0 0-1.288 0l-3.698 3.114A.4.4 0 0 1 7 19.14V5Z"
      />
    </svg>
  )
}

export default SaveIcon