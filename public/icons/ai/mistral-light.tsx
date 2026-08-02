import * as React from "react"
import { SVGProps } from "react"

interface MistralLightIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const MistralLightIcon = ({ 
  size = 24, 
  ...props 
}: MistralLightIconProps) => {
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
        fill="gold"
        d="M3.428 3.4h3.429v3.428H3.428V3.4Zm13.714 0h3.43v3.428h-3.43V3.4Z"
      />
      <path
        fill="#FFAF00"
        d="M3.428 6.828h6.857v3.429H3.429l-.001-3.429Zm10.286 0h6.857v3.429h-6.857V6.828Z"
      />
      <path fill="#FF8205" d="M3.428 10.258h17.144v3.428H3.428v-3.428Z" />
      <path
        fill="#FA500F"
        d="M3.428 13.686h3.429v3.428H3.428v-3.428Zm6.858 0h3.429v3.428h-3.429v-3.428Zm6.856 0h3.43v3.428h-3.43v-3.428Z"
      />
      <path
        fill="#E10500"
        d="M0 17.114h10.286v3.429H0v-3.429Zm13.714 0H24v3.429H13.714v-3.429Z"
      />
    </svg>
  )
}

export default MistralLightIcon