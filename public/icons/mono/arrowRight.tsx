import * as React from "react"
import { SVGProps } from "react"

interface ArrowRightProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const ArrowRightIcon = ({ 
  size = 24, 
  color = "#13151B",
  ...props 
}: ArrowRightProps) => {
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
        d="M2.73 11.155v2.116h12.43c-.742.214-1.322.63-1.737 1.246-.39.617-.586 1.354-.586 2.21v1.814h2.305l-.019-1.568c-.012-1.12.277-2.027.87-2.72.604-.68 1.435-1.02 2.493-1.02h.302v-2.04h-.302c-1.058 0-1.89-.34-2.494-1.02-.592-.694-.882-1.6-.869-2.721l.019-1.568h-2.305v1.813c0 .857.195 1.594.586 2.21.415.618.995 1.034 1.738 1.248H2.73Z"
      />
    </svg>
  )
}

export default ArrowRightIcon