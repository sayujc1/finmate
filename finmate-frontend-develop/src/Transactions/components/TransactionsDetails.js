import React, { useState, useEffect } from "react";
import { DatePicker, Select, Space, notification } from "antd";
import { resetTransactionState } from "../actions/TransactionManagementAction";
import { getTransactionDetails } from "../apis/TransactionManagementAPI";
import { useDispatch, useSelector } from "react-redux";
import TransactionsTable from "./TransactionsTable";
import moment from "moment";
import TotalCounterCards from "../../common/components/TotalCounterCards";

const { Option } = Select;
const { RangePicker } = DatePicker;

const TransactionsDetails = () => {
  //value is current date in YYYY-MM format
  const dispatch = useDispatch();

  const transactionDetails = useSelector(state => state.TransactionReducer);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState(`${moment().format("YYYY-MM")}`);
  const [type, setType] = useState("month");
  const onChange = (value, dateString) => {
    setValue(dateString);
    loadTransactionDetails(type, dateString);
  };
  const handleSetType = type => {
    let value = "";
    setType(type);
    if (type === "date") {
      value = moment().format("DD/MM/YYYY");
    } else if (type === "week") {
      value = moment().format("YYYY-WW");
    } else if (type === "year") {
      value = moment().format("YYYY");
    } else if (type === "quarter") {
      value = moment().format("YYYY-[Q]Q");
    } else if (type === "month") {
      value = moment().format("YYYY-MM");
    } else {
      value = [moment().format("DD/MM/YYYY"), moment().format("DD/MM/YYYY")];
    }
    setValue(value);
    loadTransactionDetails(type, value);
  };

  const loadTransactionDetails = async (type, value) => {
    setLoading(true);
    try {
      type === "custom"
        ? await getTransactionDetails(type, value[0], value[1], dispatch)
        : await getTransactionDetails(type, value, null, dispatch);
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
    loadTransactionDetails(type, value);
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
        {type === "date" ? (
          <DatePicker
            defaultValue={moment(new Date(), "DD/MM/YYYY")}
            value={moment(value, "DD/MM/YYYY")}
            onChange={onChange}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        ) : type === "custom" ? (
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
        ) : type === "week" ? (
          <DatePicker
            picker="week"
            defaultValue={moment(new Date(), "YYYY-WW")}
            value={moment(value, "YYYY-WW")}
            onChange={onChange}
            format="YYYY-WW"
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
      <TotalCounterCards counterDetails={transactionDetails} />
      <TransactionsTable loading={loading} setLoading={setLoading} />
    </>
  );
};
export default TransactionsDetails;
