type Activity = {
  title: string;
  description: string;
  time: string;
  tone: "gold" | "blue" | "green" | "orange" | "violet";
};

type ActivityListProps = {
  activities: Activity[];
  subtitle?: string;
  title?: string;
};

export default function ActivityList({
  activities,
  subtitle = "Ultimas movimentacoes do sistema",
  title = "Atividades Recentes",
}: ActivityListProps) {
  const icons: Record<Activity["tone"], string> = {
    gold: "bi-people",
    blue: "bi-person-check",
    green: "bi-person-plus",
    orange: "bi-calendar3",
    violet: "bi-currency-dollar",
  };

  return (
    <section className="dashboard-card activity-card">
      <div className="dashboard-card-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="activity-list">
        {activities.map((activity) => (
          <article className="activity-item" key={`${activity.title}-${activity.time}`}>
            <span className={`activity-icon ${activity.tone}`}>
              <i className={`bi ${icons[activity.tone]}`} aria-hidden="true" />
            </span>
            <div>
              <strong>{activity.title}</strong>
              <p>{activity.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
