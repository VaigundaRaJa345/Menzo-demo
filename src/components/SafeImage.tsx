import React, { useState } from 'react';
import { Shirt } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  ...rest
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#ECE9E2] text-[#7A746A] select-none ${className}`}
      >
        <Shirt className="w-7 h-7 stroke-[1.25] mb-2 opacity-60" />
        <span className="text-[11px] tracking-[0.14em] uppercase px-4 text-center">
          {fallbackLabel || 'Menzo Clothing'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
};
