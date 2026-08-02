import * as React from "react"
import { SVGProps } from "react"

interface FacebookIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const FacebookIcon = ({ 
  size = 24, 
  ...props 
}: FacebookIconProps) => {
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
        fill="#1877F2"
        d="m17.214 13.328.622-4.095h-3.89V6.577c0-1.12.542-2.214 2.284-2.214H18V.877S16.395.6 14.86.6c-3.205 0-5.298 1.962-5.298 5.512v3.121H6v4.095h3.562v9.9a13.982 13.982 0 0 0 4.384 0v-9.9h3.268Z"
      />
    </svg>
  )
}

export default FacebookIcon