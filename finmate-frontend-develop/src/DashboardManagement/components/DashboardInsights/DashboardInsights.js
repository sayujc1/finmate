import React from "react";
import { Column } from "@ant-design/plots";
import { useSelector } from "react-redux";

const DashboardInsights = ({ type, value }) => {
  const data = useSelector(state => state.DashboardReducer.dashboardDetails);
  const monthMap = useSelector(state => state.DashboardReducer.monthMap);
  const config = {
    data,
    xField: "date",
    yField: "amount",
    seriesField: "type",
    padding: 100,
    scrollbar: {
      type: "horizontal",
      animate: true,
      style: {
        trackColor: "darkgrey",
        thumbColor: "grey",
      },
    },
    isGroup: "true",
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    xAxis: {
      title: {
        text: `${
          type === "month"
            ? `${monthMap[parseInt(value?.split("-")?.[1])]}-${
                value?.split("-")?.[0]
              }`
            : type === "quarter"
            ? `${value?.split("-")?.[1]}-${value?.split("-")?.[0]}`
            : `${value}`
        }`,
        style: {
          fontSize: 16,
          shadowColor: "grey",
          shadowBlur: 2,
          shadowOffsetX: 1,
          shadowOffsetY: 1,
        },
      },
      label: {
        autoHide: true,
        autoRotate: false,
        formatter: d => {
          return d?.split(" ")[1];
        },
      },
    },
    yAxis: {
      title: {
        text: "Amount (Rs)",
        style: {
          fontSize: 16,
          shadowColor: "grey",
          shadowBlur: 2,
          shadowOffsetX: 1,
          shadowOffsetY: 1,
        },
        spacing: 20,
      },
      label: {
        autoHide: true,
        autoRotate: false,
        formatter: tpay => {
          return tpay?.split("Rs. ")[1];
        },
      },
    },
    meta: {
      date: {
        alias: "Date",
        formatter: date => {
          return `Date ${date.split("/")[0]}`;
        },
      },
      amount: {
        alias: "Amount",
        formatter: tpay => {
          return `Rs. ${tpay}`;
        },
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    maxColumnWidth: 20,
  };

  return <Column {...config} />;
};

export default DashboardInsights;
