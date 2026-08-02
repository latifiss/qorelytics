import * as React from "react"
import { SVGProps } from "react"

interface MongodbIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const MongodbIcon = ({ 
  size = 24, 
  ...props 
}: MongodbIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#mongodb-icon-clip)">
        <path
          fill="#00684A"
          d="M13.681 2.67A37.707 37.707 0 0 1 11.637.01a.045.045 0 0 0-.065 0 42.568 42.568 0 0 1-2.053 2.66C.876 13.7 10.88 21.143 10.88 21.143l.084.056c.075 1.15.262 2.802.262 2.802h.746s.187-1.644.262-2.802l.084-.065c0 .01 10.005-7.433 1.362-18.462ZM11.6 20.975s-.448-.383-.57-.579v-.018l.542-12.01c0-.037.056-.037.056 0l.532 12.01v.018c-.121.196-.56.58-.56.58Z"
        />
      </g>
      <defs>
        <clipPath id="mongodb-icon-clip">
          <path fill="#fff" d="M6 0h11.2v24H6z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default MongodbIcon