import * as React from "react"
import { SVGProps } from "react"

interface WordIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const WordIcon = ({ 
  size = 24, 
  ...props 
}: WordIconProps) => {
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
        fill="#41A5EE"
        d="M22.978 1H6.605c-.565 0-1.023.458-1.023 1.023v4.558l9.488 2.791L24 6.582V2.022C24 1.458 23.544 1 22.979 1Z"
      />
      <path
        fill="#2B7CD3"
        d="M24 6.581H5.583v5.581l9.488 1.675L24 12.162V6.581Z"
      />
      <path
        fill="#185ABD"
        d="M5.582 12.163v5.581l8.93 1.117 9.489-1.117v-5.58H5.582Z"
      />
      <path
        fill="#103F91"
        d="M6.605 23.326h16.373c.565 0 1.023-.459 1.023-1.024v-4.558H5.582v4.558c0 .566.458 1.024 1.023 1.024Z"
      />
      <path
        fill="#000"
        d="M12.373 5.465H5.582v13.953h6.79a1.026 1.026 0 0 0 1.024-1.023V6.488a1.026 1.026 0 0 0-1.023-1.023Z"
        opacity={0.1}
      />
      <path
        fill="#000"
        d="M11.815 6.023H5.582v13.954h6.233a1.026 1.026 0 0 0 1.023-1.023V7.047a1.026 1.026 0 0 0-1.023-1.024Z"
        opacity={0.2}
      />
      <path
        fill="#000"
        d="M11.815 6.023H5.582v12.838h6.233a1.026 1.026 0 0 0 1.023-1.023V7.047a1.026 1.026 0 0 0-1.023-1.024Z"
        opacity={0.2}
      />
      <path
        fill="#000"
        d="M11.257 6.023H5.582v12.838h5.675a1.026 1.026 0 0 0 1.023-1.023V7.047a1.026 1.026 0 0 0-1.023-1.024Z"
        opacity={0.2}
      />
      <path
        fill="url(#word-icon-gradient)"
        d="M1.023 6.023h10.233c.565 0 1.023.458 1.023 1.024v10.232c0 .566-.458 1.023-1.023 1.023H1.023A1.023 1.023 0 0 1 0 17.28V7.047c0-.566.458-1.024 1.023-1.024Z"
      />
      <path
        fill="#fff"
        d="M4.198 13.87c.02.157.034.295.04.412h.023c.01-.111.028-.246.056-.403.028-.157.054-.29.077-.4L5.47 8.838H6.86l1.116 4.573c.065.284.112.573.14.863h.018c.02-.281.06-.561.116-.837l.89-4.601h1.267l-1.564 6.653h-1.48l-1.06-4.406a10.283 10.283 0 0 1-.177-.943H6.11c-.013.109-.037.27-.072.483-.036.213-.065.37-.086.473l-.997 4.392H3.449l-1.572-6.65h1.29l.969 4.652c.022.096.042.223.062.38Z"
      />
      <defs>
        <linearGradient
          id="word-icon-gradient"
          x1={2.133}
          x2={10.146}
          y1={5.224}
          y2={19.102}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2368C4" />
          <stop offset={0.5} stopColor="#1A5DBE" />
          <stop offset={1} stopColor="#1146AC" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default WordIcon