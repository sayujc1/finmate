import React, { useState,useEffect } from "react";
import { Space, Table, Popconfirm,notification,Modal } from "antd";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import AddForm from "../../../common/components/AddForm";
import "../../css/EditModalOverride.css";
import { useDispatch,useSelector } from "react-redux";
import {deleteIncomeTransaction} from "../../apis/IncomeManagementAPI";
// import {setEditDetails,resetEditState} from "../../actions/IncomeManagementAction";
import {setEditDetails,resetEditState} from "../../../common/actions/CommonAction";
import EditForm from "./EditForm";

const IncomeTable = ({loading,setLoading}) => {
  const [modal1Open, setModalOpen] = useState(false);
  // const [isEditData, setIsEditData] = useState({});
  const [addForm,setAddForm] = useState({});
  const [AddFormErrors,setAddFormErrors] = useState({});
  const dispatch = useDispatch();

  const columns = [
    {
      title: "",
      key: "t_id",
      render: (record) => (
        <Space
          size="middle"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <EditFilled style={{ color: "#1890ff", cursor: "pointer" }} onClick={()=>handleEdit(record)}/>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      key: "category",
      render: (record) => (
        <>{record.category==="Other"?record.category_others:record.category}</>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
    },
    {
      title: "Remarks",
      key: "remarks",
      dataIndex: "remarks",
    },
    {
      title: "",
      key: "t_id",
      render: (record) => (
        <Space
          size="middle"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Popconfirm
            title="Are you sure you want to Delete?"
            onConfirm={() => {
              handleDelete(record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteFilled
              style={{ color: "#ff4d4f", cursor: "pointer" }}
            ></DeleteFilled>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleEdit = (record) => {
    console.log(record);
    // populate add form reducer state - editing
    // setIsEditData(record);
    setAddForm(record)
    dispatch(setEditDetails(record));
    setModalOpen(true);
  };
  const handleDelete = async (record) => {
    setLoading(true);
    try{
      await deleteIncomeTransaction(incomeDetails,record,dispatch)
    }catch(error){
      notification.error({
        message: "Error",
        description: error?error.message:"Something went wrong.",
      });
    }
    finally{
    setLoading(false);
    }
    // console.log(data);

    notification.success({
      message: "Deleted Successfully",
    });
  };
  const incomeDetails = useSelector(state => state.IncomeReducer);
    


  return (
    <>
  <Modal
        title="Edit Income"
        style={{
          top: 20,
        }}
        open={modal1Open}
        onCancel={() => setModalOpen(false)}
        // visible={modal1Open}
        footer={null}
        maskClosable={false}
        afterClose={() => {
          dispatch(resetEditState());
          setAddForm({});
        }}
      >
        <AddForm reducer={incomeDetails}  formType={'Income'} setModal={setModalOpen} addForm={addForm} setAddForm={setAddForm} AddFormErrors={AddFormErrors} setAddFormErrors={setAddFormErrors}/>
      </Modal>
      <Table
    loading={loading}
    bordered={true}
    columns={columns}
    dataSource={incomeDetails?.incomeTransactions}
    style={{ margin: "20px" }}
    />
  </>);
};
export default IncomeTable;
