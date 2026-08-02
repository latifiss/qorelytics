import * as React from "react"
import { SVGProps } from "react"

interface XIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const XIcon = ({ 
  size = 24, 
  ...props 
}: XIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#x-icon-clip)">
        <path
          fill="#000"
          d="M17.925 2.4h3.243l-7.083 8.15 8.363 11.05h-6.57l-5.12-6.699L4.868 21.6H1.627l7.594-8.704L1.2 2.4H7.94l4.651 6.144L17.925 2.4Zm-1.152 17.237h1.792L6.96 4.235H4.997l11.776 15.402Z"
        />
      </g>
      <defs>
        <clipPath id="x-icon-clip">
          <path fill="#fff" d="M1.2 2.4h21.248v19.2H1.2z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default XIcon