interface RequestTabProps {
  requestDanaId: string;
}

import { useRouter } from 'next/navigation';

export default function RequestTab({ requestDanaId }: RequestTabProps) {
  const router = useRouter();

  return (
    <div className="flex space-x-4 sm:space-x-6">
      <button
          className={`pb-2 ${"text-gray-500 border-b-2 border-transparent"}`}
          onClick={() => router.push(`/home/${requestDanaId}`)}>
          Pengajuan Dana
      </button>
      <button
          className={`pb-2 ${"text-blue-600 border-b-2 border-blue-600"}`}>
          Settlement
      </button>
    </div>
  );
}
