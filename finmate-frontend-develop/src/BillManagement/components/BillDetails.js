import React, { useState, useEffect } from "react";
import { getBillDetails } from "../apis/BillManagementAPI";
import { useDispatch, useSelector } from "react-redux";
import { notification, Row, Col } from "antd";
import AddBillForm from "./Bill/AddBillForm";
import BillTable from "./Bill/BillTable";
import BillDtailsCss from "../css/BillDetails.module.css";
import { resetBillState } from "../actions/BillManagementAction";

const BillDetails = () => {
  const [selected, setSelected] = useState("Active Bills");
  const handleSelected = index => {
    setSelected(index);
    loadBillDetails(index);
  };
  const [addBillForm, setAddBillForm] = useState({
    description: "",
    amount: "",
    due_date: "",
    category: "",
    category_others: "",
    remarks: "",
    is_recurring: 0,
    recurring_type: "",
    recurring_type_value: "",
    status: "Not Paid",
  });
  const [AddBillFormErrors, setAddBillFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const billDetails = useSelector(state => state.BillReducer);

  const dispatch = useDispatch();
  const loadBillDetails = async selected => {
    setLoading(true);
    try {
      await getBillDetails(selected, dispatch);
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
    loadBillDetails(selected);
    return () => {
      dispatch(resetBillState());
    };
    // eslint-disable-next-line
  }, [selected]);
  return (
    <>
      <div>
        {/* billdetails */}
        <Row
          style={{
            padding: "20px 0px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* add bill */}
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
            <AddBillForm
              reducer={billDetails}
              addBillForm={addBillForm}
              setAddBillForm={setAddBillForm}
              AddBillFormErrors={AddBillFormErrors}
              setAddBillFormErrors={setAddBillFormErrors}
            />
          </Col>
          {/* display bill */}
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 15 }}
            lg={{ span: 15 }}
            className={BillDtailsCss.billTableContainer}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <BillTable
              loading={loading}
              setLoading={setLoading}
              selected={selected}
              handleSelected={handleSelected}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
export default BillDetails;
