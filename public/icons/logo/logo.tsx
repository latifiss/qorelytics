import * as React from "react"
import { SVGProps } from "react"

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const Logo = ({ 
  size = 169, 
  color = "#000000",
  ...props 
}: LogoProps) => {
  const width = size
  const height = size * (143 / 169)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 169 143"
      fill="none"
      {...props}
    >
      <mask
        id="logo-mask"
        width={117}
        height={143}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path fill="#fff" d="M117 0H0v143h117V0Z" />
      </mask>
      <g mask="url(#logo-mask)">
        <path
          fill={color}
          d="M114 136.8c-3.525 3.525-9.75 5.7-16.125 5.7-8.85 0-15.3-2.925-22.575-10.2l-16.8-16.8h-1.275C24.975 115.5 0 91.125 0 59.625 0 24.75 24.75 0 59.775 0 92.025 0 117 24.375 117 55.875c0 28.425-16.425 50.1-41.475 57.15l16.5 7.725c6.525 3.075 11.175 4.275 21.975 5.55v10.5Zm-54.6-32.025c14.475 0 22.5-15.75 22.5-44.175 0-32.325-8.625-49.95-24.375-49.95-14.475 0-22.5 15.75-22.5 44.175 0 32.325 8.625 49.95 24.375 49.95Z"
        />
      </g>
      <path
        fill="#7FF86C"
        d="M152.443 0H120v16.557h20.733L120 37.29 131.71 49l20.733-20.733V49H169V0h-16.557Z"
      />
    </svg>
  )
}

export default Logo