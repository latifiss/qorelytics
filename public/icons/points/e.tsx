import * as React from "react"
import { SVGProps } from "react"

interface PointEIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const PointEIcon = ({ size = 24, color = "#F2994A", ...props }: PointEIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 268 268"
      {...props}
    >
      <path
        fill={color}
        d="M130.424 3.177c.503-4.236 6.649-4.236 7.152 0l4.216 35.532c5.444 45.881 41.618 82.055 87.499 87.499l35.532 4.216c4.236.503 4.236 6.649 0 7.152l-35.532 4.216c-45.881 5.444-82.055 41.618-87.499 87.499l-4.216 35.532c-.503 4.236-6.649 4.236-7.152 0l-4.216-35.532c-5.444-45.881-41.618-82.055-87.5-87.499l-35.531-4.216c-4.236-.503-4.236-6.649 0-7.152l35.532-4.216c45.881-5.444 82.055-41.618 87.499-87.5l4.216-35.531Z"
      />
    </svg>
  )
}

export default PointEIcon