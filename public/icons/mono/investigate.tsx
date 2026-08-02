import * as React from "react"
import { SVGProps } from "react"

interface InvestigateIconProps extends SVGProps<SVGSVGElement> {
    size?: number
    color?: string
    strokeWidth?: number
}

const InvestigateIcon = ({ 
  size = 24, 
  color = "#FA2413",
  strokeWidth = 1.5,
  ...props 
}: InvestigateIconProps) => {
  const calculatedStrokeWidth = (size / 20) * strokeWidth
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={calculatedStrokeWidth}
        d="M4.82 15.377a3.52 3.52 0 1 0 0-7.039 3.52 3.52 0 0 0 0 7.04Z"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={calculatedStrokeWidth}
        d="M1.722 10.155C2.78 7.265 4.22 4.347 6.9 5.015c2.377.593 2.094 4.479 1.396 7.504M15.131 15.377a3.52 3.52 0 1 1 0-7.039 3.52 3.52 0 0 1 0 7.04Z"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={calculatedStrokeWidth}
        d="M18.229 10.155c-1.058-2.89-2.5-5.808-5.179-5.14-2.377.593-2.094 4.479-1.396 7.504M8.5 11.844c.664-1.122 2.335-1.045 2.921-.117"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={calculatedStrokeWidth}
        d="M8.83 8.816c.514-.915 1.805-.852 2.258-.095"
      />
    </svg>
  )
}

export default InvestigateIcon