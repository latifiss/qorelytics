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
        d="M15.07 11.604 5.582 9.93v12.372c0 .565.458 1.023 1.023 1.023h16.373c.565 0 1.023-.458 1.023-1.023v-4.558l-8.93-6.14Z"
      />
      <path
        fill="#21A366"
        d="M15.07 1H6.605c-.565 0-1.023.458-1.023 1.023v4.558l9.488 5.582 5.024 1.674L24 12.163V6.58L15.07 1Z"
      />
      <path fill="#107C41" d="M5.582 6.581h9.488v5.581H5.582V6.581Z" />
      <path
        fill="#000"
        d="M12.373 5.465H5.582v13.953h6.79a1.026 1.026 0 0 0 1.024-1.023V6.488a1.026 1.026 0 0 0-1.023-1.023Z"
        opacity={0.1}
      />
      <path
        fill="#000"
        d="M11.815 6.023H5.582v13.954h6.233a1.026 1.026 0 0 0 1.023-1.023V7.046a1.026 1.026 0 0 0-1.023-1.023Z"
        opacity={0.2}
      />
      <path
        fill="#000"
        d="M11.815 6.023H5.582v12.838h6.233a1.026 1.026 0 0 0 1.023-1.023V7.046a1.026 1.026 0 0 0-1.023-1.023Z"
        opacity={0.2}
      />
      <path
        fill="#000"
        d="M11.257 6.023H5.582v12.838h5.675a1.026 1.026 0 0 0 1.023-1.023V7.046a1.026 1.026 0 0 0-1.023-1.023Z"
        opacity={0.2}
      />
      <path
        fill="url(#excel-icon-gradient)"
        d="M1.023 6.023h10.233c.565 0 1.023.458 1.023 1.024v10.232c0 .566-.458 1.023-1.023 1.023H1.023A1.023 1.023 0 0 1 0 17.28V7.047c0-.566.458-1.024 1.023-1.024Z"
      />
      <path
        fill="#fff"
        d="m3.17 15.488 2.152-3.335L3.35 8.837h1.586l1.077 2.12c.099.202.167.352.204.45h.014c.07-.16.145-.316.223-.468l1.15-2.101h1.457l-2.023 3.297 2.074 3.353h-1.55L6.32 13.16a1.954 1.954 0 0 1-.149-.31h-.018a1.473 1.473 0 0 1-.144.3l-1.28 2.338h-1.56Z"
      />
      <path
        fill="#33C481"
        d="M22.977 1H15.07v5.581H24V2.023C24 1.458 23.543 1 22.977 1Z"
      />
      <path fill="#107C41" d="M15.07 12.163H24v5.581h-8.93v-5.58Z" />
      <defs>
        <linearGradient
          id="excel-icon-gradient"
          x1={2.133}
          x2={10.146}
          y1={5.224}
          y2={19.102}
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