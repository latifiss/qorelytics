import * as React from "react"
import { SVGProps } from "react"

interface VisualizationIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const VisualizationIcon = ({ 
  size = 24, 
  ...props 
}: VisualizationIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fill="#F75858"
        d="m4 12.004 7.647-4.122 7.647 4.122v5.874L11.647 22 4 17.878v-5.874Z"
      />
      <path fill="#FFD400" d="M11.647 16.126 4 12.004v5.874L11.647 22v-5.874Z" />
      <path
        fill="#8166E1"
        d="M4 6.122 11.647 2l7.647 4.122v5.874l-7.647 4.121L4 11.996V6.122Z"
      />
      <path fill="#BDAAFF" d="M11.647 10.243 4 6.122v5.873l7.647 4.122v-5.874Z" />
      <path
        fill="#7756EA"
        d="M11.647 10.244 4 6.122 11.647 2l7.647 4.122-7.647 4.122Z"
      />
    </svg>
  )
}

export default VisualizationIcon