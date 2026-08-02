import * as React from "react"
import { SVGProps } from "react"

interface RoundCheckProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const RoundCheckIcon = ({ 
  size = 24, 
  ...props 
}: RoundCheckProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <mask
        id="round-check-mask"
        width={22}
        height={22}
        x={1}
        y={1}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path
          fill="#fff"
          stroke="#fff"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 22a9.971 9.971 0 0 0 7.071-2.929A9.972 9.972 0 0 0 22 12a9.971 9.971 0 0 0-2.929-7.071A9.97 9.97 0 0 0 12 2a9.97 9.97 0 0 0-7.071 2.929A9.97 9.97 0 0 0 2 12a9.97 9.97 0 0 0 2.929 7.071A9.971 9.971 0 0 0 12 22Z"
        />
        <path
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m8 12 3 3 6-6"
        />
      </mask>
      <g mask="url(#round-check-mask)">
        <path fill="#FF7DA0" d="M0 0h24v24H0V0Z" />
      </g>
    </svg>
  )
}

export default RoundCheckIcon