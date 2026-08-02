import * as React from "react"
import { SVGProps } from "react"

interface HamburgerMenuProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const HamburgerMenuIcon = ({ 
  size = 24, 
  color = "#13151B",
  ...props 
}: HamburgerMenuProps) => {
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
        fill={color}
        d="M23.127 4.582H.873a.873.873 0 1 0 0 1.745h22.254a.873.873 0 1 0 0-1.745ZM23.127 11.127H.873a.873.873 0 1 0 0 1.746h22.254a.873.873 0 0 0 0-1.746ZM23.127 17.673H.873a.873.873 0 0 0 0 1.745h22.254a.873.873 0 1 0 0-1.745Z"
      />
    </svg>
  )
}

export default HamburgerMenuIcon