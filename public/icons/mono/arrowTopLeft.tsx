import * as React from "react"
import { SVGProps } from "react"

interface ArrowTopLeftProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const ArrowTopLeftIcon = ({ 
  size = 24, 
  color = "#13151B",
  ...props 
}: ArrowTopLeftProps) => {
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
        d="m18.86 17.643-1.496 1.497-8.79-8.79c.374.676.49 1.38.347 2.11-.16.713-.543 1.372-1.148 1.977L6.49 15.72l-1.63-1.63 1.122-1.095c.802-.784 1.238-1.63 1.31-2.539.053-.908-.294-1.736-1.042-2.484l-.214-.214 1.443-1.443.213.214c.748.748 1.577 1.095 2.485 1.042.909-.071 1.755-.508 2.538-1.31l1.096-1.121 1.63 1.63-1.283 1.282c-.606.605-1.265.988-1.977 1.149-.73.142-1.434.026-2.11-.348l8.79 8.79Z"
      />
    </svg>
  )
}

export default ArrowTopLeftIcon