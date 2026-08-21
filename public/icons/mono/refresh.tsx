import * as React from "react"
import { SVGProps } from "react"

interface RefreshIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

const RefreshIcon = ({ size = 16, ...props }: RefreshIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.785 7.56a4.25 4.25 0 0 1 7.91-1.73"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.615 5.83h2.08V3.75"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.215 8.44a4.25 4.25 0 0 1-7.91 1.73"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.385 10.17h-2.08v2.08"
      />
    </svg>
  )
}

export default RefreshIcon