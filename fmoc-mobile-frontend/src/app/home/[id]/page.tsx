import DetailRequest from "@/components/modules/request/detail-request"

export default async function RequestPage({ params }: { params: { id: string } }) {
  return <DetailRequest requestId={params.id} />
}