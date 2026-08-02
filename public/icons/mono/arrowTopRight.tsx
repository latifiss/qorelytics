import * as React from "react"
import { SVGProps } from "react"

interface ArrowTopRightProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const ArrowTopRightIcon = ({ 
  size = 24, 
  color = "#13151B",
  ...props 
}: ArrowTopRightProps) => {
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
        fill={color}
        d="m5.16 17.643 1.497 1.497 8.79-8.79c-.374.676-.49 1.38-.347 2.11.16.713.543 1.372 1.149 1.977l1.282 1.283 1.63-1.63-1.122-1.095c-.802-.784-1.238-1.63-1.31-2.539-.053-.908.294-1.736 1.043-2.484l.213-.214-1.442-1.443-.214.214c-.748.748-1.576 1.095-2.485 1.042-.908-.071-1.754-.508-2.538-1.31L10.211 5.14 8.58 6.77l1.282 1.282c.606.605 1.265.988 1.977 1.149.73.142 1.434.026 2.111-.348l-8.79 8.79Z"
      />
    </svg>
  )
}

export default ArrowTopRightIcon