import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  notification,
  Popconfirm,
  Alert,
  Input,
  DatePicker,
  Select,
  Switch,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddBillFormCss from "../../css/AddBillForm.module.css";
import "../../css/AddBillFormOverride.css";
import TextArea from "antd/lib/input/TextArea";
import { CloseSquareFilled, CheckSquareFilled } from "@ant-design/icons";
import { AddBillFormDetails, UpdateForm } from "../../apis/BillManagementAPI";
import moment from "moment";
import { AddBillFormValidate } from "../../utils/Validation";
import { resetEditState } from "../../actions/BillManagementAction";
import { BILL_CATEGORY } from "../../utils/Constants";
const { Option } = Select;

const AddBillForm = ({
  addBillForm,
  setAddBillForm,
  AddBillFormErrors,
  setAddBillFormErrors,
  reducer,
  setModal,
}) => {
  const billReducer = useSelector(state => state.BillReducer);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const isEdit = billReducer.isEdit;
  const handleAddBillFormChange = e => {
    const { name, value } = e.target;
    setAddBillForm({ ...addBillForm, [name]: value });
    setAddBillFormErrors({ ...AddBillFormErrors, [name]: "" });
  };

  const handleReset = () => {
    isEdit
      ? setAddBillForm({
          ...billReducer.editData,
        })
      : setAddBillForm({
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
    setAddBillFormErrors({});
  };
  const categoryList = BILL_CATEGORY;

  const handleCategoryChange = value => {
    setAddBillForm({ ...addBillForm, category: value });
    setAddBillFormErrors({ ...AddBillFormErrors, category: "" });
  };
  const handleis_recurring = value => {
    if (value) {
      setAddBillForm({
        ...addBillForm,
        is_recurring: value ? 1 : 0,
        recurring_type: "month",
        recurring_type_value: "",
      });
    } else {
      setAddBillForm({
        ...addBillForm,
        is_recurring: value ? 1 : 0,
        recurring_type: "",
        recurring_type_value: "",
      });
    }
    setAddBillFormErrors({ ...AddBillFormErrors, is_recurring: "" });
  };
  const handlestatus = value => {
    setAddBillForm({ ...addBillForm, status: value });
    setAddBillFormErrors({ ...AddBillFormErrors, status: "" });
  };
  const handlerecurring_type = value => {
    setAddBillForm({ ...addBillForm, recurring_type: value });
    setAddBillFormErrors({
      ...AddBillFormErrors,
      recurring_type: "",
      recurring_type_value: "",
    });
  };
  const handleSave = async () => {
    setLoading(true);
    await AddBillFormValidate(addBillForm, AddBillFormErrors)
      .then(async () => {
        setAddBillFormErrors({});
        isEdit
          ? await UpdateForm(reducer, addBillForm, dispatch)
              .then(response => {
                notification.success({
                  message: "Bill Successfully Updated",
                });
                handleReset();
                dispatch(resetEditState());
                setModal(false);
              })
              .catch(err => {
                notification.error({
                  message: "Failed to Update Bill",
                  description: err,
                  duration: 8,
                });
              })
          : await AddBillFormDetails(reducer, addBillForm, dispatch)
              .then(response => {
                notification.success({
                  message: "Bill Successfully Created",
                });
                handleReset();
              })
              .catch(err => {
                notification.error({
                  message: "Failed to Create Bill",
                  description: err,
                  duration: 8,
                });
              });
      })
      .catch(err => {
        setAddBillFormErrors({ ...err });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChange = (value, dateString) => {
    setAddBillForm({
      ...addBillForm,
      due_date: dateString,
    });
    setAddBillFormErrors({ ...AddBillFormErrors, due_date: "" });
  };
  useEffect(() => {
    isEdit && setAddBillForm(billReducer.editData);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className={AddBillFormCss.addBillForm}>
        <Card
          title={!isEdit && <div style={{ textAlign: "center" }}>Add Bill</div>}
          bordered={false}
          className={AddBillFormCss.addBillFormCard}
        >
          <>
            <div className={AddBillFormCss.formLabel}>
              Description: <span className={AddBillFormCss.mandatory}>*</span>
            </div>
            <Input
              className={AddBillFormCss.addBillFormInput}
              placeholder="Enter Description"
              name="description"
              onChange={handleAddBillFormChange}
              value={addBillForm?.description}
            />
            {AddBillFormErrors?.description && (
              <Alert
                className={`${AddBillFormCss.errorAlert}`}
                message={AddBillFormErrors.description}
                type="error"
                showIcon
              />
            )}
            <div className={AddBillFormCss.formLabel}>
              Amount: <span className={AddBillFormCss.mandatory}>*</span>
            </div>
            <Input
              className={AddBillFormCss.addBillFormInput}
              placeholder="Enter Amount(in Rs.)"
              name="amount"
              type="number"
              onChange={handleAddBillFormChange}
              value={addBillForm?.amount}
            />
            {AddBillFormErrors?.amount && (
              <Alert
                className={`${AddBillFormCss.errorAlert}`}
                message={AddBillFormErrors.amount}
                type="error"
                showIcon
              />
            )}
            <div className={AddBillFormCss.formLabel}>
              Billing Date: <span className={AddBillFormCss.mandatory}>*</span>
            </div>
            <DatePicker
              className={AddBillFormCss.addBillFormInput}
              placeholder="Enter Date"
              onChange={onChange}
              value={
                addBillForm?.due_date &&
                moment(addBillForm?.due_date, "DD/MM/YYYY")
              }
              name="due_date"
              picker="date"
              format="DD/MM/YYYY"
              disabled={isEdit}
            />
            {AddBillFormErrors?.due_date && (
              <Alert
                className={`${AddBillFormCss.errorAlert}`}
                message={AddBillFormErrors.due_date}
                type="error"
                showIcon
              />
            )}
            <div className={AddBillFormCss.formLabel}>
              Category: <span className={AddBillFormCss.mandatory}>*</span>
            </div>
            <Select
              showSearch
              onChange={handleCategoryChange}
              value={addBillForm?.category}
              name="category"
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.name.includes(input.toLowerCase())
              }
              options={categoryList}
            ></Select>
            {AddBillFormErrors?.category && (
              <Alert
                className={`${AddBillFormCss.errorAlert}`}
                message={AddBillFormErrors.category}
                type="error"
                showIcon
              />
            )}
            {addBillForm?.category === "Other" && (
              <>
                <Input
                  className={AddBillFormCss.addBillFormInput}
                  placeholder="Enter Category"
                  name="category_others"
                  onChange={handleAddBillFormChange}
                  value={addBillForm?.category_others}
                />
                {AddBillFormErrors?.category_others && (
                  <Alert
                    className={`${AddBillFormCss.errorAlert}`}
                    message={AddBillFormErrors.category_others}
                    type="error"
                    showIcon
                  />
                )}
              </>
            )}
            {/* is_recurring */}
            <div className={AddBillFormCss.formLabel}>
              Is Recurring? &nbsp;{" "}
              <Switch
                size="small"
                checked={addBillForm?.is_recurring === 1 ? true : false}
                onClick={handleis_recurring}
                disabled={isEdit}
              />
            </div>

            {addBillForm?.is_recurring === 1 && (
              <>
                {/* recurring_type */}
                <div className={AddBillFormCss.formLabel}>Recurring Type:</div>
                <Select
                  value={addBillForm?.recurring_type}
                  onChange={handlerecurring_type}
                  style={{ marginTop: "5px" }}
                  disabled={isEdit}
                >
                  <Option value="month">Month</Option>
                  <Option value="year">Year</Option>
                  <Option value="days">Days</Option>
                </Select>
                {/* recurring_type_value */}
                <div className={AddBillFormCss.formLabel}>
                  Recurring Period:{" "}
                  <span className={AddBillFormCss.mandatory}>*</span>
                </div>
                <Input
                  className={AddBillFormCss.addBillFormInput}
                  placeholder={`Enter number of ${addBillForm?.recurring_type}`}
                  name="recurring_type_value"
                  type="number"
                  onChange={handleAddBillFormChange}
                  value={addBillForm?.recurring_type_value}
                  disabled={isEdit}
                />
                {AddBillFormErrors?.recurring_type_value && (
                  <Alert
                    className={`${AddBillFormCss.errorAlert}`}
                    message={AddBillFormErrors.recurring_type_value}
                    type="error"
                    showIcon
                  />
                )}
              </>
            )}
            <div className={AddBillFormCss.formLabel}>Payment Status:</div>
            <Select
              value={addBillForm?.status}
              onChange={handlestatus}
              style={{ marginTop: "5px" }}
              name="status"
              disabled={isEdit}
            >
              <Option value="Paid">Paid</Option>
              <Option value="Not Paid">Not Paid</Option>
            </Select>
            <div className={AddBillFormCss.formLabel}>Remarks: </div>
            <TextArea
              bordered={true}
              style={{ marginBottom: "25px", marginTop: "10px" }}
              placeholder="Enter Remarks"
              onChange={handleAddBillFormChange}
              value={addBillForm?.remarks}
              name="remarks"
              showCount
              maxLength={75}
              autoSize={{ minRows: 2, maxRows: 4 }}
              allowClear
            />
            <>
              <Popconfirm
                title={`Are you sure you want to ${
                  isEdit ? "Edit" : "Add"
                } Bill?`}
                onConfirm={handleSave}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className={AddBillFormCss.saveButton}
                  type="primary"
                  icon={<CheckSquareFilled />}
                  loading={loading}
                >
                  {loading ? (
                    <>Saving ...</>
                  ) : (
                    <>{`${isEdit ? "Edit" : "Add"}`} Bill</>
                  )}
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Are you sure you want to Reset?"
                onConfirm={handleReset}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className={AddBillFormCss.resetButton}
                  type="danger"
                  icon={<CloseSquareFilled />}
                >
                  Reset
                </Button>
              </Popconfirm>
            </>
          </>
        </Card>
      </div>
    </>
  );
};
export default AddBillForm;
