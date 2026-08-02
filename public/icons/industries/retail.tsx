import * as React from "react"
import { SVGProps } from "react"

interface RetailIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const RetailIcon = ({ 
  size = 24, 
  ...props 
}: RetailIconProps) => {
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
        fill="#515151"
        d="M12.79 5.962H3.755l.07-.53a4.483 4.483 0 0 1 4.448-3.895 4.483 4.483 0 0 1 4.449 3.896l.068.53Zm-7.924-.937h6.813a3.559 3.559 0 0 0-3.406-2.552 3.563 3.563 0 0 0-3.407 2.552Z"
      />
      <path
        fill="#4D96FF"
        d="M15.024 22.505H3.204a1.683 1.683 0 0 1-1.683-1.683V5.025h13.503v17.48Z"
      />
      <path
        fill="#515151"
        d="M19.554 11.444h-9.035l.07-.53a4.483 4.483 0 0 1 4.448-3.895 4.483 4.483 0 0 1 4.449 3.896l.068.53Zm-7.924-.937h6.813a3.56 3.56 0 0 0-3.406-2.55 3.561 3.561 0 0 0-3.407 2.55Z"
      />
      <path
        fill="#03CB28"
        d="M20.878 22.49H9.197c-.924 0-1.674-.75-1.674-1.673V10.505h15.03v10.31a1.677 1.677 0 0 1-1.675 1.676Z"
      />
    </svg>
  )
}

export default RetailIcon