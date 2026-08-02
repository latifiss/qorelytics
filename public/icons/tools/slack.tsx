import * as React from "react"
import { SVGProps } from "react"

interface SlackIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const SlackIcon = ({ 
  size = 24, 
  ...props 
}: SlackIconProps) => {
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
        fill="#36C5F0"
        d="M9.333 2a2 2 0 0 0 0 4h2V4a1.997 1.997 0 0 0-2-2Zm0 5.333H4a2 2 0 0 0 0 4h5.334a2 2 0 0 0 0-4Z"
      />
      <path
        fill="#2EB67D"
        d="M22 9.333a2 2 0 0 0-4 0v2h2a1.997 1.997 0 0 0 2-2Zm-5.333 0V4a1.996 1.996 0 0 0-2-2 2 2 0 0 0-2 2v5.333a2 2 0 1 0 4 0"
      />
      <path
        fill="#ECB22E"
        d="M14.666 22a2.004 2.004 0 0 0 2-2 1.996 1.996 0 0 0-2-2h-2v2a2 2 0 0 0 2 2Zm0-5.333H20a2 2 0 0 0 0-4h-5.334a2 2 0 0 0 0 4"
      />
      <path
        fill="#E01E5A"
        d="M2 14.667a1.995 1.995 0 0 0 1.234 1.847A2.004 2.004 0 0 0 6 14.667v-2H4a2 2 0 0 0-2 2Zm5.333 0V20a2 2 0 1 0 4 0v-5.333a1.995 1.995 0 0 0-1.234-1.848 2 2 0 0 0-2.766 1.847Z"
      />
    </svg>
  )
}

export default SlackIcon