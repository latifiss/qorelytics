import * as React from "react"
import { SVGProps } from "react"

interface ProfessionalIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const ProfessionalIcon = ({ 
  size = 24, 
  ...props 
}: ProfessionalIconProps) => {
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
        fill="#312D2D"
        d="M17.085 14.972c-.234-.426.064-.859.574-1.395.808-.851 1.687-2.826.87-4.83.005-.011-.162-.349-.156-.36l-.335-.017c-.107-.015-3.8-.023-7.495-.023-3.695 0-7.387.008-7.494.023 0 0-.497.366-.493.377-.816 2.004.063 3.977.87 4.83.508.536.806.97.573 1.395-.226.414-.901.474-.901.474s.155.424.53.653c.347.212.775.26 1.069.268 0 0 1.153 1.595 4.168 1.595h3.356c3.015 0 4.168-1.595 4.168-1.595.295-.008.722-.056 1.07-.268.374-.229.53-.653.53-.653s-.677-.06-.904-.474Z"
      />
      <path
        fill="url(#professional-icon-a)"
        d="M10.54 17.96v-1.77l5.356-.423.488.6s-1.153 1.595-4.168 1.595l-1.677-.001Z"
      />
      <path
        fill="url(#professional-icon-b)"
        d="M16.372 15.592c-.802-1.218.977-1.674.977-1.674l.002.002c-.31.384-.45.72-.268 1.052.227.414.902.474.902.474s-.92.818-1.613.146Z"
      />
      <path
        fill="url(#professional-icon-c)"
        d="M18.532 8.747c.797 1.94-.04 3.94-.826 4.783-.107.116-.565.564-.67.923 0 0-1.789-2.496-2.323-3.962-.107-.297-.206-.6-.22-.915-.009-.237.027-.518.164-.719.167-.245 3.78-.318 3.78-.318l.095.208Z"
      />
      <path
        fill="url(#professional-icon-d)"
        d="M2.554 8.747c-.795 1.94.043 3.94.827 4.781.108.116.564.564.669.923 0 0 1.789-2.496 2.323-3.962.109-.296.206-.6.22-.915.009-.237-.027-.518-.164-.718-.167-.246-.362-.18-.645-.18-.54 0-2.904-.14-3.088-.14.002.005-.142.21-.142.21Z"
      />
      <path
        fill="url(#professional-icon-e)"
        d="M10.549 17.96v-1.77l-5.357-.423-.488.6s1.153 1.595 4.168 1.595l1.677-.001Z"
      />
      <path
        fill="url(#professional-icon-f)"
        d="M4.716 15.592c.802-1.218-.977-1.674-.977-1.674l-.002.002c.31.384.45.72.268 1.052-.227.414-.902.474-.902.474s.919.818 1.613.146Z"
      />
      <path
        fill="url(#professional-icon-g)"
        d="M10.566 17.944h-.025c-4.78.005-9.75 1.365-9.75 4.698v.597h19.5v-.597c0-3.142-4.924-4.698-9.725-4.698Z"
      />
      <path
        fill="#EDC391"
        d="M10.541 16.89H8.84v1.871a1.54 1.54 0 0 0 1.548 1.532h.31a1.54 1.54 0 0 0 1.549-1.532V16.89H10.54Z"
      />
      <path
        fill="url(#professional-icon-h)"
        d="M13.432 17.846c.272.41.308 1.32-.489 2.091-.467.45-1.264.512-1.88.495-.126-.004-.27-.03-.33-.152-.068-.137.02-.315.142-.394.122-.078.266-.095.401-.14.283-.096.731-.62.836-1.399.068-.5.025-.73.036-.889.01-.125 1.078.079 1.284.388Z"
      />
      <path
        fill="url(#professional-icon-i)"
        d="M7.774 19.993c.965.713 2.17.97 3.328.675.16-.041.348-.127.358-.292.011-.222-.29-.45-.506-.482-.554-.083-1.187-.364-1.544-.797-.315-.384-.455-.677-.444-1.382.004-.276-1.254-.034-1.575.133-.484.252-.739 1.318.383 2.145Z"
      />
      <path
        fill="url(#professional-icon-j)"
        d="M10.687 21.285c.036.833.47 1.105.214 1.772.418-.266.707-.716.827-1.198s.077-.994-.071-1.463c-.041-.133-.096-.27-.2-.361-.515-.45-.785.937-.77 1.25Z"
      />
      <path
        fill="url(#professional-icon-k)"
        d="M12.379 21.386c.827.357 1.261.073 1.802.934.04-.607-.194-1.219-.584-1.682-.39-.463-.93-.787-1.503-.973-.165-.052-.34-.095-.508-.056-.824.191.05 1.457.793 1.777Z"
      />
      <path
        fill="#1565C0"
        d="M11.287 20.756c.537-.113.915-.48.843-.819-.07-.34-.564-.523-1.101-.41-.537.112-.915.479-.844.818.072.34.565.524 1.102.41Z"
      />
      <path
        fill="#EDC391"
        d="M15.666 9.456H5.419c-1.105 0-2.008.963-2.008 2.139 0 1.175.902 2.141 2.008 2.141h10.247c1.104 0 2.008-.964 2.008-2.14 0-1.175-.904-2.14-2.008-2.14Z"
      />
      <path
        fill="#FFCD93"
        d="M10.541 2.076c-3.262 0-6.285 3.489-6.285 8.512 0 4.995 3.115 7.464 6.285 7.464s6.285-2.47 6.285-7.466c0-5.021-3.02-8.51-6.285-8.51Z"
      />
      <path
        fill="#454140"
        d="M8.816 9.403c-.174-.23-.575-.564-1.355-.564s-1.184.335-1.356.564a.239.239 0 0 0-.004.29c.049.066.195.128.356.074.162-.055.477-.218 1.004-.221.526.003.841.166 1.003.22.161.055.307-.005.356-.072a.241.241 0 0 0-.004-.291ZM14.98 9.403c-.175-.23-.576-.564-1.356-.564-.78 0-1.183.335-1.356.564a.239.239 0 0 0-.004.29c.05.066.195.128.357.074.16-.055.476-.218 1.003-.222.527.004.842.167 1.003.222.161.054.307-.006.356-.073a.239.239 0 0 0-.004-.291Z"
      />
      <path
        fill="#312D2D"
        d="M13.624 11.983c.51 0 .924-.428.924-.956s-.414-.957-.924-.957-.925.428-.925.957c0 .528.414.956.925.956ZM7.46 11.983c.511 0 .925-.428.925-.956s-.414-.957-.924-.957-.925.429-.925.957.414.956.925.956Z"
      />
      <path
        fill="#DBA689"
        d="M11.265 12.761a.232.232 0 0 0-.06-.015H9.877a.214.214 0 0 0-.06.015c-.12.049-.185.173-.129.306.056.133.32.504.853.504a.935.935 0 0 0 .853-.504c.059-.133-.009-.257-.129-.306Z"
      />
      <path
        fill="#444"
        d="M12.12 14.276c-.598.354-2.556.354-3.152 0-.343-.204-.694.109-.551.42.14.306 1.207 1.016 2.132 1.016.924 0 1.978-.71 2.119-1.016.14-.311-.205-.624-.548-.42Z"
      />
      <path
        fill="#A7A9AC"
        d="m20.52 12.529-.671 2.366.193.043c.206.047.392.13.572.208l.191.083.19.077.742-2.417-1.217-.36Z"
      />
      <path
        fill="#603913"
        d="M20.946 14.88a4.79 4.79 0 0 1-.182-.079c-.188-.082-.4-.176-.641-.23l-.175-.04-2.462 8.687h1.077l2.542-8.274-.16-.064Z"
      />
      <path
        fill="url(#professional-icon-l)"
        d="M19.81 16.708c-.576 0-1.206.126-1.877.401-1.476.61-2.442 1.902-3.068 3.287a6.641 6.641 0 0 0-.55 2.149 3.723 3.723 0 0 0-.005.694h8.07c1.945-3.135.426-6.53-2.57-6.53Z"
      />
      <path
        fill="#00AEEF"
        d="M18.574 18.57c-.064-.328-.347-.62-.688-.643-.39-.026-.59.311-.688.64-.098.327-.104.704.122.984a.597.597 0 0 0 .939-.008c.088-.109.154-.247.195-.394a.744.744 0 0 0 .12-.579Z"
      />
      <path
        fill="#00C853"
        d="M20.706 17.614c-.325-.21-.812-.017-1.097.182-.32.22-.555.652-.379 1.038.174.38.64.492 1.005.343.32-.13.684-.481.675-.85.092-.258.066-.539-.204-.713Z"
      />
      <path
        fill="#FFF200"
        d="M21.673 19.358c-.315-.017-.65.13-.892.326-.265.212-.45.532-.28.864.158.302.523.409.84.373.298-.032.585-.204.75-.455a.662.662 0 0 0 .11-.304.744.744 0 0 0 .05-.188c.043-.356-.246-.6-.578-.616Z"
      />
      <path
        fill="#EF4136"
        d="M20.996 21.855c-.151-.234-.446-.32-.708-.371-.302-.058-.655-.03-.891.193-.277.26-.223.671.086.875.064.042.139.077.22.107.277.21.637.149.94.036.235-.088.428-.294.44-.534l.002-.01a.341.341 0 0 0-.089-.296Z"
      />
      <path
        fill="#00AEEF"
        d="M22.427 12.793a1.362 1.362 0 0 1-.137.315c-.03.053-.064.103-.1.15-.26.345-.657.546-1.06.546-.128 0-.254-.019-.377-.06-.435-.145-.732-.469-.823-.89a1.154 1.154 0 0 1-.03-.216c-.014-.216.035-.447.146-.707.097-.23.232-.43.362-.625.097-.148.189-.288.268-.437.06-.12.277-.628.364-.91a.282.282 0 0 1 .217-.196.281.281 0 0 1 .276.1l.007.007c.478.59 1.279 1.575.887 2.923Z"
      />
      <path
        fill="#D1D3D4"
        d="M22.19 13.258c-.26.345-.657.546-1.06.546-.128 0-.254-.019-.377-.06-.435-.145-.732-.469-.824-.89.79.51.895-1.006 1.731-.995.726.01.006 1.232.53 1.4Z"
      />
      <path
        fill="#312D2D"
        d="M18.055 4.708c-.458-.692-1.484-1.62-2.404-1.682-.148-.885-1.095-1.635-2.012-1.925-2.48-.786-4.095.095-4.961.568-.18.097-1.345.744-2.158.28-.51-.29-.501-1.075-.501-1.075S4.42 1.483 4.967 3.18c-.55.022-1.27.255-1.65 1.026-.454.918-.292 1.685-.161 2.053-.473.4-1.067 1.254-.66 2.362.307.835 1.532 1.219 1.532 1.219-.087 1.502.193 2.426.34 2.8.027.065.119.06.136-.008.186-.745.817-3.338.756-3.79 0 0 2.126-.421 4.156-1.916.413-.304.861-.562 1.337-.752 2.548-1.014 3.08.717 3.08.717s1.767-.34 2.3 2.113c.2.918.335 2.39.45 3.42.007.073.107.088.135.02.178-.409.534-1.219.618-2.045.03-.291.814-.675 1.152-1.924.451-1.665-.102-3.266-.433-3.767Z"
      />
      <path
        fill="url(#professional-icon-m)"
        d="M17.333 10.406c.03-.29.813-.675 1.15-1.924.037-.133.066-.268.095-.403.273-1.517-.218-2.91-.523-3.371-.424-.64-1.332-1.48-2.192-1.652-.075-.01-.149-.019-.218-.022 0 0 .062.403-.101.723-.21.417-.64.516-.64.516 2.245 2.246 2.085 4.125 2.429 6.133Z"
      />
      <path
        fill="url(#professional-icon-n)"
        d="M9.22 1.386c-.205.099-.387.198-.544.283-.18.097-1.345.744-2.158.28-.501-.284-.501-1.045-.501-1.072-.23.295-.928 2.397 1.112 2.537.88.06 1.421-.707 1.744-1.355.116-.237.298-.582.346-.673Z"
      />
      <path
        fill="url(#professional-icon-o)"
        d="M13.384 1.026c1.372.37 2.042 1.07 2.265 2.002.066.274.144 2.828-4.73-.075C9.104 1.873 9.6 1.198 9.811 1.121c.829-.3 2.034-.512 3.572-.095Z"
      />
      <path
        fill="url(#professional-icon-p)"
        d="m6.011.877-.01.004c-.175.073-1.548.709-1.034 2.297l1.459.234C5.136 2.106 6.019.874 6.019.874L6.01.877Z"
      />
      <path
        fill="url(#professional-icon-q)"
        d="m5.869 3.324-.902-.144c-.036 0-.156.011-.221.02-.508.072-1.107.334-1.43 1.006-.35.723-.34 1.344-.245 1.758.028.139.085.297.085.297s.446-.424 1.51-.452l1.203-2.485Z"
      />
      <path
        fill="url(#professional-icon-r)"
        d="M3.113 6.296C2.668 6.69 2.07 7.57 2.51 8.661c.332.823 1.517 1.179 1.517 1.179 0 .004.236.075.358.075l.277-4.106c-.568 0-1.113.17-1.466.416.004.006-.088.066-.084.071Z"
      />
      <defs>
        <radialGradient
          id="professional-icon-a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(4.39106 0 0 2.15689 13.276 15.403)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.728} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <radialGradient
          id="professional-icon-b"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-1.17532 .54996 -.408 -.87192 17.601 14.75)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.663} stopColor="#454140" />
          <stop offset={1} stopColor="#454140" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="professional-icon-c"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-.4252 -5.68385 4.73711 -.35453 14.238 11.08)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.725} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <radialGradient
          id="professional-icon-d"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(.4252 -5.68385 -4.73711 -.35453 6.85 11.08)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.725} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <radialGradient
          id="professional-icon-e"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-4.39106 0 0 -2.15689 7.812 15.403)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.728} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <radialGradient
          id="professional-icon-f"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(1.17532 .54996 .408 -.87192 3.487 14.75)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.663} stopColor="#454140" />
          <stop offset={1} stopColor="#454140" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="professional-icon-m"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(2.05513 6.35715 4.71692 -1.52465 13.92 8.072)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.699} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <radialGradient
          id="professional-icon-n"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(1.54387 .8279 .98154 -1.83064 7.407 .788)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.58} stopColor="#454140" />
          <stop offset={1} stopColor="#454140" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="professional-icon-o"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-5.05023 -2.12392 -1.17505 2.84607 11.322 3.969)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.699} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <radialGradient
          id="professional-icon-p"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(1.60781 0 0 1.96684 6.703 2.386)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.702} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <radialGradient
          id="professional-icon-q"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-2.91213 -.78344 -.73338 2.72516 6.482 5.224)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.66} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <radialGradient
          id="professional-icon-r"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(3.13668 .43154 .60631 -4.40756 5.767 8.136)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.598} stopColor="#454140" stopOpacity={0} />
          <stop offset={1} stopColor="#454140" />
        </radialGradient>
        <linearGradient
          id="professional-icon-g"
          x1={0.792}
          x2={20.292}
          y1={20.59}
          y2={20.59}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.001} stopColor="#E3E3E3" />
          <stop offset={1} stopColor="#C9C9C9" />
        </linearGradient>
        <linearGradient
          id="professional-icon-h"
          x1={12.696}
          x2={12.035}
          y1={17.183}
          y2={19.937}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0053AB" />
          <stop offset={0.362} stopColor="#0068BF" />
          <stop offset={1} stopColor="#008EE3" />
        </linearGradient>
        <linearGradient
          id="professional-icon-i"
          x1={7.226}
          x2={11.102}
          y1={18.061}
          y2={20.678}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.001} stopColor="#008EE3" />
          <stop offset={1} stopColor="#0053AB" />
        </linearGradient>
        <linearGradient
          id="professional-icon-j"
          x1={11.247}
          x2={11.268}
          y1={20.705}
          y2={22.958}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0053AB" />
          <stop offset={1} stopColor="#008EE3" />
        </linearGradient>
        <linearGradient
          id="professional-icon-k"
          x1={11.803}
          x2={13.541}
          y1={20.156}
          y2={21.34}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0053AB" />
          <stop offset={1} stopColor="#008EE3" />
        </linearGradient>
        <linearGradient
          id="professional-icon-l"
          x1={18.834}
          x2={18.729}
          y1={16.689}
          y2={25.218}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.002} stopColor="#FFDBB5" />
          <stop offset={1} stopColor="#A97C50" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default ProfessionalIcon