import SettlementPage from "@/components/modules/settlement/settlement-page";

export default function Page({ params }: { params: { requestDanaId: string } }) {
  return <SettlementPage requestDanaId={params.requestDanaId} />;
}