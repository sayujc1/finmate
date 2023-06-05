import React, { useState, useEffect } from "react";
import { DatePicker, Select, Space,Row, Col, notification } from 'antd';
import { resetTransactionState } from "../actions/TransactionManagementAction";
import {getTransactionDetails} from "../apis/TransactionManagementAPI";
import { useDispatch, useSelector } from "react-redux";
import TransactionsTable from "./TransactionsTable";
import {
  DollarCircleOutlined,
  RiseOutlined,
  FallOutlined,
  BankOutlined,
} from "@ant-design/icons";
import moment from "moment";
// import { useSelector } from "react-redux";
const { Option } = Select;
const { RangePicker } = DatePicker;

const TransactionsDetails = () => {
  //value is current date in YYYY-MM format
  const [value, setValue] = useState(`${moment().format("DD/MM/YYYY")}`);
  const dispatch = useDispatch();
  const onChange = (value, dateString) => {
    console.log('Formatted Selected Time: ', dateString);
    setValue(dateString);
    loadTransactionDetails(type,dateString);
  };
  const [type, setType] = useState('date');
  const transactionDetails = useSelector(state => state.TransactionReducer);
  const [loading, setLoading] = useState(false);
  
  const handleSetType = (type) => {
    let value = '';
    setType(type);
    if(type === 'date'){
      value = moment().format("DD/MM/YYYY");
    }
    else if(type === 'week'){
      value = moment().format("YYYY-WW");
    }
    else if(type === 'year'){
      value = moment().format("YYYY");
      
    }
    else if(type === 'quarter'){
      value = moment().format("YYYY-[Q]Q");
      
    }
    else if(type === 'month'){
      value = moment().format("YYYY-MM");
      
    }
    else{
      value = [moment().format("DD/MM/YYYY"),moment().format("DD/MM/YYYY")];
    }
    setValue(value);
    loadTransactionDetails(type,value);
  }

  
  const loadTransactionDetails = async (type,value) => {
    setLoading(true);
    try{
      type==="custom"?await getTransactionDetails(type, value[0],value[1], dispatch):await getTransactionDetails(type, value,null, dispatch)
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
    loadTransactionDetails(type,value);
    console.log("first time", value)
    return () => {
      dispatch(resetTransactionState());
    };
    // eslint-disable-next-line
  }, [type]);

  return (
    <>
      <Space>
        <Select value={type} onChange={handleSetType}>
          <Option value="date">Date</Option>
          <Option value="week">Week</Option>
          <Option value="month">Month</Option>
          <Option value="quarter">Quarter</Option>
          <Option value="year">Year</Option>
          <Option value="custom">Custom</Option>
        </Select>
        {/* <PickerWithType type={type} onChange={onChange} /> */}
        {type==='date'?
        <DatePicker defaultValue={moment(new Date(), "DD/MM/YYYY")} value={moment(value, "DD/MM/YYYY")} onChange={onChange} format="DD/MM/YYYY" allowClear={false}/>
        :type==='custom'?
        <RangePicker
        defaultValue={[moment(new Date(), "DD/MM/YYYY"),moment(new Date(), "DD/MM/YYYY")]} value={[moment(value, "DD/MM/YYYY"),moment(value, "DD/MM/YYYY")]}
        format="DD/MM/YYYY"
        onChange={onChange}
        allowClear={false}
      />
        :type==='week'?
        <DatePicker picker="week"  defaultValue={moment(new Date(), "YYYY-WW")} value={moment(value, "YYYY-WW")} onChange={onChange} format="YYYY-WW" />
        :type==='month'? 
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
                Rs. {transactionDetails?.totalBalance?.toFixed(2)}
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
                Rs. {transactionDetails?.totalIncome?.toFixed(2)}
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
                Rs. {transactionDetails?.totalExpense?.toFixed(2)}
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
                Rs. {transactionDetails?.totalSavings?.toFixed(2)}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      <TransactionsTable loading={loading} setLoading={setLoading}/>
    </>
  );
};
export default TransactionsDetails;
