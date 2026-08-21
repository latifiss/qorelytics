import * as React from "react"
import { SVGProps } from "react"

interface PointDIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const PointDIcon = ({ size = 24, color = "#33C771", ...props }: PointDIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 228 224"
      {...props}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M46.056 112 0 85.388l33.946-58.776 46.082 26.566L80.054 0h67.892l.026 53.178 46.082-26.566L228 85.388 181.944 112 228 138.612l-33.946 58.776-46.082-26.566-.026 53.178H80.054l-.026-53.178-46.082 26.566L0 138.612 46.056 112Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default PointDIcon