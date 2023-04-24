import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const getData = ({ labels, tooltipLabel, chartData, colorArray }) => ({
  labels: labels,
  datasets: [
    {
      label: tooltipLabel,
      data: chartData,
      backgroundColor: colorArray,
      borderColor: colorArray,
      borderWidth: 1,
    },
  ],
});

export const DonutChart = ({
  labels,
  tooltipLabel,
  chartData,
  colorArray,
  chartTitle,
  legendTitle,
  chartHeight,
  legendPosition,
}) => {
  return (
    <Doughnut
      height={chartHeight}
      data={getData({ labels, tooltipLabel, chartData, colorArray })}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            title: {
              text: legendTitle,
              display: true,
            },
            labels: {
              boxWidth: 20,
              font: {
                size: 10,
              },
            },
            onClick: () => {},
            position: legendPosition,
            align: "center",
            fullSize: true,
          },
          title: {
            display: false,
            text: chartTitle,
            font: {
              size: 16,
            },
          },
          datalabels: {
            color: "#ffffff",
          },
        },
      }}
      plugins={[ChartDataLabels]}
    />
  );
};
