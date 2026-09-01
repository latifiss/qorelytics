import * as React from "react"
import { SVGProps } from "react"

interface PointFIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const PointFIcon = ({ size = 24, color = "#2CC5F7", ...props }: PointFIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 219 252"
      {...props}
    >
      <path
        fill={color}
        d="m109.119 0 109.119 63v126l-109.119 63-109.12-63V63L109.12 0Z"
      />
    </svg>
  )
}

export default PointFIcon