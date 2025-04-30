"use client"
import { RequestDana } from "@/components/model/request/models";
import { Button } from "@/components/ui/button"
// import { ColumnDef } from "@tanstack/react-table"
// import { RiArrowUpDownFill } from "react-icons/ri"
import Link from "next/link"

type Props = {
    data: RequestDana[];
    selectSettled: boolean;
  };

const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) + ` - ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
};


export const RequestCardList = ({ data, selectSettled }: Props) => {
    const filteredData = data.filter((item) => item.settled === selectSettled);
  
    if (filteredData.length === 0) {
      return <p className="text-center text-neutral-500 mt-4">No items found.</p>;
    }
  
    return (
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pb-4">
        {filteredData.map((item) => (
          <div
            key={item.requestId}
            className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-neutral-200 hover:shadow-lg transition-shadow duration-200"
          >

  
            {/* Content */}
            <div className="mt-2 sm:mt-0 sm:ml-4 flex-1">
              <h2 className="font-semibold text-base sm:text-lg">{item.wo}
                <span className="text-xs sm:text-sm font-thin text-neutral-500 ">,  {formatDateTime(item.submissionDate).split(" - ")[0]}</span>
              </h2>
              <p className="text-xs sm:text-sm mt-1">
                Nominal: Rp {item.nominal.toLocaleString("id-ID")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
                <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    selectSettled
                      ? "bg-green-200 text-green-800"
                      : "bg-sky-200 text-sky-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  