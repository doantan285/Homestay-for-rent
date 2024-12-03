'use client';

import { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import axios from 'axios';

type Ward = {
    name: string;
    code: string;
};

type District = {
    name: string;
    code: string;
    wards: Ward[];
};

type Province = {
    name: string;
    code: string;
    districts: District[];
};

export type LocationSelectValue = {
    province: string;
    district: string;
    ward: string;
    locationValue: string;
};

interface LocationSelectProps {
    province: string;
    district: string;
    ward: string;
    locationValue: string;
    onChange: (value: LocationSelectValue) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
    province,
    district,
    ward,
    locationValue,
    onChange,
}) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(province || null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(district || null);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get<Province[]>('https://provinces.open-api.vn/api/?depth=3');
                setProvinces(response.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (province) {
            const matchingProvince = provinces.find((p) => p.name === province);
            if (matchingProvince) {
                setSelectedProvince(matchingProvince.name);
                setDistricts(matchingProvince.districts);
            }
        }

        if (district && districts.length > 0) {
            const matchingDistrict = districts.find((d) => d.name === district);
            if (matchingDistrict) {
                setSelectedDistrict(matchingDistrict.name);
                setWards(matchingDistrict.wards);
            }
        }
    }, [province, district, provinces, districts]);

    const handleProvinceChange = useCallback((selectedOption: any) => {
        const provinceName = selectedOption?.label || '';
        const provinceDistricts = selectedOption?.districts || [];

        setSelectedProvince(provinceName);
        setDistricts(provinceDistricts);
        setWards([]);
        setSelectedDistrict(null);

        onChange({
            province: provinceName,
            district: '',
            ward: '',
            locationValue: '',
        });
    }, [onChange]);

    const handleDistrictChange = useCallback((selectedOption: any) => {
        const districtName = selectedOption?.label || '';
        const districtWards = selectedOption?.wards || [];

        setSelectedDistrict(districtName);
        setWards(districtWards);

        onChange({
            province: selectedProvince || '',
            district: districtName,
            ward: '',
            locationValue: '',
        });
    }, [onChange, selectedProvince]);

    const handleWardChange = useCallback((selectedOption: any) => {
        const wardName = selectedOption?.label || '';

        onChange({
            province: selectedProvince || '',
            district: selectedDistrict || '',
            ward: wardName,
            locationValue,
        });
    }, [onChange, selectedProvince, selectedDistrict, locationValue]);

    const handleLocationValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            province: selectedProvince || '',
            district: selectedDistrict || '',
            ward: ward || '',
            locationValue: event.target.value,
        });
    }, [onChange, selectedProvince, selectedDistrict, ward]);

    return (
        <div className='flex flex-col gap-2'>
            <Select
                placeholder="Chọn tỉnh/thành phố"
                options={provinces.map((province) => ({
                    label: province.name,
                    value: province.code,
                    ...province,
                }))}
                value={selectedProvince ? { label: selectedProvince, value: selectedProvince } : null}
                onChange={handleProvinceChange}
                isClearable
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg',
                }}
            />
            {districts.length > 0 && (
                <Select
                    placeholder="Chọn quận/huyện"
                    options={districts.map((district) => ({
                        label: district.name,
                        value: district.code,
                        wards: district.wards,
                    }))}
                    value={selectedDistrict ? { label: selectedDistrict, value: selectedDistrict } : null}
                    onChange={handleDistrictChange}
                    isClearable
                    classNames={{
                        control: () => 'p-3 border-2',
                        input: () => 'text-lg',
                        option: () => 'text-lg',
                    }}
                />
            )}
            {wards.length > 0 && (
                <Select
                    placeholder="Chọn phường/xã"
                    options={wards.map((ward) => ({
                        label: ward.name,
                        value: ward.code,
                    }))}
                    value={ward ? { label: ward, value: ward } : null}
                    onChange={handleWardChange}
                    isClearable
                    classNames={{
                        control: () => 'p-3 border-2',
                        input: () => 'text-lg',
                        option: () => 'text-lg',
                    }}
                />
            )}
            <input
                type="text"
                value={locationValue || ''}
                onChange={handleLocationValueChange}
                placeholder="Nhập địa chỉ chi tiết"
                className="p-3 border-2 rounded text-lg"
            />
        </div>
    );
};

export default LocationSelect;
