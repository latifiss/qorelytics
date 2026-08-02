import * as React from "react"
import { SVGProps } from "react"

interface GoogleIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const GoogleIcon = ({ 
  size = 24, 
  ...props 
}: GoogleIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#google-icon-clip0)">
        <mask id="google-icon-mask0" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x={1} y={1} width={22} height={22}>
          <path d="M22.2419 10.0288H12.0492V14.1963H17.906C17.8119 14.7861 17.6004 15.3663 17.2909 15.8954C16.9362 16.5016 16.4977 16.963 16.0482 17.3145C14.7019 18.3672 13.1322 18.5825 12.0421 18.5825C9.2884 18.5825 6.93551 16.7664 6.02466 14.2986C5.98791 14.2091 5.9635 14.1165 5.93378 14.0251C5.7325 13.397 5.62252 12.7318 5.62252 12.0405C5.62252 11.321 5.74161 10.6322 5.95875 9.98168C6.81526 7.41609 9.22119 5.49984 12.0441 5.49984C12.6119 5.49984 13.1587 5.5688 13.6772 5.70636C14.8622 6.02073 15.7005 6.63988 16.2141 7.12962L19.3133 4.03258C17.4281 2.26877 14.9705 1.2 12.039 1.2C9.69539 1.19995 7.5317 1.94504 5.75864 3.20426C4.32073 4.22546 3.14145 5.59271 2.34557 7.18063C1.6053 8.65295 1.19995 10.2846 1.19995 12.0389C1.19995 13.7932 1.60592 15.4418 2.3462 16.9005V16.9103C3.12811 18.4589 4.27154 19.7923 5.66126 20.8088C6.87533 21.6969 9.05226 22.8796 12.039 22.8796C13.7565 22.8796 15.2788 22.5636 16.6212 21.9714C17.5897 21.5442 18.4477 20.9871 19.2246 20.271C20.2511 19.3248 21.055 18.1544 21.6037 16.8079C22.1524 15.4614 22.4459 13.9387 22.4459 12.2879C22.4459 11.5191 22.3703 10.7383 22.2419 10.0287V10.0288Z" fill="white"/>
        </mask>
        <g mask="url(#google-icon-mask0)">
          <g filter="url(#google-icon-filter0)">
            <path d="M1.0437 12.1125C1.05497 13.8392 1.53714 15.6207 2.26699 17.0588V17.0687C2.79434 18.1131 3.51507 18.9382 4.33598 19.7556L9.29404 17.9096C8.356 17.4234 8.21287 17.1254 7.54045 16.5818C6.8533 15.8748 6.34116 15.0631 6.02222 14.1113H6.00937L6.02222 14.1014C5.81239 13.4729 5.79169 12.8058 5.78395 12.1125H1.0437Z" fill="url(#google-icon-paint0)"/>
          </g>
          <g filter="url(#google-icon-filter1)">
            <path d="M12.0494 1.12117C11.5593 2.87793 11.7467 4.58556 12.0494 5.57914C12.6153 5.57957 13.1604 5.6484 13.6773 5.78553C14.8623 6.0999 15.7005 6.71906 16.2141 7.20881L19.3926 4.03264C17.5097 2.27094 15.2436 1.12395 12.0494 1.12117Z" fill="url(#google-icon-paint1)"/>
          </g>
          <g filter="url(#google-icon-filter2)">
            <path d="M12.0387 1.10727C9.63493 1.10722 7.41571 1.87143 5.59713 3.16299C4.92189 3.64255 4.30223 4.19651 3.75047 4.81254C3.60592 6.19629 4.83253 7.89707 7.26159 7.88299C8.44015 6.48407 10.1832 5.57898 12.1233 5.57898C12.125 5.57898 12.1268 5.57912 12.1285 5.57913L12.0493 1.10759C12.0457 1.10758 12.0422 1.10727 12.0387 1.10727Z" fill="url(#google-icon-paint2)"/>
          </g>
          <g filter="url(#google-icon-filter3)">
            <path d="M19.9724 12.6132L17.8269 14.1172C17.7328 14.707 17.5212 15.2872 17.2116 15.8163C16.8569 16.4224 16.4185 16.8839 15.969 17.2354C14.6255 18.2859 13.06 18.5022 11.9702 18.5031C10.8437 20.4608 10.6462 21.4413 12.0494 23.0214C13.7856 23.0201 15.3249 22.7002 16.6826 22.1014C17.664 21.6684 18.5336 21.1038 19.3209 20.3781C20.3611 19.4192 21.1759 18.2331 21.732 16.8685C22.2881 15.5039 22.5855 13.9609 22.5855 12.2879L19.9724 12.6132Z" fill="url(#google-icon-paint3)"/>
          </g>
          <g filter="url(#google-icon-filter4)">
            <path d="M11.8909 9.87045V14.3547H22.2134C22.3042 13.7406 22.6044 12.9459 22.6044 12.288C22.6044 11.5191 22.5288 10.5801 22.4005 9.87045H11.8909Z" fill="#3086FF"/>
          </g>
          <g filter="url(#google-icon-filter5)">
            <path d="M3.79979 4.65421C3.16278 5.3654 2.61858 6.16143 2.1871 7.02232C1.44683 8.49464 1.0415 10.2846 1.0415 12.0389C1.0415 12.0636 1.04351 12.0878 1.04367 12.1125C1.37151 12.7539 5.57219 12.631 5.78392 12.1125C5.78366 12.0883 5.78098 12.0647 5.78098 12.0404C5.78098 11.3209 5.90011 10.7905 6.11726 10.14C6.38513 9.33764 6.80456 8.59874 7.34089 7.96212C7.46247 7.80373 7.78677 7.46323 7.88139 7.25899C7.91743 7.1812 7.81596 7.13753 7.81028 7.11015C7.80393 7.07952 7.66788 7.10415 7.6374 7.08134C7.54062 7.00891 7.34898 6.97108 7.23261 6.93746C6.98388 6.86559 6.57166 6.70711 6.34270 6.54283C5.61897 6.02353 4.48952 5.40323 3.79979 4.65421Z" fill="url(#google-icon-paint4)"/>
          </g>
          <g filter="url(#google-icon-filter6)">
            <path d="M6.35818 7.11323C8.03645 8.15059 8.51908 6.58961 9.63489 6.10115L7.69391 1.99391C6.9799 2.30013 6.30531 2.68058 5.6794 3.1251C4.74465 3.78896 3.91919 4.59906 3.2373 5.52097L6.35818 7.11323Z" fill="url(#google-icon-paint5)"/>
          </g>
          <g filter="url(#google-icon-filter7)">
            <path d="M7.04119 17.5923C4.78834 18.4222 4.43565 18.452 4.22827 19.8766C4.62455 20.2712 5.05033 20.6362 5.50278 20.9672C6.71685 21.8552 9.05219 23.0379 12.0389 23.0379C12.0424 23.0379 12.0457 23.0376 12.0493 23.0376V18.424C12.047 18.424 12.0444 18.4241 12.0421 18.4241C10.9237 18.4241 10.03 18.1244 9.11366 17.6031C8.88772 17.4746 8.47783 17.8197 8.26946 17.6654C7.98207 17.4526 7.29045 17.8488 7.04119 17.5923Z" fill="url(#google-icon-paint6)"/>
          </g>
          <g opacity="0.5" filter="url(#google-icon-filter8)">
            <path d="M10.73 18.2786V22.9577C11.1479 23.0076 11.5828 23.0379 12.039 23.0379C12.4963 23.0379 12.9388 23.0139 13.3687 22.9699V18.3102C12.8869 18.3942 12.4331 18.4241 12.0422 18.4241C11.592 18.4241 11.1542 18.3706 10.73 18.2786Z" fill="url(#google-icon-paint7)"/>
          </g>
        </g>
      </g>
      <defs>
        <filter id="google-icon-filter0" x={0.998814} y={12.0676} width={8.34014} height={7.73289} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.0224434} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <filter id="google-icon-filter1" x={11.7032} y={1.07628} width={7.7343} height={6.1774} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.0224434} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <filter id="google-icon-filter2" x={3.69413} y={1.06238} width={8.4793} height={6.86558} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.0224434} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <filter id="google-icon-filter3" x={11.0158} y={12.243} width={11.6146} height={10.8232} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.0224434} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <filter id="google-icon-filter4" x={11.846} y={9.82557} width={10.8033} height={4.57401} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.0224434} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <filter id="google-icon-filter5" x={0.996617} y={4.60932} width={6.93743} height={7.98424} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.0224434} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <filter id="google-icon-filter6" x={2.92173} y={1.67834} width={7.02873} height={6.09912} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.157786} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <filter id="google-icon-filter7" x={4.18338} y={17.5289} width={7.9107} height={5.5539} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.0224434} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <filter id="google-icon-filter8" x={10.6851} y={18.2337} width={2.72857} height={4.84905} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation={0.0224434} result="effect1_foregroundBlur_202_1014"/>
        </filter>
        <radialGradient id="google-icon-paint0" cx={0} cy={0} r={1} gradientTransform="matrix(-0.441493 -10.7964 15.8735 -0.64788 9.19479 19.5929)" gradientUnits="userSpaceOnUse">
          <stop offset="0.141612" stopColor="#1ABD4D"/>
          <stop offset="0.247515" stopColor="#6EC30D"/>
          <stop offset="0.311547" stopColor="#8AC502"/>
          <stop offset="0.366013" stopColor="#A2C600"/>
          <stop offset="0.445673" stopColor="#C8C903"/>
          <stop offset="0.540305" stopColor="#EBCB03"/>
          <stop offset="0.615636" stopColor="#F7CD07"/>
          <stop offset="0.699345" stopColor="#FDCD04"/>
          <stop offset="0.771242" stopColor="#FDCE05"/>
          <stop offset="0.860566" stopColor="#FFCE0A"/>
        </radialGradient>
        <radialGradient id="google-icon-paint1" cx={0} cy={0} r={1} gradientTransform="matrix(7.49777 -1.83876e-05 -1.05384e-05 9.67385 19.0953 6.979)" gradientUnits="userSpaceOnUse">
          <stop offset="0.408458" stopColor="#FB4E5A"/>
          <stop offset="1" stopColor="#FF4540"/>
        </radialGradient>
        <radialGradient id="google-icon-paint2" cx={0} cy={0} r={1} gradientTransform="matrix(-10.5049 5.81277 7.89533 14.2417 15.0006 -0.293055)" gradientUnits="userSpaceOnUse">
          <stop offset="0.231273" stopColor="#FF4541"/>
          <stop offset="0.311547" stopColor="#FF4540"/>
          <stop offset="0.457516" stopColor="#FF4640"/>
          <stop offset="0.540305" stopColor="#FF473F"/>
          <stop offset="0.699346" stopColor="#FF5138"/>
          <stop offset="0.771242" stopColor="#FF5B33"/>
          <stop offset="0.860566" stopColor="#FF6C29"/>
          <stop offset="1" stopColor="#FF8C18"/>
        </radialGradient>
        <radialGradient id="google-icon-paint3" cx={0} cy={0} r={1} gradientTransform="matrix(-19.051 -24.8455 -9.17973 7.02556 12.2056 21.6182)" gradientUnits="userSpaceOnUse">
          <stop offset="0.131546" stopColor="#0CBA65"/>
          <stop offset="0.209784" stopColor="#0BB86D"/>
          <stop offset="0.297297" stopColor="#09B479"/>
          <stop offset="0.396257" stopColor="#08AD93"/>
          <stop offset="0.477124" stopColor="#0AA6A9"/>
          <stop offset="0.568425" stopColor="#0D9CC6"/>
          <stop offset="0.667385" stopColor="#1893DD"/>
          <stop offset="0.768727" stopColor="#258BF1"/>
          <stop offset="0.858506" stopColor="#3086FF"/>
        </radialGradient>
        <radialGradient id="google-icon-paint4" cx={0} cy={0} r={1} gradientTransform="matrix(-1.34819 11.6096 16.0674 1.86235 11.1184 3.15482)" gradientUnits="userSpaceOnUse">
          <stop offset="0.366013" stopColor="#FF4E3A"/>
          <stop offset="0.457516" stopColor="#FF8A1B"/>
          <stop offset="0.540305" stopColor="#FFA312"/>
          <stop offset="0.615636" stopColor="#FFB60C"/>
          <stop offset="0.771242" stopColor="#FFCD0A"/>
          <stop offset="0.860566" stopColor="#FECF0A"/>
          <stop offset="0.915033" stopColor="#FECF08"/>
          <stop offset="1" stopColor="#FDCD01"/>
        </radialGradient>
        <radialGradient id="google-icon-paint5" cx={0} cy={0} r={1} gradientTransform="matrix(-3.89698 4.30591 -12.1564 -10.9813 9.22242 3.0344)" gradientUnits="userSpaceOnUse">
          <stop offset="0.315904" stopColor="#FF4C3C"/>
          <stop offset="0.603818" stopColor="#FF692C"/>
          <stop offset="0.726837" stopColor="#FF7825"/>
          <stop offset="0.884534" stopColor="#FF8D1B"/>
          <stop offset="1" stopColor="#FF9F13"/>
        </radialGradient>
        <radialGradient id="google-icon-paint6" cx={0} cy={0} r={1} gradientTransform="matrix(-10.5049 -5.81277 7.89533 -14.2417 15.0006 24.3724)" gradientUnits="userSpaceOnUse">
          <stop offset="0.231273" stopColor="#0FBC5F"/>
          <stop offset="0.311547" stopColor="#0FBC5F"/>
          <stop offset="0.366013" stopColor="#0FBC5E"/>
          <stop offset="0.457516" stopColor="#0FBC5D"/>
          <stop offset="0.540305" stopColor="#12BC58"/>
          <stop offset="0.699346" stopColor="#28BF3C"/>
          <stop offset="0.771242" stopColor="#38C02B"/>
          <stop offset="0.860566" stopColor="#52C218"/>
          <stop offset="0.915033" stopColor="#67C30F"/>
          <stop offset="1" stopColor="#86C504"/>
        </radialGradient>
        <linearGradient id="google-icon-paint7" x1="10.73" y1="20.6583" x2="13.3687" y2="20.6583" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0FBC5C"/>
          <stop offset="1" stopColor="#0CBA65"/>
        </linearGradient>
        <clipPath id="google-icon-clip0">
          <rect width="21.246" height="21.6796" fill="white" transform="translate(1.19995 1.2)"/>
        </clipPath>
      </defs>
    </svg>
  )
}

export default GoogleIcon