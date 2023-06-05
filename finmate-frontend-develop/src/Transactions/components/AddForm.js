import React, { useState, useEffect } from "react";
import {
  Col,
  Card,
  Button,
  notification,
  Popconfirm,
  Select,
  Alert,
  Input,
  DatePicker,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddFormCss from "../css/AddForm.module.css";
import "../css/AddFormOverride.css";
import TextArea from "antd/lib/input/TextArea";
import { CloseSquareFilled, CheckSquareFilled } from "@ant-design/icons";
import {
  
  UpdateForm,
} from "../apis/TransactionManagementAPI";
import moment from "moment";
import { AddFormValidate } from "../utils/Validation";
import {
  INCOME_CATEGORY,
  EXPENSE_CATEGORY,
  SAVINGS_CATEGORY,
} from "../../common/utils/Constants";
import {resetEditState} from "../actions/TransactionManagementAction";
const { Option } = Select;

const AddForm = ({ addForm, setAddForm, AddFormErrors, setAddFormErrors,setModal }) => {
  // set addFormData from reducer
  
  // const userDetails = useSelector(state => state.UserReducer.userDetails);
  const transactionReducer = useSelector(state => state.TransactionReducer);
  console.log("Common reducer", transactionReducer.editData, transactionReducer.isEdit)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const [AddFormErrors, setAddFormErrors] = useState({});
    const categoryList = transactionReducer?.editData?.type==="Income"?INCOME_CATEGORY:transactionReducer?.editData?.type==="Expense"?EXPENSE_CATEGORY:SAVINGS_CATEGORY;
  // const [addForm,setAddForm] = useState(commonReducer.isEdit?commonReducer.editData:{
  //   type:formType,
  //   description:"",
  //   amount:"",
  //   date:"",
  //   category:"",
  //   category_others:"",
  //   remarks:"",});
    const isEdit= transactionReducer.isEdit;
    const handleAddFormChange = e => {
        const { name, value } = e.target;
        setAddForm({ ...addForm, [name]: value});
        setAddFormErrors({ ...AddFormErrors, [name]: "" });
    };

  const handleReset = () => {
    setAddForm({
        type:transactionReducer?.editData?.type,
        description:"",
        amount:"",
        date:"",
        category:"",
        category_others:"",
        remarks:"",});
    setAddFormErrors({});
  };
  // const UserReducer = useSelector(state => state.UserReducer);
  const handleSave = async () => {
    setLoading(true);
    // setAddForm({ ...addForm, type: formType});
    console.log(JSON.stringify(addForm));
    await AddFormValidate(addForm, AddFormErrors)
      .then(async () => {
        setAddFormErrors({});
        // isEdit&&setModal(false);
        isEdit&&
        await UpdateForm(transactionReducer,transactionReducer.editData, addForm,transactionReducer?.editData?.type,dispatch)
          .then(response => {
            notification.success({
              message: "Successfully Updated "+transactionReducer?.editData?.type,
            });
            handleReset();
            dispatch(resetEditState());
            setModal(false);
          })
          .catch(err => {
            notification.error({
              message: "Failed to Update "+transactionReducer?.editData?.type,
              description: err,
              duration: 8,
            });
          })
        //   :
        // await AddFormDetails(reducer,addForm,formType,dispatch)
        //   .then(response => {
        //     notification.success({
        //       message: "Successfully Created "+formType,
        //     });
        //     handleReset();
        //   })
        //   .catch(err => {
        //     notification.error({
        //       message: "Failed to Create "+formType,
        //       description: err,
        //       duration: 8,
        //     });
        //   });
      })
      .catch(err => {
        setAddFormErrors({ ...err });
      }).finally(()=>{
        console.log(JSON.stringify(AddFormErrors));
        setLoading(false);
      });
    
    
  };
const handleCategoryChange = value => {
    setAddForm({...addForm, category:value});
    setAddFormErrors({...AddFormErrors, category:""});
};
const handleDateChange = (date, dateString) => {
    console.log(date, dateString)
    setAddForm({...addForm, date:dateString});
    setAddFormErrors({...AddFormErrors, date:""});
  };
  useEffect(() => {
    setAddForm(transactionReducer.editData);
    // loadRequestTypeList();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className={AddFormCss.requestForm}>
          <Card title={!isEdit&&<div style={{textAlign: "center"}}>Add {`${transactionReducer?.editData?.type}`}</div>} bordered={false} style={{borderRadius: "20px", backgroundColor: "transparent", width: "100%"}}>
            <>
              <div className={AddFormCss.formLabel}>Description: <span style={{color: "red"}}>*</span></div>
              <Input 
                style={{
                  width: "100%",
                  maxHeight: 100,
                  overflow: "auto",
                  marginTop: "10px",
                  borderRadius: "20px"
                }}
                placeholder="Enter Description"
                name="description"
                onChange={handleAddFormChange} 
                value={addForm?.description}
                />
                {AddFormErrors?.description && (
                    <Alert
                    style={{marginTop: "2px", borderRadius: "10px"}}
                    className={`${AddFormCss.errorRequestTypeAlert}`}
                    message={AddFormErrors.description}
                    type="error"
                    showIcon
                    />
                )}
                <div className={AddFormCss.formLabel}>Amount: <span style={{color: "red"}}>*</span></div>
              <Input 
                style={{
                  width: "100%",
                  maxHeight: 100,
                  overflow: "auto",
                  marginTop: "10px",
                  borderRadius: "20px"
                }}
                placeholder="Enter Amount(in Rs.)"
                name="amount"
                type="number"
                onChange={handleAddFormChange} 
                value={addForm?.amount} 
                />
                {AddFormErrors?.amount && (
                    <Alert
                    style={{marginTop: "2px", borderRadius: "10px"}}
                    className={`${AddFormCss.errorRequestTypeAlert}`}
                    message={AddFormErrors.amount}
                    type="error"
                    showIcon
                    />
                )}
              <div className={AddFormCss.formLabel}>Date: <span style={{color: "red"}}>*</span></div>
              <DatePicker 
                style={{
                  width: "100%",
                  maxHeight: 100,
                  overflow: "auto",
                  marginTop: "10px",
                  borderRadius: "20px"
                }}
                placeholder="Enter Date"
                onChange={handleDateChange}
                value={addForm?.date&&moment(addForm?.date,'DD/MM/YYYY')} 
                name="date"
                picker="date"
                format='DD/MM/YYYY'
                // defaultValue={moment()}
                disabledDate={current => {
                  return current && current > moment().endOf("day");
                }}
                />
              {AddFormErrors?.date && (
                <Alert
                    style={{marginTop: "2px", borderRadius: "10px"}}
                  className={`${AddFormCss.errorRequestTypeAlert}`}
                  message={AddFormErrors.date}
                  type="error"
                  showIcon
                />
              )}
              <div className={AddFormCss.formLabel}>Category: <span style={{color: "red"}}>*</span></div>
              <Select
                showSearch
                onChange={handleCategoryChange} 
                value={addForm?.category}
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
              >
              </Select>
              {AddFormErrors?.category && (
                <Alert
                style={{marginTop: "2px", borderRadius: "10px"}}
                  className={`${AddFormCss.errorAlert}`}
                  message={AddFormErrors.category}
                  type="error"
                  showIcon
                />
              )}
              {addForm?.category === "Other" && (<>
              <Input 
                style={{
                  width: "100%",
                  maxHeight: 100,
                  overflow: "auto",
                  marginTop: "10px",
                  borderRadius: "20px"
                }}
                placeholder="Enter Category"
                name="category_others"
                onChange={handleAddFormChange} 
                value={addForm?.category_others}
                />
                {AddFormErrors?.category_others && (
                    <Alert
                    style={{marginTop: "2px", borderRadius: "10px"}}
                    className={`${AddFormCss.errorRequestTypeAlert}`}
                    message={AddFormErrors.category_others}
                    type="error"
                    showIcon
                    />
                )}</>)}
              <div className={AddFormCss.formLabel}>Remarks: </div>
              <TextArea
                bordered={true}
                style={{ marginBottom: "25px", marginTop: "10px" }}
                placeholder="Enter Remarks"
                onChange={handleAddFormChange} 
                value={addForm?.remarks}
                name="remarks"
                showCount
                maxLength={75}
                autoSize={{ minRows: 2, maxRows: 4 }}
                allowClear
              />
              <>
                <Popconfirm
                  title="Are you sure you want to Create Request?"
                  onConfirm={handleSave}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                  style={{ borderRadius: "20px",opacity:0.8,backdropFilter: "blur(10px)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)"}}
                    type="primary"
                    icon={<CheckSquareFilled />}
                    loading={loading}
                  >
                    {loading ? <>Saving ...</> : <>{`${isEdit?'Edit':'Add'}`} {`${transactionReducer?.editData?.type}`}</>}
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Are you sure you want to Reset?"
                  onConfirm={handleReset}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    style={{ margin: "5px", borderRadius: "20px",opacity:0.8,backdropFilter: "blur(10px)",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)"}}
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
export default AddForm;
