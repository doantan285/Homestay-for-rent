'use client';

import Image from "next/image";

interface AvatarProps {
    src: string | null | undefined;
    size?: 30 | 200;
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    size = 30
}) => {
    return ( 
        <div
            style={{ width: size, height: size }}
            className="rounded-full overflow-hidden"
        >
            <Image
                className="rounded-full"
                height={size}
                width={size}
                alt="Avatar"
                src={src || "/images/placeholder.jpg"}
                objectFit="cover"
            />
        </div>
     );
}
 
export default Avatar;