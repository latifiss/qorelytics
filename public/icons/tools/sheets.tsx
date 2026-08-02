import * as React from "react"
import { SVGProps } from "react"

interface SheetsIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const SheetsIcon = ({ 
  size = 24, 
  ...props 
}: SheetsIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#sheets-icon-clip)">
        <mask
          id="sheets-icon-mask-b"
          width={16}
          height={21}
          x={4}
          y={2}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path
            fill="#fff"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
          />
        </mask>
        <g mask="url(#sheets-icon-mask-b)">
          <path
            fill="#0F9D58"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-3.381-2.318-2.415-3.246Z"
          />
        </g>
        <mask
          id="sheets-icon-mask-c"
          width={16}
          height={21}
          x={4}
          y={2}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path
            fill="#fff"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
          />
        </mask>
        <g mask="url(#sheets-icon-mask-c)">
          <path
            fill="#F1F1F1"
            d="M8.136 12.267v6.723h7.728v-6.723H8.136Zm3.381 5.796H9.102v-1.16h2.415v1.16Zm0-1.855H9.102v-1.159h2.415v1.159Zm0-1.854H9.102v-1.16h2.415v1.16Zm3.381 3.709h-2.415v-1.16h2.415v1.16Zm0-1.855h-2.415v-1.159h2.415v1.159Zm0-1.854h-2.415v-1.16h2.415v1.16Z"
          />
        </g>
        <mask
          id="sheets-icon-mask-d"
          width={16}
          height={21}
          x={4}
          y={2}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path
            fill="#fff"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
          />
        </mask>
        <g mask="url(#sheets-icon-mask-d)">
          <path fill="url(#sheets-icon-gradient-e)" d="m14.356 7.456 5.372 5.155V7.863l-5.372-.407Z" />
        </g>
        <mask
          id="sheets-icon-mask-f"
          width={16}
          height={21}
          x={4}
          y={2}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path
            fill="#fff"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
          />
        </mask>
        <g mask="url(#sheets-icon-mask-f)">
          <path
            fill="#87CEAC"
            d="M13.932 2.3v4.172c0 .768.648 1.39 1.449 1.39h4.347L13.932 2.3Z"
          />
        </g>
        <mask
          id="sheets-icon-mask-g"
          width={16}
          height={21}
          x={4}
          y={2}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path
            fill="#fff"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
          />
        </mask>
        <g mask="url(#sheets-icon-mask-g)">
          <path
            fill="#fff"
            fillOpacity={0.2}
            d="M5.721 2.3c-.797 0-1.449.625-1.449 1.39v.116c0-.765.652-1.39 1.45-1.39h8.21v-.117h-8.21Z"
          />
        </g>
        <mask
          id="sheets-icon-mask-h"
          width={16}
          height={21}
          x={4}
          y={2}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path
            fill="#fff"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
          />
        </mask>
        <g mask="url(#sheets-icon-mask-h)">
          <path
            fill="#263238"
            fillOpacity={0.2}
            d="M18.279 22.583H5.72c-.797 0-1.449-.626-1.449-1.391v.116c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39v-.116c0 .765-.652 1.39-1.45 1.39Z"
          />
        </g>
        <mask
          id="sheets-icon-mask-i"
          width={16}
          height={21}
          x={4}
          y={2}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "alpha",
          }}
        >
          <path
            fill="#fff"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
          />
        </mask>
        <g mask="url(#sheets-icon-mask-i)">
          <path
            fill="#263238"
            fillOpacity={0.1}
            d="M15.38 7.863c-.8 0-1.448-.623-1.448-1.391v.116c0 .768.648 1.39 1.449 1.39h4.347v-.115H15.38Z"
          />
        </g>
        <path
          fill="url(#sheets-icon-gradient-j)"
          d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
        />
      </g>
      <defs>
        <radialGradient
          id="sheets-icon-gradient-j"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(24.9222 0 0 23.9226 4.762 2.705)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity={0.1} />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <linearGradient
          id="sheets-icon-gradient-e"
          x1={17.042}
          x2={17.042}
          y1={7.899}
          y2={12.612}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#263238" stopOpacity={0.2} />
          <stop offset={1} stopColor="#263238" stopOpacity={0.02} />
        </linearGradient>
        <clipPath id="sheets-icon-clip">
          <path fill="#fff" d="M4 2h16v21H4z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default SheetsIcon