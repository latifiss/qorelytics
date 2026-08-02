import * as React from "react"
import { SVGProps } from "react"

interface ArrowDownProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const ArrowDownIcon = ({ 
  size = 24, 
  color = "#13151B",
  ...props 
}: ArrowDownProps) => {
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
        d="M12.417 3.158H10.3V15.59c-.214-.743-.63-1.322-1.247-1.738-.617-.39-1.354-.585-2.21-.585H5.03v2.305l1.568-.02c1.12-.012 2.028.278 2.72.87.68.604 1.02 1.436 1.02 2.494v.302h2.041v-.302c0-1.058.34-1.89 1.02-2.494.693-.592 1.6-.882 2.72-.87l1.569.02v-2.305h-1.814c-.856 0-1.593.195-2.21.585-.617.416-1.033.995-1.247 1.738V3.16Z"
      />
    </svg>
  )
}

export default ArrowDownIcon