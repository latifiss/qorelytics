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
        <path
          stroke="#33C481"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.698}
          d="M9.451 11.052v6.794m5.096-6.794v6.794M4.356 14.449h15.286M.96 4.258c0-.917.815-1.698 1.834-1.698h6.658l2.616 1.698h9.138c1.019 0 1.834.747 1.834 1.665l-.153 15.354c0 .917-.815 1.664-1.834 1.664H2.793c-1.019 0-1.834-.747-1.834-1.664V4.258Zm3.397 6.794v6.794h15.286v-6.794H4.356Z"
        />
      </g>
      <defs>
        <clipPath id="csv-icon-clip">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CSVIcon