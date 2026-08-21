import * as React from "react"
import { SVGProps } from "react"

interface PointBIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const PointBIcon = ({ size = 24, color = "#FF3030", ...props }: PointBIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 232 232"
      {...props}
    >
      <path
        fill={color}
        d="M58 0C25.968 0 0 25.968 0 58c0 32.033 25.968 58 58 58-32.032 0-58 25.967-58 58s25.968 58 58 58c32.033 0 58-25.967 58-58 0 32.033 25.967 58 58 58s58-25.967 58-58-25.967-58-58-58c32.033 0 58-25.967 58-58 0-32.032-25.967-58-58-58s-58 25.968-58 58c0-32.032-25.967-58-58-58Z"
      />
    </svg>
  )
}

export default PointBIcon