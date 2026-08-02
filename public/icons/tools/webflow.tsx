import * as React from "react"
import { SVGProps } from "react"

interface WebflowIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const WebflowIcon = ({ 
  size = 24, 
  ...props 
}: WebflowIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#webflow-icon-clip)">
        <path fill="#4353FF" d="M24 0v24H0V0h24Z" />
        <path
          fill="#fff"
          d="M16.254 10.056s-1.218 3.816-1.308 4.14c-.036-.318-.924-7.176-.924-7.176-2.076 0-3.18 1.476-3.768 3.036 0 0-1.482 3.828-1.602 4.146-.006-.3-.228-4.11-.228-4.11C8.298 8.178 6.552 7.02 5.136 7.02L6.84 17.406c2.172-.006 3.342-1.476 3.954-3.042 0 0 1.302-3.378 1.356-3.528.012.144.936 6.57.936 6.57 2.178 0 3.354-1.374 3.984-2.88l3.054-7.506c-2.154 0-3.288 1.47-3.87 3.036Z"
        />
      </g>
      <defs>
        <clipPath id="webflow-icon-clip">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default WebflowIcon