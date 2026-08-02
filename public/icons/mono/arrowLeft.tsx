import * as React from "react"
import { SVGProps } from "react"

interface ArrowLeftProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const ArrowLeftIcon = ({ 
  size = 24, 
  color = "#13151B",
  ...props 
}: ArrowLeftProps) => {
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
        d="M20.413 11.155v2.116H7.982c.743.214 1.322.63 1.738 1.246.39.617.586 1.354.586 2.21v1.814H8l.019-1.568c.012-1.12-.277-2.027-.87-2.72-.604-.68-1.435-1.02-2.493-1.02h-.302v-2.04h.302c1.058 0 1.889-.34 2.494-1.02.592-.694.881-1.6.869-2.721L8 5.884h2.306v1.813c0 .857-.196 1.594-.586 2.21-.416.618-.995 1.034-1.738 1.248h12.43Z"
      />
    </svg>
  )
}

export default ArrowLeftIcon