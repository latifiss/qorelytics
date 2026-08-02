import * as React from "react"
import { SVGProps } from "react"

interface PointIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const PointIcon = ({ 
  size = 24, 
  color = "#7FF86C",
  ...props 
}: PointIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill={color}
          d="m19.461 16-7.49 7.491-3.824-3.823 4.787-4.787H3.36V9.474h9.575L8.147 4.687 11.97.864l7.491 7.49 3.823 3.823L19.461 16Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default PointIcon