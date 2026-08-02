import * as React from "react"
import { SVGProps } from "react"

interface TeamIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const TeamIcon = ({ 
  size = 24, 
  ...props 
}: TeamIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (17/61)} 
      viewBox="0 0 61 17"
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M2.444 16.38 4.81 2.99H0L.52 0h12.74l-.52 2.99H7.93L5.564 16.38h-3.12Zm9.998 0L15.328 0h11.31l-.52 2.99h-8.19l-.624 3.51h7.54l-.52 2.99h-7.54l-.702 3.9h8.45l-.52 2.99h-11.57Zm12.504 0L33.942 0h2.86l3.224 16.38h-3.12L36.334 13h-6.24l-1.768 3.38h-3.38Zm6.682-6.24h4.16l-1.014-5.98-3.146 5.98Zm9.81 6.24L44.324 0h2.6l3.458 12.09L58.104 0h2.86l-2.886 16.38h-3.12l1.612-9.1-5.772 9.1h-2.08l-2.548-9.1-1.612 9.1h-3.12Z"
      />
    </svg>
  )
}

export default TeamIcon