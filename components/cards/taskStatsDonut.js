import { Card, Empty } from "antd";
import { DonutChart } from "components";

export const TaskStatsDonutCard = ({
  labels,
  colorArray,
  chartData = [],
  chartHeight = 250,
  chartTitle,
}) => {
  return (
    <Card>
      {chartData.every(value => value === 0) ? (
        <Empty />
      ) : (
        <div>
          <p className="text-lg font-semibold text-center mb-2 w-full">
            {chartTitle}
          </p>
          <div className="flex justify-center">
            <DonutChart
              labels={labels}
              chartData={chartData}
              chartTitle={chartTitle}
              legendTitle="Status"
              colorArray={colorArray}
              tooltipLabel="Count"
              chartHeight={chartHeight}
              legendPosition="right"
            />
          </div>
        </div>
      )}
    </Card>
  );
};
