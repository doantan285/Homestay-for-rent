'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface StatisticsContextProps {
    selectedYear: string;
    selectedMonth: string;
    setSelectedYear: (year: string) => void;
    setSelectedMonth: (month: string) => void;
    data: any[]; // Dữ liệu bảng
    setData: (data: any[]) => void;
}

const StatisticsContext = createContext<StatisticsContextProps | undefined>(undefined);

export const StatisticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [data, setData] = useState<any[]>([]);

    return (
        <StatisticsContext.Provider
            value={{ selectedYear, selectedMonth, setSelectedYear, setSelectedMonth, data, setData }}
        >
            {children}
        </StatisticsContext.Provider>
    );
};

export const useStatisticsContext = () => {
    const context = useContext(StatisticsContext);
    if (!context) throw new Error("useStatisticsContext must be used within a StatisticsProvider");
    return context;
};