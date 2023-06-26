import React, { useState } from "react";
import { Timeline, Spin } from "antd";
import { ClockCircleOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useEffect } from "react";
import { getTransactionDetailsByBillId } from "../../apis/BillManagementAPI";
import moment from "moment";

const ViewTimeline = ({ bill }) => {
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchItemData = async () => {
    setLoading(true);
    await getTransactionDetailsByBillId(bill.bill_id).then(data => {
      setItemData(data);
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchItemData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill]);

  return (
    <div
      style={{
        minHeight: "50px",
      }}
    >
      <Spin tip="Loading..." spinning={loading}>
        {itemData.length > 0 ? (
          <Timeline mode="alternate" reverse={true}>
            {itemData.map((item, index) => {
              return (
                <Timeline.Item key={index} color="green">
                  {item.due_date && <p>Due On: {item.due_date}</p>}
                  <p>Paid On: {item.date}</p>
                  <p>Amount: Rs.{item.amount}</p>
                </Timeline.Item>
              );
            })}
            {bill.status === "Paid" ? (
              <Timeline.Item
                dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
              >
                <p>Next Due On: {bill.due_date}</p>
                <p>
                  Payable On:{" "}
                  {moment(bill.due_date, "DD/MM/YYYY")
                    .subtract(5, "days")
                    .format("DD/MM/YYYY")}
                </p>
              </Timeline.Item>
            ) : bill.status === "Not Paid" ? (
              <Timeline.Item
                dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
              >
                <p>Due On: {bill.due_date}</p>
              </Timeline.Item>
            ) : bill.status === "Canceled" ? (
              <Timeline.Item
                dot={
                  <CloseCircleFilled
                    style={{ fontSize: "16px", color: "red" }}
                  />
                }
              >
                <p>Canceled On: {bill?.last_updated_time}</p>
              </Timeline.Item>
            ) : null}
          </Timeline>
        ) : bill.status === "Not Paid" ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Timeline.Item
              dot={
                <ClockCircleOutlined
                  style={{
                    fontSize: "16px",
                  }}
                />
              }
            >
              <p>Due On: {bill.due_date}</p>
            </Timeline.Item>
          </div>
        ) : null}
      </Spin>
    </div>
  );
};
export default ViewTimeline;
