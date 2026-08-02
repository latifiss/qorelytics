import * as React from "react"
import { SVGProps } from "react"

interface CSVIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const CSVIcon = ({ 
  size = 24, 
  ...props 
}: CSVIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#csv-icon-clip)">
        <mask
          id="csv-icon-mask-b"
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
            fill="#85779E"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
          />
        </mask>
        <g mask="url(#csv-icon-mask-b)">
          <path
            fill="#027A40"
            d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-3.381-2.318-2.415-3.246Z"
          />
        </g>
        <mask
          id="csv-icon-mask-c"
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
        <g mask="url(#csv-icon-mask-c)">
          <path fill="url(#csv-icon-gradient-d)" d="m14.356 7.456 5.372 5.155V7.863l-5.372-.407Z" />
        </g>
        <mask
          id="csv-icon-mask-e"
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
        <g mask="url(#csv-icon-mask-e)">
          <path
            fill="#87CEAC"
            d="M13.932 2.3v4.172c0 .768.648 1.39 1.449 1.39h4.347L13.932 2.3Z"
          />
        </g>
        <mask
          id="csv-icon-mask-f"
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
        <g mask="url(#csv-icon-mask-f)">
          <path
            fill="#fff"
            fillOpacity={0.2}
            d="M5.721 2.3c-.797 0-1.449.625-1.449 1.39v.116c0-.765.652-1.39 1.45-1.39h8.21v-.117h-8.21Z"
          />
        </g>
        <mask
          id="csv-icon-mask-g"
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
        <g mask="url(#csv-icon-mask-g)">
          <path
            fill="#263238"
            fillOpacity={0.2}
            d="M18.279 22.583H5.72c-.797 0-1.449-.626-1.449-1.391v.116c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39v-.116c0 .765-.652 1.39-1.45 1.39Z"
          />
        </g>
        <mask
          id="csv-icon-mask-h"
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
        <g mask="url(#csv-icon-mask-h)">
          <path
            fill="#263238"
            fillOpacity={0.1}
            d="M15.38 7.863c-.8 0-1.448-.623-1.448-1.391v.116c0 .768.648 1.39 1.449 1.39h4.347v-.115H15.38Z"
          />
        </g>
        <path
          fill="url(#csv-icon-gradient-i)"
          d="M13.932 2.3h-8.21c-.798 0-1.45.625-1.45 1.39v17.618c0 .765.652 1.39 1.45 1.39h12.557c.797 0 1.449-.625 1.449-1.39V7.863l-5.796-5.564Z"
        />
      </g>
      <path
        fill="#fff"
        d="M5.85 15.9c0-.412.092-.78.276-1.104.188-.328.442-.582.762-.762a2.16 2.16 0 0 1 1.086-.276c.468 0 .878.12 1.23.36s.598.572.738.996h-.966a.996.996 0 0 0-.408-.45c-.172-.1-.372-.15-.6-.15a1.24 1.24 0 0 0-.654.174 1.173 1.173 0 0 0-.444.48 1.618 1.618 0 0 0-.156.732c0 .276.052.52.156.732.108.208.256.37.444.486.192.112.41.168.654.168.228 0 .428-.05.6-.15.176-.104.312-.256.408-.456h.966c-.14.428-.386.762-.738 1.002-.348.236-.758.354-1.23.354-.4 0-.762-.09-1.086-.27a2.049 2.049 0 0 1-.762-.762A2.196 2.196 0 0 1 5.85 15.9ZM12.105 18.042c-.292 0-.556-.05-.792-.15a1.298 1.298 0 0 1-.552-.432 1.137 1.137 0 0 1-.21-.666h.9a.588.588 0 0 0 .18.408c.112.1.264.15.456.15.196 0 .35-.046.462-.138a.467.467 0 0 0 .168-.372.426.426 0 0 0-.114-.306.763.763 0 0 0-.288-.186 3.944 3.944 0 0 0-.468-.156 5.602 5.602 0 0 1-.666-.234 1.234 1.234 0 0 1-.438-.354c-.12-.16-.18-.372-.18-.636 0-.248.062-.464.186-.648s.298-.324.522-.42c.224-.1.48-.15.768-.15.432 0 .782.106 1.05.318.272.208.422.5.45.876h-.924a.467.467 0 0 0-.186-.354.668.668 0 0 0-.45-.144.595.595 0 0 0-.396.126c-.096.084-.144.206-.144.366 0 .112.036.206.108.282a.97.97 0 0 0 .276.18 6.3 6.3 0 0 0 .468.156c.272.08.494.16.666.24.172.08.32.2.444.36.124.16.186.37.186.63 0 .224-.058.432-.174.624a1.248 1.248 0 0 1-.51.462c-.224.112-.49.168-.798.168ZM18.078 13.812 16.542 18h-1.02l-1.536-4.188h.9l1.152 3.33 1.146-3.33h.894Z"
      />
      <defs>
        <radialGradient
          id="csv-icon-gradient-i"
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
          id="csv-icon-gradient-d"
          x1={17.042}
          x2={17.042}
          y1={7.899}
          y2={12.612}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#263238" stopOpacity={0.2} />
          <stop offset={1} stopColor="#263238" stopOpacity={0.02} />
        </linearGradient>
        <clipPath id="csv-icon-clip">
          <path fill="#fff" d="M4 2h16v21H4z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CSVIcon