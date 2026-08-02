import * as React from "react"
import { SVGProps } from "react"

interface NextIconProps extends SVGProps<SVGSVGElement> {
  size?: number
    color?: string
    strokeWidth?: number
}

const NextIcon = ({ 
  size = 24, 
  color = "#13151B",
  strokeWidth = 1.8,
  ...props 
}: NextIconProps) => {
  const calculatedStrokeWidth = (size / 24) * strokeWidth
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size} 
      viewBox="0 0 24 20"
      fill="none"
      {...props}
    >
      <path
        stroke={color}
        strokeOpacity={0.38}
        strokeWidth={calculatedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.99963 1.99963V3.40003C3.99963 6.76003 3.99963 8.44003 4.65363 9.72403C5.22887 10.853 6.14671 11.7708 7.27563 12.346C8.55963 13 10.2396 13 13.5996 13H19.9992M15 18.0004L19.9992 13L15 8.00083"
      />
    </svg>
  )
}

export default NextIcon