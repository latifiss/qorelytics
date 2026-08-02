import * as React from "react"
import { SVGProps } from "react"

interface GlobeIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const GlobeIcon = ({ 
  size = 24, 
  ...props 
}: GlobeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#globe-icon-clip)">
        <path fill="#54B6FF" d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path
          fill="url(#globe-icon-gradient1)"
          fillOpacity={0.6}
          d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        />
        <path
          fill="url(#globe-icon-gradient2)"
          fillRule="evenodd"
          d="M17.933 6.642c1.444-.289 2.467-.186 2.794.381.759 1.314-2.514 4.623-7.308 7.392-4.796 2.768-9.298 3.948-10.056 2.634-.32-.553.075-1.46.997-2.53a8.008 8.008 0 0 1-.195-.658c-2.515 2.26-3.81 4.328-3.163 5.445 1.065 1.845 7.01.407 13.278-3.212 6.269-3.619 10.487-8.049 9.422-9.894-.64-1.107-3.035-1.032-6.203-.013.15.145.295.298.434.455Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <radialGradient
          id="globe-icon-gradient1"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="rotate(41.987 -7.476 15.575) scale(13.4536)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCF3CE" />
          <stop offset={0.5} stopColor="#FCF3CD" stopOpacity={0} />
          <stop offset={0.723} stopColor="#FCF3CD" stopOpacity={0.095} />
          <stop offset={1} stopColor="#FCF3CD" />
        </radialGradient>
        <radialGradient
          id="globe-icon-gradient2"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-11 6.49994 -9.81617 -16.61213 12 12.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFBA78" />
          <stop offset={0.578} stopColor="#FD589B" />
          <stop offset={1} stopColor="#FFDE8C" />
        </radialGradient>
        <clipPath id="globe-icon-clip">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default GlobeIcon