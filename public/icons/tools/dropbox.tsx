import * as React from "react"
import { SVGProps } from "react"

interface DropboxIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const DropboxIcon = ({ 
  size = 24, 
  ...props 
}: DropboxIconProps) => {
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
        fill="#0062FF"
        d="M6 2 0 5.849l6 3.792 6-3.792L6 2Zm12 0-6 3.849 6 3.792 6-3.792L18 2ZM0 13.49l6 3.85 6-3.85-6-3.849-6 3.85Zm18-3.849-6 3.85 6 3.849 6-3.85-6-3.849ZM6 18.585l6 3.849 6-3.85-6-3.792-6 3.793Z"
      />
    </svg>
  )
}

export default DropboxIcon