import * as React from "react"
import { SVGProps } from "react"

interface LoginIconProps extends SVGProps<SVGSVGElement> {
    size?: number
    color?: string
    strokeWidth?: number
}

const LoginIcon = ({ 
  size = 24, 
  color = "#13151B",
  strokeWidth = 1.8,
  ...props 
}: LoginIconProps) => {
  const calculatedStrokeWidth = (size / 24) * strokeWidth
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={calculatedStrokeWidth}
        d="m16 17 5-5-5-5m5 5H9m0-9H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21H9"
      />
    </svg>
  )
}

export default LoginIcon