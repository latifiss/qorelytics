import * as React from "react"
import { SVGProps } from "react"

interface CopyIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

const CopyIcon = ({ size = 16, ...props }: CopyIconProps) => {
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
        d="M9.035 6.025h-4.6a1 1 0 0 0-1 1v4.6a1 1 0 0 0 1 1h4.6a1 1 0 0 0 1-1v-4.6a1 1 0 0 0-1-1Z"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.035 9.985h1.53c.55 0 1-.45 1-1v-4.61c0-.55-.45-1-1-1h-4.6c-.56 0-1 .45-1 1v1.65"
      />
    </svg>
  )
}

export default CopyIcon