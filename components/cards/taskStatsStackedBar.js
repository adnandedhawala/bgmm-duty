import { Card, Empty } from "antd";
import { StackedBarChart } from "components";

export const TaskStatsStackedBarCard = ({
  labels,
  chartData = [],
  chartTitle,
  chartHeight = 250,
  legendTitle,
}) => {
  return (
    <Card>
      {chartData.every(value => value === 0) ? (
        <Empty />
      ) : (
        <Card>
          <div>
            <p className="text-lg font-semibold text-center mb-2">
              {chartTitle}
            </p>
            <div>
              <StackedBarChart
                labels={labels}
                chartData={chartData}
                chartHeight={chartHeight}
                legendTitle={legendTitle}
              />
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};
