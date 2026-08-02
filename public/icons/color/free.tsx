import * as React from "react"
import { SVGProps } from "react"

interface FreeIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const FreeIcon = ({ 
  size = 24, 
  ...props 
}: FreeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (17/57)} 
      viewBox="0 0 57 17"
      fill="none"
      {...props}
    >
      <path
        fill="#9FA5BA"
        d="M0 16.38 2.886 0h10.92l-.52 2.99h-7.8l-.728 4.03h6.37l-.52 2.99h-6.37L3.12 16.38H0Zm13.254 0L16.14 0h6.526c2.756 0 4.602 2.314 4.602 4.68 0 2.184-1.118 3.562-2.21 4.316-.65.442-1.378.78-2.184 1.014l2.73 6.37h-3.51L19.78 10.4h-2.34l-1.066 5.98h-3.12Zm4.706-8.97h3.614c1.352 0 2.548-1.066 2.548-2.34 0-1.04-.806-2.08-1.976-2.08H18.74l-.78 4.42Zm9.843 8.97L30.689 0h11.31l-.52 2.99h-8.19l-.624 3.51h7.54l-.52 2.99h-7.54l-.702 3.9h8.45l-.52 2.99h-11.57Zm14.168 0L44.857 0h11.31l-.52 2.99h-8.19l-.624 3.51h7.54l-.52 2.99h-7.54l-.702 3.9h8.45l-.521 2.99H41.971Z"
      />
    </svg>
  )
}

export default FreeIcon