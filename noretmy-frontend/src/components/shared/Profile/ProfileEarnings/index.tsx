'use client';

import React from 'react';
import { DollarSign, Wallet, Clock, ArrowDownCircle } from 'lucide-react';

type Revenue = {
  total?: number;
  available?: number;
  pending?: number;
  withdrawn?: number;
};

interface ProfileEarningsProps {
  revenue?: Revenue;
}

const formatMoney = (value?: number) => {
  const n = Number.isFinite(value as number) ? (value as number) : 0;
  return `$${n.toLocaleString()}`;
};

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-orange-500" />
        </div>
      </div>
    </div>
  );
};

const ProfileEarnings: React.FC<ProfileEarningsProps> = ({ revenue }) => {
  const total = revenue?.total ?? 0;
  const available = revenue?.available ?? 0;
  const pending = revenue?.pending ?? 0;
  const withdrawn = revenue?.withdrawn ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Earnings" value={formatMoney(total)} icon={DollarSign} />
        <StatCard label="Available" value={formatMoney(available)} icon={Wallet} />
        <StatCard label="Pending" value={formatMoney(pending)} icon={Clock} />
        <StatCard label="Withdrawn" value={formatMoney(withdrawn)} icon={ArrowDownCircle} />
      </div>

      {total <= 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
          No earnings yet. Complete orders to start earning.
        </div>
      )}
    </div>
  );
};

export default ProfileEarnings;
