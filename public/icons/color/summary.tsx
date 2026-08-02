import * as React from "react"
import { SVGProps } from "react"

interface SummaryIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const SummaryIcon = ({ 
  size = 24, 
  ...props 
}: SummaryIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path fill="#A259FF" d="M11.567 20.311a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path fill="#fff" d="m16.717 4.81-1 14h-8.5l-1-14h10.5Z" />
      <path
        fill="#fff"
        d="M16.517 3.31a.9.9 0 0 1 .9.9v16.2a.9.9 0 0 1-.9.9h-9.9a.9.9 0 0 1-.9-.9V4.21a.9.9 0 0 1 .9-.9h9.9Zm-1.8 13.95h-6.3v.9h6.3v-.9Zm1.35-4.5h-4.05v.9h4.05v-.9Zm-5.4 0h-3.6v.9h3.6v-.9Zm.9-2.25h-3.15v.9h3.15v-.9Zm4.5-2.25h-5.4v.9h5.4v-.9Zm-4.5-2.25h-4.5v.9h4.5v-.9Z"
      />
      <path
        fill="#1EBE92"
        d="M16.517 3.31a.9.9 0 0 1 .9.9v16.2a.9.9 0 0 1-.9.9h-9.9a.9.9 0 0 1-.9-.9V4.21a.9.9 0 0 1 .9-.9h9.9Zm-1.8 13.95h-6.3v.9h6.3v-.9Zm1.35-4.5h-4.05v.9h4.05v-.9Zm-5.4 0h-3.6v.9h3.6v-.9Zm.9-2.25h-3.15v.9h3.15v-.9Zm4.5-2.25h-5.4v.9h5.4v-.9Zm-4.5-2.25h-4.5v.9h4.5v-.9Z"
      />
    </svg>
  )
}

export default SummaryIcon