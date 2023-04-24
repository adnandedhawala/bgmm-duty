import { Card, Empty } from "antd";
import { BarChart } from "components";

export const TaskStatsBarCard = ({
  labels,
  colorArray,
  chartData = [],
  chartTitle,
  chartHeight = 250,
}) => {
  return (
    <Card>
      {chartData.every(value => value === 0) ? (
        <Empty />
      ) : (
        <div>
          <p className="text-lg font-semibold text-center mb-2">{chartTitle}</p>
          <div>
            <BarChart
              labels={labels}
              chartData={chartData}
              legendTitle="Status"
              colorArray={colorArray}
              tooltipLabel="Count"
              chartHeight={chartHeight}
            />
          </div>
        </div>
      )}
    </Card>
  );
};
