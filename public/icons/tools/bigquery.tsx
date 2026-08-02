import * as React from "react"
import { SVGProps } from "react"

interface BigQueryIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const BigQueryIcon = ({ 
  size = 24, 
  ...props 
}: BigQueryIconProps) => {
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
        fill="#4386FA"
        d="m6.525 20.022-4.35-7.536a1.301 1.301 0 0 1 0-1.301l4.35-7.536c.232-.402.66-.65 1.125-.65h8.705a1.3 1.3 0 0 1 1.12.65l4.35 7.536c.233.402.233.899 0 1.301l-4.35 7.536a1.3 1.3 0 0 1-1.125.65H7.647a1.302 1.302 0 0 1-1.123-.65h.001Z"
      />
      <path
        fill="#000"
        d="M14.718 9.409s1.21 2.9-.44 4.545c-1.648 1.644-4.65.592-4.65.592l6.106 6.124h.62a1.3 1.3 0 0 0 1.125-.65l2.88-4.988-5.641-5.623Z"
        opacity={0.1}
      />
      <path
        fill="#fff"
        d="m16.146 15.345-1.333-1.337a.207.207 0 0 0-.05-.037 3.635 3.635 0 1 0-.635.636.21.21 0 0 0 .036.047l1.336 1.337a.21.21 0 0 0 .296 0l.35-.35a.21.21 0 0 0 0-.296Zm-4.258-.865a2.734 2.734 0 1 1-.001-5.468 2.734 2.734 0 0 1 0 5.468ZM10.14 11.6v1.13c.174.307.426.564.73.742v-1.878l-.73.006Zm1.367-.936v3.053c.242.045.49.045.73 0v-3.053h-.73Zm2.114 2.064v-.67h-.73v1.407c.304-.179.556-.434.73-.74v.003Z"
      />
    </svg>
  )
}

export default BigQueryIcon