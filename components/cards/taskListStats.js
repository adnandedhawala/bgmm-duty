import { Card } from "antd";

export const TaskListStatsCard = ({ title, icon, value }) => {
  return (
    <Card bordered={false}>
      <div className="flex items-center">
        <div className="text-4xl mr-4">{icon}</div>
        <div className="flex flex-1 flex-col items-center">
          <span>{title}</span>
          <h2 className="text-4xl">{value}</h2>
        </div>
      </div>
    </Card>
  );
};
