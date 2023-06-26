import React, { useState, useEffect } from "react";
import { getBudgetDetails } from "../apis/BudgetManagementAPI";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, notification, Row, Col, Space, Select } from "antd";
import moment from "moment";
import AddBudgetForm from "./Budget/AddBudgetForm";
import BudgetTable from "./Budget/BudgetTable";
import BudgetDtailsCss from "../css/BudgetDetails.module.css";
import TransactionDetailsCss from "../css/TotalCounterCards.module.css";
import { resetBudgetState } from "../actions/BudgetManagementAction";
import {
  DollarCircleOutlined,
  MehOutlined,
  SmileOutlined,
  FallOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { RangePicker } = DatePicker;
const BudgetDetails = () => {
  const [addBudgetForm, setAddBudgetForm] = useState({
    start_date: "",
    end_date: "",
    budget: "",
    spent: "",
    status: "",
    remarks: "",
    is_recurring: 0,
  });
  const [AddBudgetFormErrors, setAddBudgetFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const budgetDetails = useSelector(state => state.BudgetReducer);

  const dispatch = useDispatch();
  const [value, setValue] = useState(`${moment().format("YYYY-MM")}`);
  const [type, setType] = useState("month");
  const onChange = (value, dateString) => {
    setValue(dateString);
    loadBudgetDetails(type, dateString);
  };
  const handleSetType = type => {
    let value = "";
    setType(type);
    if (type === "year") {
      value = moment().format("YYYY");
    } else if (type === "month") {
      value = moment().format("YYYY-MM");
    } else {
      value = [moment().format("DD/MM/YYYY"), moment().format("DD/MM/YYYY")];
    }
    setValue(value);
    loadBudgetDetails(type, value);
  };

  const loadBudgetDetails = async (type, value) => {
    setLoading(true);
    try {
      type === "custom"
        ? await getBudgetDetails(type, value[0], value[1], dispatch)
        : await getBudgetDetails(type, value, null, dispatch);
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
    loadBudgetDetails(type, value);
    return () => {
      dispatch(resetBudgetState());
    };
    // eslint-disable-next-line
  }, [type]);
  return (
    <>
      <div>
        <Row className={TransactionDetailsCss.totalCountersContainer}>
          {/* Budget Container */}
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 11 }}
            lg={{ span: 7 }}
            className={TransactionDetailsCss.totalCounterCol}
          >
            <Row className={TransactionDetailsCss.totalCounterColRow}>
              <Col span={10}>
                <DollarCircleOutlined
                  id={TransactionDetailsCss.dollarIcon}
                  className={TransactionDetailsCss.totalCounterIconStyle}
                />
              </Col>
              <Col span={12}>
                <span className={TransactionDetailsCss.totalCounterTitle}>
                  Total Budget
                </span>{" "}
                <br />{" "}
                <span className={TransactionDetailsCss.totalCounterValue}>
                  Rs. {budgetDetails?.totalBudget?.toFixed(2)}
                </span>
              </Col>
            </Row>
          </Col>
          {/* Spent Container */}
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 11 }}
            lg={{ span: 7 }}
            className={TransactionDetailsCss.totalCounterCol}
          >
            <Row className={TransactionDetailsCss.totalCounterColRow}>
              <Col span={10}>
                <FallOutlined
                  className={TransactionDetailsCss.totalCounterIconStyle}
                  id={TransactionDetailsCss.expenseIcon}
                />
              </Col>
              <Col span={12}>
                <span className={TransactionDetailsCss.totalCounterTitle}>
                  Total Spent
                </span>{" "}
                <br />{" "}
                <span className={TransactionDetailsCss.totalCounterValue}>
                  Rs. {budgetDetails?.totalSpent?.toFixed(2)}
                </span>
              </Col>
            </Row>
          </Col>
          {/* Status Container */}
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 11 }}
            lg={{ span: 7 }}
            className={TransactionDetailsCss.totalCounterCol}
          >
            <Row className={TransactionDetailsCss.totalCounterColRow}>
              <Col span={10}>
                {budgetDetails?.status === "Over Limit" ? (
                  <MehOutlined
                    className={TransactionDetailsCss.totalCounterIconStyle}
                    id={TransactionDetailsCss.expenseIcon}
                  />
                ) : (
                  <SmileOutlined
                    className={TransactionDetailsCss.totalCounterIconStyle}
                    id={TransactionDetailsCss.underLimitIcon}
                  />
                )}
              </Col>
              <Col span={12}>
                <span className={TransactionDetailsCss.totalCounterTitle}>
                  Status
                </span>{" "}
                <br />{" "}
                <span className={TransactionDetailsCss.totalCounterValue}>
                  {budgetDetails?.status}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Space>
          <Select value={type} onChange={handleSetType}>
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
            <Option value="custom">Custom</Option>
          </Select>
          {type === "custom" ? (
            <RangePicker
              defaultValue={[
                moment(new Date(), "DD/MM/YYYY"),
                moment(new Date(), "DD/MM/YYYY"),
              ]}
              value={[
                moment(value[0], "DD/MM/YYYY"),
                moment(value[1], "DD/MM/YYYY"),
              ]}
              format="DD/MM/YYYY"
              onChange={onChange}
              allowClear={false}
            />
          ) : type === "month" ? (
            <DatePicker
              picker="month"
              defaultValue={moment(new Date(), "YYYY-MM")}
              value={moment(value, "YYYY-MM")}
              onChange={onChange}
              format={"YYYY-MM"}
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

        {/* budgetdetails */}
        <Row
          style={{
            padding: "20px 0px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* add budget */}
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <AddBudgetForm
              reducer={budgetDetails}
              addBudgetForm={addBudgetForm}
              setAddBudgetForm={setAddBudgetForm}
              AddBudgetFormErrors={AddBudgetFormErrors}
              setAddBudgetFormErrors={setAddBudgetFormErrors}
            />
          </Col>
          {/* display budget */}
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 15 }}
            lg={{ span: 15 }}
            className={BudgetDtailsCss.budgetTableContainer}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <BudgetTable loading={loading} setLoading={setLoading} />
          </Col>
        </Row>
      </div>
    </>
  );
};
export default BudgetDetails;
