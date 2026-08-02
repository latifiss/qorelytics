import * as React from "react"
import { SVGProps } from "react"

interface FolderIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

const FolderIcon = ({ 
  size = 24, 
  color = "#F9A825",
  ...props 
}: FolderIconProps) => {
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
        d="m10.152 5.085-1.104-.876a1.766 1.766 0 0 0-1.097-.38H1.714c-.454 0-.89.173-1.212.48A1.596 1.596 0 0 0 0 5.463v13.072c0 .433.18.849.502 1.155.322.307.758.479 1.212.479h20.572c.454 0 .89-.172 1.212-.479.321-.306.502-.722.502-1.155V7.098c0-.434-.18-.85-.502-1.156a1.758 1.758 0 0 0-1.212-.478H11.249c-.4 0-.79-.135-1.097-.38Z"
      />
    </svg>
  )
}

export default FolderIcon