import * as React from "react"
import { SVGProps } from "react"

interface YoutubeIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const YoutubeIcon = ({ 
  size = 24, 
  ...props 
}: YoutubeIconProps) => {
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
        fill="#ED1D24"
        d="M23.498 6.78a3.01 3.01 0 0 0-2.121-2.128C19.505 4.149 12 4.149 12 4.149s-7.505 0-9.377.503A3.01 3.01 0 0 0 .502 6.78C0 8.658 0 12.575 0 12.575s0 3.916.502 5.794a3.01 3.01 0 0 0 2.121 2.128C4.495 21 12 21 12 21s7.505 0 9.377-.503a3.01 3.01 0 0 0 2.122-2.128C24 16.49 24 12.575 24 12.575s0-3.917-.502-5.795Z"
      />
      <path fill="#fff" d="m9.545 16.13 6.273-3.555-6.273-3.557v7.113Z" />
    </svg>
  )
}

export default YoutubeIcon