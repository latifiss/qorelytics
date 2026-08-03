import * as React from "react"
import { SVGProps } from "react"

interface ChxIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const ChxIcon = ({
  size = 24,
  color = "#7FF86C",
  ...props
}: ChxIconProps) => {
  // Maintain aspect ratio (49/49 = 1)
  const width = size
  const height = size

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 49 49"
      fill="none"
      {...props}
    >
      <path
        fill={color}
        d="M14.859 39.115 34.606 3.332l12.85 7.09-19.748 35.783z"
      />
      <path
        fill={color}
        d="m2.43 32.247 7.09-12.85 12.85 7.092-7.091 12.849z"
      />
    </svg>
  )
}

export default ChxIcon