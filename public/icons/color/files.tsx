import * as React from "react"
import { SVGProps } from "react"

interface FilesIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const FilesIcon = ({ 
  size = 24, 
  ...props 
}: FilesIconProps) => {
  const calculatedStrokeWidth = size / 24
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox={`0 0 ${size} ${size}`}
      {...props}
    >
      <rect
        width={12 * calculatedStrokeWidth}
        height={10 * calculatedStrokeWidth}
        x={6 * calculatedStrokeWidth}
        y={2.5 * calculatedStrokeWidth}
        fill="#DDDFEA"
        opacity={0.5}
        rx={1 * calculatedStrokeWidth}
      />
      <rect
        width={16 * calculatedStrokeWidth}
        height={11 * calculatedStrokeWidth}
        x={4 * calculatedStrokeWidth}
        y={6.5 * calculatedStrokeWidth}
        fill="#DDDFEA"
        rx={2 * calculatedStrokeWidth}
      />
      <rect
        width={20 * calculatedStrokeWidth}
        height={11 * calculatedStrokeWidth}
        x={2 * calculatedStrokeWidth}
        y={10.5 * calculatedStrokeWidth}
        fill="#9FA5BA"
        rx={2 * calculatedStrokeWidth}
      />
    </svg>
  )
}

export default FilesIcon