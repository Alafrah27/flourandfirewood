"use client"

import { useState } from 'react';
import { Image, buildSrc } from '@imagekit/next';

export default function ImageKit({ src, width, height, alt, transformation, className, ...props }) {
    const [isLoaded, setIsLoaded] = useState(false);

    // Generate a tiny blurred placeholder URL via ImageKit CDN
    const lqipSrc = buildSrc({
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
        src,
        transformation: [{ quality: 10, blur: 30, width: 30 }],
    });

    return (
        <Image
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
            src={src}
            width={width}
            height={height}
            alt={alt}
            transformation={transformation}
            className={className}
            onLoad={() => setIsLoaded(true)}
            style={{
                backgroundImage: isLoaded ? 'none' : `url(${lqipSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'opacity 0.3s ease-in-out',
                opacity: isLoaded ? 1 : 0.85,
            }}
            {...props}
            loading="eager"
            fetchPriority="high"
        />
    );
}