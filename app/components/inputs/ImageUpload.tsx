'use client';

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";

declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    onChange: (value: string[]) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value = [],
}) => {
    const [images, setImages] = useState<string[]>(value);

    const handleUpload = useCallback(
        (result: any) => {
            const newImage = result.info.secure_url;
            
            setImages(prevImages => {
                const updatedImages = [...prevImages, newImage];
                onChange(updatedImages);
                return updatedImages;
            });
        },
        [onChange]
    );

    const handleRemove = useCallback(
        (url: string) => {
            const updatedImages = images.filter((item) => item !== url);
            setImages(updatedImages);
            onChange(updatedImages);
        },
        [onChange, images]
    );

    return (
        <CldUploadWidget
            onSuccess={handleUpload}
            uploadPreset="dhvggtyg"
            options={{
                maxFiles: 5,
                multiple: true
            }}
        >
            {({ open }) => {
                return (
                    <div
                        onClick={() => open?.()}
                        className="
                            relative
                            cursor-pointer
                            hover:opacity-70
                            transition
                            border-dashed
                            border-2
                            p-20
                            border-neutral-300
                            flex
                            flex-col
                            justify-center
                            items-center
                            gap-4
                            text-neutral-600
                        "
                    >
                        <TbPhotoPlus size={50} />
                        <div className="font-semibold text-lg">
                            CLick to upload
                        </div>
                        {value.map((url) => (
                            <div
                                key={url}
                                className="relative w-full h-32 border rounded-lg overflow-hidden"
                            >
                                <Image
                                    alt="Uploaded image"
                                    src={url}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                                <button
                                    onClick={() => handleRemove(url)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                                >
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )
            }}
        </CldUploadWidget>
    );
}

export default ImageUpload;