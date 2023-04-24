import React from "react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  BarElement,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

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

export const BarChart = ({
  labels,
  tooltipLabel,
  chartData,
  colorArray,
  chartTitle,
  chartHeight,
}) => {
  return (
    <Bar
      height={chartHeight}
      data={getData({ labels, tooltipLabel, chartData, colorArray })}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            text: chartTitle,
            display: false,
            padding: {
              bottom: 24,
            },
            font: {
              size: 16,
            },
          },
          datalabels: {
            color: "#ffffff",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      }}
      plugins={[ChartDataLabels]}
    />
  );
};
