import * as React from "react"
import { SVGProps } from "react"

interface PointGIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const PointGIcon = ({ size = 24, color = "#9255E3", ...props }: PointGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 241 198"
      {...props}
    >
      <path
        fill={color}
        d="M.36 128.243C-4.96 80.963 48.91 0 143.698 0c55.155 0 97.099 25.5 97.099 80.317C240.797 142 149.515 189.124 98.12 196c-52.323 7-91.823-15-97.76-67.757Z"
      />
    </svg>
  )
}

export default PointGIcon