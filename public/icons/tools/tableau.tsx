import * as React from "react"
import { SVGProps } from "react"

interface TableauIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const TableauIcon = ({ 
  size = 24, 
  ...props 
}: TableauIconProps) => {
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
        fill="#EB9129"
        d="M6.397 4.079v2.66h-2.49v.767h2.49v2.66h.821v-2.66h2.51v-.77h-2.51V4.079h-.82Z"
      />
      <path
        fill="#5C6692"
        d="M19.572 9.762v1.85h-1.68v.677h1.68v1.884h.74V12.29H22v-.678h-1.69v-1.85h-.74Z"
      />
      <path
        fill="#5B879B"
        d="M16.737 4.03v2.706h-2.464v.77h2.464v2.657h.87l.005-1.318.02-1.312 1.22-.02 1.215-.007v-.77h-2.46V4.03h-.87Z"
      />
      <path
        fill="#7199A6"
        d="M11.71 2.146V3.98h-1.64v.482h1.64V6.3h.583V4.463h1.64v-.482h-1.64V2.146h-.583ZM3.644 9.869v1.813H2v.518h1.644v1.83h.557V12.2h1.667v-.518H4.175V9.87h-.53Z"
      />
      <path
        fill="#C72037"
        d="M6.35 13.643v2.705H3.884v.772h2.464v2.66h.918v-2.66h2.46v-.772h-2.46V13.64h-.458l-.46.003Z"
      />
      <path
        fill="#E8762D"
        d="M11.47 11.465V8.471h1.068v2.994h2.756v.99h-2.756v2.998h-1.069v-2.998H8.716v-.99h2.753Z"
      />
      <path
        fill="#5C6692"
        d="M11.613 19.294v-1.836h.774v1.836h1.667v.673H12.41l-.012.954-.01.93h-.775v-1.884H9.972v-.673h1.64Z"
      />
      <path
        fill="#1F457E"
        d="M16.737 13.636v2.712H14.22v.772h2.517v2.678h.892V17.12h2.487v-.772h-2.487v-2.712h-.892Z"
      />
    </svg>
  )
}

export default TableauIcon