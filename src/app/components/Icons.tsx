import React from "react";
import svgPaths from "../../imports/svg-12grppfl7a";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof svgPaths;
  size?: number | string;
  fill?: string;
  stroke?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  fill = "currentColor", 
  stroke, 
  className,
  viewBox = "0 0 100 100", // Default viewBox, might need adjustment per icon
  ...props 
}) => {
  const path = svgPaths[name];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={viewBox} 
      fill="none" 
      className={className}
      {...props}
    >
      <path 
        d={path} 
        fill={fill} 
        stroke={stroke} 
      />
    </svg>
  );
};

// Specialized components for specific icons to match Figma exactly
export const RssFeedIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 21 21">
    <path d={svgPaths.p67b3a00} fill="currentColor" />
    <path d={svgPaths.p2db5f380} fill="currentColor" />
  </svg>
);

export const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 85 66">
    <path d={svgPaths.p3a62a080} fill="currentColor" />
  </svg>
);

export const LockIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 82 85">
        <path d={svgPaths.p2ef88300} fill="currentColor" />
    </svg>
)

export const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 126 95">
    <path d={svgPaths.p11049180} fill="currentColor" />
    <path d={svgPaths.pd6da200} fill="currentColor" />
  </svg>
);

export const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 181.644 178.256">
    <path d={svgPaths.p39137200} fill="#395185" />
    <path d={svgPaths.pdb3ee80} fill="white" />
  </svg>
);

export const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 181.644 178.256">
    <path d={svgPaths.p16f45680} fill="#EA4335" />
    <path d={svgPaths.p7235780} fill="#34A853" />
    <path d={svgPaths.p3aa49a00} fill="#4A90E2" />
    <path d={svgPaths.p2288e780} fill="#FBBC05" />
  </svg>
);

export const PlayCircleIcon = ({ className, fill="#A099FF" }: { className?: string, fill?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 12 12">
    <path d={svgPaths.p3020cf00} fill={fill} />
  </svg>
);

export const PauseCircleIcon = ({ className, fill="#6E3677" }: { className?: string, fill?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 154 152">
    <path d={svgPaths.p2fee5d00} fill={fill} />
  </svg>
);

export const ForwardArrowIcon = ({ className, fill="#F3EEEA" }: { className?: string, fill?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 103 86">
        <path d={svgPaths.p6a8f00} fill={fill} />
    </svg>
);

export const MicIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 90 111">
        <path d={svgPaths.p3df9f600} fill="#424242" />
    </svg>
);

export const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 38 58">
        <path d={svgPaths.p2be5a400} stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const HeartIcon = ({ className, fill="currentColor" }: { className?: string, fill?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 70 56">
        <path d={svgPaths.pdc31100} fill={fill} />
    </svg>
);
