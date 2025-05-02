// app/home/[id]/page.tsx

import React from "react";
import DetailRequest from "@/components/modules/request/detail-request";

interface RequestPageProps {
  params: {
    id: string;
  };
}

export default function RequestPage({ params }: RequestPageProps) {
  return <DetailRequest requestId={params.id} />;
}
