import * as React from "react"
import { SVGProps } from "react"

interface SigIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const SigIcon = ({ 
  size = 49, 
  color = "#7FF86C",
  ...props 
}: SigIconProps) => {
  const width = size
  const height = size

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 49 49"
      fill="none"
      {...props}
    >
      <path
        fill={color}
        d="M32.443 0H0v16.557h20.733L0 37.29 11.71 49l20.733-20.733V49H49V0H32.443Z"
      />
    </svg>
  )
}

export default SigIcon