import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TASK_STATUS } from "appConstants";
import { getTaskStatusColor } from "fe-helpers";
import { find } from "lodash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getData = ({ labels, chartData = [] }) => ({
  labels: labels,
  datasets: Object.values(TASK_STATUS).map(status => {
    return {
      label: status.split("_").join(" "),
      backgroundColor: getTaskStatusColor(status),
      data: chartData.map(value =>
        find(value.counts, { status })
          ? find(value.counts, { status }).count
          : 0
      ),
    };
  }),
});

export const StackedBarChart = ({
  chartHeight,
  chartData,
  legendTitle,
  labels,
}) => {
  return (
    <Bar
      height={chartHeight}
      data={getData({ labels, chartData })}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            title: {
              text: legendTitle,
              display: false,
            },
            labels: {
              boxWidth: 20,
              font: {
                size: 12,
              },
            },
            position: "top",
            align: "center",
            fullSize: true,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
            grid: {
              display: false,
            },
          },
        },
      }}
    />
  );
};
