import ReceptionMeetingForm from "@/components/dashboard/ReceptionMeetingForm";
import RecepcaoSectionView from "@/components/dashboard/RecepcaoSectionView";
import { getDashboardData } from "@/services/dashboardData";
import { getRecepcaoConsultores, getRecepcaoSectionData } from "@/services/recepcaoSectionData";

export default async function RecepcaoAgendaPage() {
  const [dashboard, section, consultores] = await Promise.all([
    getDashboardData("recepcao"),
    getRecepcaoSectionData("agenda"),
    getRecepcaoConsultores(),
  ]);

  return (
    <RecepcaoSectionView
      action={<ReceptionMeetingForm consultores={consultores} />}
      dashboard={dashboard}
      section={section}
    />
  );
}
