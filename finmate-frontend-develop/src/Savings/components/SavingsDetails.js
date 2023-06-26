import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, notification, Row, Col } from "antd";
import moment from "moment";
import AddForm from "../../common/components/AddForm";
import SavingsTable from "./Savings/SavingsTable";
import { loadSavingTransactionsDetails } from "../apis/SavingManagementAPI";
import SavingsDtailsCss from "../css/SavingsDetails.module.css";

const SavingsDetails = () => {
  const [addForm, setAddForm] = useState({
    type: "Saving",
    description: "",
    amount: "",
    date: "",
    category: "",
    category_others: "",
    remarks: "",
  });
  const [AddFormErrors, setAddFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
  );
  const handleMonth = (date, dateString) => {
    let month = dateString;

    // if clear the date
    if (dateString === "") {
      month = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    }
    setMonth(month);
    loadSavingDetails(month);
  };
  const dispatch = useDispatch();
  const savingDetails = useSelector(state => state.SavingReducer);
  const loadSavingDetails = async monthData => {
    setLoading(true);
    try {
      await loadSavingTransactionsDetails("Saving", monthData, dispatch);
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
    loadSavingDetails(month);

    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div>
        <Row
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          <Col
            span={24}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "20px",
              padding: "10px",
              margin: "6px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "1.4rem", fontWeight: 500 }}>
              Total Savings&nbsp;:&nbsp;
            </span>{" "}
            <span
              style={{ fontSize: "1.4rem", fontWeight: 500, color: "green" }}
            >
              Rs. {savingDetails.totalSaving}
            </span>
          </Col>
        </Row>
        <div style={{ position: "sticky", left: 0, margin: "5px 0px 0px 0px" }}>
          Month:{" "}
          <DatePicker
            onChange={handleMonth}
            picker="month"
            value={
              month
                ? moment(month, "YYYY-MM")
                : moment(
                    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
                    "YYYY-MM"
                  )
            }
          />
        </div>

        {/* Savingsdetails */}
        <Row
          style={{
            padding: "20px 0px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* add Savings */}
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
            <AddForm
              reducer={savingDetails}
              formType={"Saving"}
              addForm={addForm}
              setAddForm={setAddForm}
              AddFormErrors={AddFormErrors}
              setAddFormErrors={setAddFormErrors}
            />
          </Col>
          {/* display Savings */}
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 15 }}
            lg={{ span: 15 }}
            className={SavingsDtailsCss.savingsTableContainer}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <SavingsTable loading={loading} setLoading={setLoading} />
          </Col>
        </Row>
      </div>
    </>
  );
};
export default SavingsDetails;
