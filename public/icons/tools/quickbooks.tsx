import * as React from "react"
import { SVGProps } from "react"

interface QuickbooksIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const QuickbooksIcon = ({ 
  size = 24, 
  ...props 
}: QuickbooksIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#quickbooks-icon-clip)">
        <path
          fill="#2CA01C"
          d="M12 23.709c6.627 0 12-5.308 12-11.854C24 5.306 18.627 0 12 0S0 5.307 0 11.854C0 18.401 5.373 23.71 12 23.71Z"
        />
        <path
          fill="#fff"
          d="M3.332 11.854c0 2.546 2.089 4.61 4.667 4.61h.667v-1.713h-.667c-1.618 0-2.934-1.299-2.934-2.896 0-1.599 1.316-2.898 2.934-2.898H9.6v8.956c0 .946.775 1.712 1.733 1.712V7.245H8c-2.578 0-4.667 2.063-4.667 4.61Zm12.67-4.61h-.667v1.714H16c1.618 0 2.934 1.299 2.934 2.896 0 1.599-1.316 2.898-2.934 2.898H14.4V5.796c0-.946-.775-1.712-1.734-1.712v12.38h3.336c2.577 0 4.667-2.063 4.667-4.61 0-2.544-2.09-4.61-4.667-4.61Z"
        />
      </g>
      <defs>
        <clipPath id="quickbooks-icon-clip">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default QuickbooksIcon