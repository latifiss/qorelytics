import * as React from "react"
import { SVGProps } from "react"

interface StrategyIconProps extends SVGProps<SVGSVGElement> {
  size?: number
    color?: string
    strokeWidth?: number
}

const StrategyIcon = ({ 
  size = 20, 
    color = "#00B5CF",
  strokeWidth = 1.8,
  ...props 
}: StrategyIconProps) => {
    const calculatedStrokeWidth = (size / 24) * strokeWidth

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
        fill={color}
              fillOpacity={0.2}
              strokeWidth={calculatedStrokeWidth}
        d="M7.167 15.313a2.48 2.48 0 1 1-4.958 0 2.48 2.48 0 0 1 4.958 0Z"
      />
      <path
              fill={color}
              strokeWidth={calculatedStrokeWidth}
        d="M4.688 12.125a3.187 3.187 0 1 0 0 6.374 3.187 3.187 0 0 0 0-6.374Zm0 4.958a1.77 1.77 0 1 1 0-3.541 1.77 1.77 0 0 1 0 3.541Zm-2.98-9 1.27-1.27-1.27-1.27A.709.709 0 0 1 2.71 4.54l1.27 1.27 1.27-1.27a.709.709 0 0 1 1.002 1.002L4.98 6.813l1.27 1.27A.709.709 0 0 1 5.25 9.083l-1.27-1.27-1.27 1.27a.709.709 0 0 1-1.001-1.002Zm16.585 8.5a.708.708 0 1 1-1.002 1.002l-1.27-1.271-1.27 1.27a.709.709 0 1 1-1.002-1.002l1.27-1.27-1.27-1.27a.709.709 0 0 1 1.002-1.002l1.27 1.271 1.27-1.27a.709.709 0 0 1 1.002 1.002l-1.27 1.27 1.27 1.27Zm-4.001-7.926c-.547 1.977-2.242 3.686-4.12 4.155a.706.706 0 0 1-.873-.6.708.708 0 0 1 .53-.774c1.384-.346 2.688-1.674 3.1-3.16.282-1.017.285-2.567-1.303-4.152l-.209-.208V5.75a.709.709 0 0 1-1.417 0V2.208a.708.708 0 0 1 .709-.708h3.541a.708.708 0 0 1 0 1.417h-1.832l.209.207c1.614 1.616 2.206 3.58 1.665 5.533Z"
      />
    </svg>
  )
}

export default StrategyIcon