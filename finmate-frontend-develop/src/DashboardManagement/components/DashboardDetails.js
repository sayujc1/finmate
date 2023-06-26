import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Select,
  Space,
  Row,
  Col,
  Spin,
  Card,
  notification,
} from "antd";
import { resetDashboardState } from "../actions/DashboardManagementAction";
import { getMonthDashboardDetails } from "../apis/DashboardManagementAPI";
import { useDispatch, useSelector } from "react-redux";
import DashboardInsights from "./DashboardInsights/DashboardInsights";
import RecentTransactionsTable from "./commonInsights/RecentTransactionsTable";
import "../css/EditModalOverride.css";
import moment from "moment";
import TotalCounterCards from "../../common/components/TotalCounterCards";

const { Option } = Select;
const DashboardDetails = () => {
  //value is current date in YYYY-MM format
  const [value, setValue] = useState(`${moment().format("YYYY-MM")}`);
  const [type, setType] = useState("month");
  const dispatch = useDispatch();

  const onChange = (value, dateString) => {
    setValue(dateString);
    loadDashboardDetails(type, dateString);
  };

  const handleSetType = type => {
    let value = "";
    setType(type);
    if (type === "year") {
      value = moment().format("YYYY");
    } else if (type === "quarter") {
      value = moment().format("YYYY-[Q]Q");
    } else {
      value = moment().format("YYYY-MM");
    }
    setValue(value);
    loadDashboardDetails(type, value);
  };

  const loadDashboardDetails = async (type, value) => {
    setLoading(true);
    try {
      await getMonthDashboardDetails(type, value, dispatch);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error ? error.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardDetails(type, value);
    return () => {
      dispatch(resetDashboardState());
    };
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const monthMap = useSelector(state => state.DashboardReducer.monthMap);
  const dashboardDetails = useSelector(state => state.DashboardReducer);

  return (
    <>
      <Space>
        <Select value={type} onChange={handleSetType}>
          <Option value="month">Month</Option>
          <Option value="quarter">Quarter</Option>
          <Option value="year">Year</Option>
        </Select>
        {type === "month" ? (
          <DatePicker
            picker="month"
            defaultValue={moment(new Date(), "YYYY-MM")}
            value={moment(value, "YYYY-MM")}
            onChange={onChange}
            format={"YYYY-MM"}
            allowClear={false}
          />
        ) : type === "quarter" ? (
          <DatePicker
            picker="quarter"
            defaultValue={moment(new Date(), "YYYY-[Q]Q")}
            value={moment(value, "YYYY-[Q]Q")}
            onChange={onChange}
            format={"YYYY-[Q]Q"}
            allowClear={false}
          />
        ) : (
          <DatePicker
            picker="year"
            defaultValue={moment(new Date(), "YYYY")}
            value={moment(value, "YYYY")}
            onChange={onChange}
            format={"YYYY"}
            allowClear={false}
          />
        )}
      </Space>
      <TotalCounterCards counterDetails={dashboardDetails} />
      <Row>
        <Col span={24}>
          <Spin tip="Loading..." spinning={loading}>
            <Card
              title={
                <>
                  <div
                    style={{ fontSize: "1.4rem" }}
                  >{`Transactions For ${type} - ${
                    type === "month"
                      ? `${monthMap[parseInt(value?.split("-")?.[1])]}-${
                          value?.split("-")?.[0]
                        }`
                      : type === "quarter"
                      ? `${value?.split("-")?.[1]}-${value?.split("-")?.[0]}`
                      : `${value}`
                  }`}</div>
                </>
              }
              hoverable
              headStyle={{ fontSize: "16px" }}
              style={{ borderRadius: "20px" }}
            >
              <DashboardInsights type={type} value={value} />
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
            marginBottom: "10px",
          }}
        >
          <Card
            title={
              <>
                <div style={{ fontSize: "1.4rem" }}>Recent Transactions</div>
              </>
            }
            hoverable
            style={{ borderRadius: "20px" }}
          >
            <RecentTransactionsTable />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default DashboardDetails;
