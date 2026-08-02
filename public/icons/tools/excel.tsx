import * as React from "react"
import { SVGProps } from "react"

interface ExcelIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const ExcelIcon = ({ 
  size = 24, 
  ...props 
}: ExcelIconProps) => {
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
        fill="#185C37"
        d="M14.61 11.484 6.543 10.05v10.599c0 .484.39.876.87.876H21.33c.48 0 .87-.392.87-.876v-3.905l-7.59-5.26Z"
      />
      <path
        fill="#21A366"
        d="M14.61 2.4H7.413c-.48 0-.87.392-.87.876v3.905l8.065 4.781 4.27 1.435 3.32-1.435v-4.78L14.61 2.4Z"
      />
      <path fill="#107C41" d="M6.544 7.181h8.065v4.781H6.544v-4.78Z" />
      <path
        fill="#000"
        d="M12.316 6.225H6.544v11.953h5.772a.876.876 0 0 0 .87-.876v-10.2a.876.876 0 0 0-.87-.877Z"
        opacity={0.1}
      />
      <path
        fill="#000"
        d="M11.842 6.703H6.544v11.953h5.298a.876.876 0 0 0 .87-.876V7.58a.876.876 0 0 0-.87-.877Z"
        opacity={0.2}
      />
      <path
        fill="#000"
        d="M11.842 6.703H6.544V17.7h5.298a.876.876 0 0 0 .87-.876V7.58a.876.876 0 0 0-.87-.877Z"
        opacity={0.2}
      />
      <path
        fill="#000"
        d="M11.367 6.703H6.544V17.7h4.823a.876.876 0 0 0 .87-.876V7.58a.876.876 0 0 0-.87-.877Z"
        opacity={0.2}
      />
      <path
        fill="url(#excel-icon-gradient)"
        d="M2.67 6.703h8.697c.48 0 .87.393.87.877v8.766c0 .483-.39.876-.87.876H2.67a.873.873 0 0 1-.87-.877V7.58c0-.484.39-.877.87-.877Z"
      />
      <path
        fill="#fff"
        d="m4.493 14.811 1.83-2.857-1.677-2.84h1.349l.914 1.816c.085.173.143.3.174.386h.012a7.18 7.18 0 0 1 .19-.402l.977-1.8H9.5l-1.719 2.824 1.763 2.873H8.227L7.17 12.817a1.673 1.673 0 0 1-.126-.267h-.016c-.03.091-.072.178-.122.259L5.818 14.81H4.493Z"
      />
      <path
        fill="#33C481"
        d="M21.33 2.4h-6.72V7.18h7.59V3.276a.873.873 0 0 0-.87-.876Z"
      />
      <path fill="#107C41" d="M14.61 11.962h7.59v4.782h-7.59v-4.782Z" />
      <defs>
        <linearGradient
          id="excel-icon-gradient"
          x1={3.613}
          x2={10.504}
          y1={6.018}
          y2={17.86}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#18884F" />
          <stop offset={0.5} stopColor="#117E43" />
          <stop offset={1} stopColor="#0B6631" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default ExcelIcon