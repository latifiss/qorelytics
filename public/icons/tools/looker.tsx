import * as React from "react"
import { SVGProps } from "react"

interface LookerIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const LookerIcon = ({ 
  size = 24, 
  ...props 
}: LookerIconProps) => {
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
        fill="#34A853"
        d="M12.16 2a1.749 1.749 0 0 0-1.451 2.724l.747-.746a.738.738 0 1 1 .47.47l-.745.746a1.747 1.747 0 1 0 .979-3.195Z"
      />
      <path
        fill="#FBBC04"
        d="M11.464 7.093a2.717 2.717 0 0 0-.545-1.637l-.969.968a1.39 1.39 0 0 1-.265 1.677l.527 1.288a2.731 2.731 0 0 0 1.252-2.296Z"
      />
      <path
        fill="#EA4335"
        d="M8.756 8.483H8.73a1.39 1.39 0 1 1 .764-2.552l.96-.96a2.733 2.733 0 1 0-1.172 4.8l-.526-1.288Z"
      />
      <path
        fill="#4285F4"
        d="M12.197 9.596c-.607 0-1.21.088-1.791.263l.768 1.876a4.183 4.183 0 1 1-.94.363l-.76-1.87a6.202 6.202 0 1 0 2.728-.633l-.005.001Z"
      />
    </svg>
  )
}

export default LookerIcon