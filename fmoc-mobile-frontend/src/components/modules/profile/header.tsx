// components/ui/UserGreeting.tsx
'use client';
import React from 'react';
import { UserData } from '@/components/model/profile/models';

type Props = {
    userData: UserData | undefined;
};

export default function HeroProfile({ userData }: Props) {
    const formatCurrency = (value: number | null) => {
        const number = Number(value);
        if (isNaN(number)) return "-";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <div>
            <h1 className="text-xl sm:text-2xl font-bold">Hi, {userData?.name}</h1>
            <p className="text-sm sm:text-base text-neutral-500">Saldo Tersedia</p>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1">
                {userData?.saldo == null ? '0' : formatCurrency(userData.saldo)}
            </p>
        </div>
    );
}
