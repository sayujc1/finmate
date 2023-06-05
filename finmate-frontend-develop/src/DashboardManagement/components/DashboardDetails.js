import React, { useState, useEffect } from "react";
import { DatePicker, Select, Space,Row, Col, Spin, Card, notification } from 'antd';
import { BarsOutlined } from "@ant-design/icons";
import MonthlyInsights from "./DashboardInsights/MonthlyInsights";
import { resetDashboardState } from "../actions/DashboardManagementAction";
import {getMonthDashboardDetails} from "../apis/DashboardManagementAPI";
import { useDispatch,useSelector } from "react-redux";
import DashboardInsights from "./DashboardInsights/DashboardInsights";
import {
  DollarCircleOutlined,
  RiseOutlined,
  FallOutlined,
  BankOutlined,
} from "@ant-design/icons";
import RecentTransactions from "./commonInsights/RecentTransactions";
import "../css/EditModalOverride.css";
import moment from "moment";

const { Option } = Select;
const DashboardDetails = () => {
  //value is current date in YYYY-MM format
  const [value, setValue] = useState(`${moment().format("YYYY-MM")}`);
  const [type, setType] = useState('month');
  const dispatch = useDispatch();
  
  const onChange = (value, dateString) => {
    console.log('Formatted Selected Time: ', dateString);
    setValue(dateString);
    loadDashboardDetails(type,dateString);
  };

  const handleSetType = (type) => {
    let value = '';
    setType(type);
    if(type === 'year'){
      value = moment().format("YYYY");
      
    }
    else if(type === 'quarter'){
      value = moment().format("YYYY-[Q]Q");
      
    }
    else{
      value = moment().format("YYYY-MM");
      
    }
    setValue(value);
    loadDashboardDetails(type,value);
  }

  
  const loadDashboardDetails = async (type,value) => {
    setLoading(true);
    try{
      await getMonthDashboardDetails(type, value, dispatch)
    }catch(error){
      notification.error({
        message: "Error",
        description: error?error.message:"Something went wrong.",

      });
    }
    finally{
    setLoading(false);
    }
  }
 
  useEffect(() => {
    loadDashboardDetails(type,value);
    console.log("first time", value)
    return () => {
      dispatch(resetDashboardState());
    };
    // eslint-disable-next-line
  }, [type]);

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
        {type==='month'? 
        <DatePicker picker="month" defaultValue={moment(new Date(), "YYYY-MM")} value={moment(value, "YYYY-MM")} onChange={onChange} format={"YYYY-MM"} allowClear={false}/>
        :type==='quarter'?
        <DatePicker picker="quarter" defaultValue={moment(new Date(), "YYYY-[Q]Q")} value={moment(value, "YYYY-[Q]Q")} onChange={onChange} format={"YYYY-[Q]Q"} allowClear={false}/>
        :<DatePicker picker="year"  defaultValue={moment(new Date(), "YYYY")} value={moment(value, "YYYY")} onChange={onChange}  format={"YYYY"} allowClear={false}
        />}
      </Space>
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
                Rs. {dashboardDetails?.totalBalance?.toFixed(2)}
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
                Rs. {dashboardDetails?.totalIncome?.toFixed(2)}
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
                Rs. {dashboardDetails?.totalExpense?.toFixed(2)}
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
                Rs. {dashboardDetails?.totalSavings?.toFixed(2)}
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
                <div style={{fontSize:"1.4rem"}}>{`Transactions For ${type} - ${type==="month"?`${monthMap[parseInt(value?.split("-")?.[1])]}-${value?.split("-")?.[0]}`:type==="quarter"?`${value?.split("-")?.[1]}-${value?.split("-")?.[0]}`:`${value}`}`}</div></>}
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
              <RecentTransactions />
            </Card>
          </Spin>
        </Col>
      </Row>
      {/* <MonthlyInsights type={type} value={value}/> */}
    </>
  );
};
export default DashboardDetails;
