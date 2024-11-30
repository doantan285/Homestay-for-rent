'use client';

import { formatISO, set } from "date-fns";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import Select from "react-select";
import Modal from "./Modal";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import useSearchModal from "@/app/hooks/useSearchModal";
import axios from "axios";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const [province, setProvince] = useState<{ label: string; value: string; districts: any[] } | null>(null);
    const [district, setDistrict] = useState<{ label: string; value: string; wards: any[] } | null>(null);
    const [ward, setWard] = useState<{ label: string; value: string } | null>(null);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
                setProvinces(response.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    const provinceOptions = useMemo(() => {
        return provinces.map((province: any) => ({
            label: province.name,
            value: province.code,
            districts: province.districts,
        }));
    }, [provinces]);

    const districtOptions = useMemo(() => {
        return districts.map((district: any) => ({
            label: district.name,
            value: district.code,
            wards: district.wards,
        }));
    }, [districts]);

    const wardOptions = useMemo(() => {
        return wards.map((ward: any) => ({
            label: ward.name,
            value: ward.code,
        }));
    }, [wards]);

    const handleProvinceChange = useCallback((selectedOption: any) => {
        setProvince(selectedOption); // Lưu đối tượng đã chọn
        setDistrict(null); // Reset district khi thay đổi province
        setWard(null); // Reset ward khi thay đổi province
        setDistricts(selectedOption?.districts || []); // Cập nhật danh sách districts
        setWards([]); // Xóa danh sách wards
    }, []);

    const handleDistrictChange = useCallback((selectedOption: any) => {
        setDistrict(selectedOption); // Lưu đối tượng đã chọn
        setWard(null); // Reset ward khi thay đổi district
        setWards(selectedOption?.wards || []); // Cập nhật danh sách wards
    }, []);

    const handleWardChange = useCallback((selectedOption: any) => {
        setWard(selectedOption); // Lưu đối tượng đã chọn
    }, []);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            province: province?.label, // Lưu tên tỉnh
            provinceCode: province?.value, // Lưu mã tỉnh
            district: district?.label,
            districtCode: district?.value,
            ward: ward?.label,
            wardCode: ward?.value,
            guestCount,
            roomCount,
            bathroomCount,
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        setStep(STEPS.LOCATION);
        searchModal.onClose();

        router.push(url);
    },
        [
            step,
            searchModal,
            province,
            district,
            ward,
            router,
            guestCount,
            roomCount,
            bathroomCount,
            dateRange,
            onNext,
            params
        ]);

    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search';
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Where you wanna go?"
                subtitle="Find the perfect location!"
            />
            <Select
                options={provinceOptions}
                placeholder="Province"
                onChange={handleProvinceChange}
                value={province} // Giá trị hiện tại của province
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg',
                }}
            />

            <Select
                options={districtOptions}
                placeholder="District"
                onChange={handleDistrictChange}
                value={district} // Giá trị hiện tại của district
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg',
                }}
            />

            <Select
                options={wardOptions}
                placeholder="Ward"
                onChange={handleWardChange}
                value={ward} // Giá trị hiện tại của ward
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg',
                }}
            />
        </div>
    )

    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="When do you plan to go?"
                    subtitle="Make sure everyone is free!"
                />
                <Calendar
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="More information"
                    subtitle="Find your perfect place!"
                />
                <Counter
                    title="Guests"
                    subtitle="How many guests are coming?"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you need?"
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        );
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    );
}

export default SearchModal;