'use client';

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Safelisting, SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
    listing: Safelisting;
    currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    listing,
    currentUser
}) => {
    return (
        <>
            <Heading
                title={listing.title}
                subtitle={`${listing?.locationValue}, ${listing.ward}, ${listing.district}, ${listing.province}`}
            />
            <div
                className="
                    w-full
                    h-[60vh]
                    overflow-hidden
                    rounded-xl
                    relative
                "
            >
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    loop
                    className="h-full"
                >
                    {listing.imageSrc.map((src, index) => (
                        <SwiperSlide key={index}>
                            <Image
                                alt={`Image ${index + 1}`}
                                src={src}
                                fill
                                className="object-cover w-full"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="absolute top-5 right-5">
                    <HeartButton
                        listingId={listing.id}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </>
    );
}

export default ListingHead;