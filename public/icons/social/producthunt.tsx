import * as React from "react"
import { SVGProps } from "react"

interface ProductHuntIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const ProductHuntIcon = ({ 
  size = 24, 
  ...props 
}: ProductHuntIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#producthunt-icon-clip)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 12C24 18.6 18.6 24 12 24C5.4 24 0 18.6 0 12C0 5.4 5.4 0 12 0C18.6 0 24 5.4 24 12Z"
          fill="#FF6154"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.62 12H10.2V8.4H13.62C14.64 8.4 15.42 9.18 15.42 10.2C15.42 11.22 14.58 12 13.62 12ZM13.62 6H7.80005V18H10.2V14.4H13.62C15.96 14.4 17.82 12.54 17.82 10.2C17.82 7.86 15.9 6 13.62 6Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="producthunt-icon-clip">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

export default ProductHuntIcon