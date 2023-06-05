import React, { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker, notification, Row, Col, Card, Spin } from "antd";
import { getMonthDashboardDetails } from "../../apis/DashboardManagementAPI";
import { useDispatch, useSelector } from "react-redux";
import DashboardInsights from "./DashboardInsights";
import {
  DollarCircleOutlined,
  RiseOutlined,
  FallOutlined,
  BankOutlined,
} from "@ant-design/icons";
import RecentTransactions from "../commonInsights/RecentTransactions";
import "../../css/EditModalOverride.css";
const MonthlyInsights = ({type, value}) => {
  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
  );
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const monthMap = useSelector(state => state.DashboardReducer.monthMap);
  const dashboardDetails = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();
  const loadDashboardDetails = async month => {
    month = month
      ? month
      : `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    setLoading(true);
    await getMonthDashboardDetails(
      month?.split("-")?.[0],
      month?.split("-")?.[1],
      dispatch
    ).catch(err => {
      notification.error({
        message: err,
        description: "Failed to load Month Dashboard Details",
      });
    });

    setLoading(false);
  };
  useEffect(() => {
    // loadDashboardDetails(month);
    // eslint-disable-next-line
  }, []);
  const handleMonth = (date, dateString) => {
    let month = dateString;

    // if clear the date
    if (dateString === "") {
      month = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    }
    setMonth(month);
    // loadDashboardDetails(month);
  };
  return (
    <>
 
      <Row
        style={{
          padding: "20px",
          // background: "#ececec",
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 11 }}
          lg={{ span: 5 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "20px",
            padding: "10px",
            margin: "6px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <Row style={{ textAlign: "center", padding: "50px 0" }}>
            <Col span={10}>
              <DollarCircleOutlined
                style={{
                  color: "#bcad0f",
                  backgroundColor: "rgb(233 254 84 / 79%)",
                  borderRadius: "50%",
                  fontSize: "3rem",
                  padding: "10px",
                }}
              />
            </Col>
            <Col span={12}>
              <span style={{ fontSize: "1.2rem" }}>My Balance</span> <br />{" "}
              <span style={{ fontSize: "1.4rem", fontWeight: 500 }}>
                Rs. 111.28
              </span>
            </Col>
          </Row>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 11 }}
          lg={{ span: 5 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "20px",
            margin: "6px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <Row style={{ textAlign: "center", padding: "50px 0" }}>
            <Col span={10}>
              <RiseOutlined
                style={{
                  color: "#55d715",
                  backgroundColor: "#45ff404f",
                  borderRadius: "50%",
                  fontSize: "3rem",
                  padding: "10px",
                }}
              />
            </Col>
            <Col span={12}>
              <span style={{ fontSize: "1.2rem" }}>Income</span> <br />{" "}
              <span style={{ fontSize: "1.4rem", fontWeight: 500 }}>
                Rs. 111.28
              </span>
            </Col>
          </Row>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 11 }}
          lg={{ span: 5 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "20px",
            margin: "6px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <Row style={{ textAlign: "center", padding: "50px 0" }}>
            <Col span={10}>
              <FallOutlined
                style={{
                  color: "rgb(237 36 49)",
                  backgroundColor: "rgb(254 84 97 / 49%)",
                  borderRadius: "50%",
                  fontSize: "3rem",
                  padding: "10px",
                }}
              />
            </Col>
            <Col span={12}>
              <span style={{ fontSize: "1.2rem" }}>Expenses</span> <br />{" "}
              <span style={{ fontSize: "1.4rem", fontWeight: 500 }}>
                Rs. 111.28
              </span>
            </Col>
          </Row>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 11 }}
          lg={{ span: 5 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "20px",
            margin: "6px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <Row style={{ textAlign: "center", padding: "50px 0" }}>
            <Col span={10}>
              <BankOutlined
                style={{
                  color: "rgb(15 185 188)",
                  backgroundColor: "rgb(84 253 254 / 46%)",
                  borderRadius: "50%",
                  fontSize: "3rem",
                  padding: "10px",
                }}
              />
            </Col>
            <Col span={12}>
              <span style={{ fontSize: "1.2rem" }}>Savings</span> <br />{" "}
              <span style={{ fontSize: "1.4rem", fontWeight: 500 }}>
                Rs. 111.28
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Spin tip="Loading..." spinning={loading}>
            <Card
              title={<>
                <div style={{fontSize:"1.4rem"}}>{`Transactions For Month - ${
                monthMap[parseInt(month?.split("-")?.[1])]
              }-${month?.split("-")?.[0]}`}</div></>}
              hoverable
              headStyle={{ fontSize: "16px" }}
              style={{ borderRadius: "20px" }}
            >
              <DashboardInsights type={type} value={value}/>
            </Card>
          </Spin>
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col
          span={24}
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            marginBottom: "10px"
          }}
        >
          <Spin tip="Loading..." spinning={loading}>
            <Card
              title={<>
              <div style={{fontSize:"1.4rem"}}>
                Recent Transactions</div></>}
              hoverable
              style={{ borderRadius: "20px" }}
            >
              {/* <TotalPaymentInsights /> */}
              <RecentTransactions />
            </Card>
          </Spin>
        </Col>
      </Row>
    </>
  );
};
export default MonthlyInsights;
