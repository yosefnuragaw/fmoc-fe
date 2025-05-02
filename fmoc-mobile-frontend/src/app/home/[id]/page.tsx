// app/home/[id]/page.tsx

import React from "react";
import DetailRequest from "@/components/modules/request/detail-request";

export default function RequestPage({
  params,
}: {
  params: { id: string };
}) {
  return <DetailRequest requestId={params.id} />;
}