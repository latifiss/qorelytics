import * as React from "react"
import { SVGProps } from "react"

interface ArrowUpProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const ArrowUpIcon = ({ 
  size = 24, 
  color = "#13151B",
  ...props 
}: ArrowUpProps) => {
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
        d="M12.417 20.841H10.3V8.412c-.214.743-.63 1.322-1.247 1.738-.617.39-1.354.585-2.21.585H5.03V8.43l1.568.02c1.12.012 2.028-.278 2.72-.87.68-.604 1.02-1.436 1.02-2.494v-.302h2.041v.302c0 1.058.34 1.89 1.02 2.494.693.592 1.6.882 2.72.87l1.569-.02v2.305h-1.814c-.856 0-1.593-.195-2.21-.585-.617-.416-1.033-.995-1.247-1.739v12.431Z"
      />
    </svg>
  )
}

export default ArrowUpIcon