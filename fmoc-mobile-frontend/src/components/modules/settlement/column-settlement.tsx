"use client";
import { Settlement } from "@/components/model/settlement/models";

/**
 * Props
 *  └ data - full list fetched from API
 *  └ filterStatus? – optional status filter (approved / waiting …)
 */
type Props = {
  data: Settlement[];
  filterStatus?: string;          // optional
};

const fmtDateTime = (iso: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  return (
    d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' - ' +
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
};

export const SettlementCardList = ({ data, filterStatus }: Props) => {
  const rows = filterStatus ? data.filter(s => s.status === filterStatus) : data;

  if (rows.length === 0)
    return <p className="text-center text-neutral-500 mt-4">No settlements found.</p>;

  return (
    <div className="flex-1 overflow-y-auto mt-4 space-y-4 pb-4">
      {rows.map(row => (
        <div
          key={row.id}
          className="flex flex-col sm:flex-row bg-white p-4 sm:p-5 rounded-2xl shadow-md
                     border border-neutral-200 hover:shadow-lg transition-shadow duration-200"
        >
          {/* Bukti foto */}
          {row.buktiPenggunaanDanaUrl && (
            <img
              src={row.buktiPenggunaanDanaUrl}
              alt="Bukti Penggunaan"
              className="w-32 h-20 object-cover rounded mb-2 sm:mb-0"
            />
          )}

          {/* Isi kartu */}
          <div className="sm:ml-4 flex-1">
            <h2 className="font-semibold text-base sm:text-lg">
              {row.description}
              <span className="text-xs font-thin text-neutral-500">
                , {fmtDateTime(row.transactionDate).split(' - ')[0]}
              </span>
            </h2>

            <p className="text-xs sm:text-sm mt-1">
              Nominal&nbsp;Request: Rp {row.nominal.toLocaleString('id-ID')}
            </p>
            <p className="text-xs sm:text-sm">
              Nominal&nbsp;Dipakai: Rp {row.usageNominal.toLocaleString('id-ID')}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded">{row.category}</span>
              <span className="bg-sky-200 text-sky-800 px-2 py-1 rounded">{row.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
