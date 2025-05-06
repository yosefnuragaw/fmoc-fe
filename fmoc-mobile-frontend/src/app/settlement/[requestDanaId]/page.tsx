import { type FC } from "react";
import SettlementPage from "@/components/modules/settlement/settlement-page";

interface PageProps {
  params: {
    requestDanaId: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  return <SettlementPage requestDanaId={params.requestDanaId} />;
};

export default Page;