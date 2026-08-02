import * as React from "react"
import { SVGProps } from "react"

interface HubspotIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const HubspotIcon = ({ 
  size = 24, 
  ...props 
}: HubspotIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#hubspot-icon-clip)">
        <mask
          id="hubspot-icon-mask"
          width={21}
          height={24}
          x={2}
          y={0}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M22.242 0H2.065v24h20.177V0Z" />
        </mask>
        <g mask="url(#hubspot-icon-mask)">
          <path
            fill="#FF4800"
            fillRule="evenodd"
            d="M17.499 6.188v2.465h-.004c2.258.345 4.061 2.04 4.524 4.25a5.384 5.384 0 0 1-2.447 5.676 5.526 5.526 0 0 1-6.236-.28l-2.03 2.006c.053.163.081.332.083.503 0 .972-.797 1.76-1.78 1.76a1.771 1.771 0 0 1-1.782-1.76c0-.972.797-1.76 1.781-1.76.173.002.345.03.51.081l2.051-2.028a5.35 5.35 0 0 1-.084-6.09L5.342 5.823a2.206 2.206 0 0 1-2.737-.453 2.143 2.143 0 0 1-.087-2.74 2.205 2.205 0 0 1 2.703-.622 2.154 2.154 0 0 1 1.146 2.497l6.858 5.28a5.48 5.48 0 0 1 2.591-1.127v-2.47a1.9 1.9 0 0 1-1.109-1.713v-.058a1.915 1.915 0 0 1 1.921-1.899h.059a1.915 1.915 0 0 1 1.92 1.899v.058A1.899 1.899 0 0 1 17.5 6.188Zm-3.647 7.805c-.003 1.532 1.252 2.777 2.802 2.78l.006.002c1.552 0 2.81-1.243 2.81-2.776 0-1.533-1.256-2.776-2.806-2.778-1.55-.001-2.81 1.24-2.812 2.772Z"
            clipRule="evenodd"
          />
        </g>
      </g>
      <defs>
        <clipPath id="hubspot-icon-clip">
          <path fill="#fff" d="M2 0h20.308v24H2z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default HubspotIcon