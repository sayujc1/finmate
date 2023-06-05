import React, { useState } from "react";
import { Space, Table,Popconfirm,notification,Modal,Tag } from 'antd';
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import AddForm from "./AddForm";
import { useDispatch,useSelector } from "react-redux";
import {deleteTransaction} from "../apis/TransactionManagementAPI";
import {setEditDetails,resetEditState} from "../actions/TransactionManagementAction";

import "../css/EditModalOverride.css";

const TransactionsTable = ({loading,setLoading}) => {
  const [addForm,setAddForm] = useState({});
  const [AddFormErrors,setAddFormErrors] = useState({});
  const transactionDetails = useSelector(state => state.TransactionReducer);
  const dispatch = useDispatch();
  const [modal1Open, setModalOpen] = useState(false);
  const [isEditData, setIsEditData] = useState({});
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
      filterSearch: true,
      filters:
        transactionDetails?.transactionDetails.length>0&&transactionDetails?.transactionDetails.map(d=>d.description).filter((item,
          index) => transactionDetails?.transactionDetails.map(d=>d.description).indexOf(item) === index).map(element => {
          return { text: element, value: element };
        }),
      onFilter: (value, record) => record.description.startsWith(value),
    },
    {
      title: "Category",
      key: "category",
      render: (record) => (
        <>{record.category==="Other"?record.category_others:record.category}</>
      ),
      filterSearch: true,
      filters:
      transactionDetails?.transactionDetails.length>0&&transactionDetails?.transactionDetails.map(d=>d.category).filter((item,
          index) => transactionDetails?.transactionDetails.map(d=>d.category).indexOf(item) === index).map(element => {
          return { text: element, value: element };
        }),
      onFilter: (value, record) => record.category.startsWith(value),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: type => (
          <>
              {type === 'Income' ? (
                  <Tag color="green" key={type}>
                      {type}
                  </Tag>
              ) : type==='Expense' ? (
                <Tag color="red" key={type}>
                    {type}
                </Tag>
            ) : (<Tag color="blue" key={type}>
            {type}
        </Tag>
    )}
          </>
      ),
      filterSearch: true,
      filters:
        ['Income','Expense','Saving'].map(element => {
          return { text: element, value: element };
        }),
      onFilter: (value, record) => record.type.startsWith(value),
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
      setAddForm(record)
      dispatch(setEditDetails(record));
      setModalOpen(true);
    };
    const handleDelete = async (record) => {
      //update reducer state - deletion
      setLoading(true);
    try{
      await deleteTransaction(transactionDetails,record,dispatch)
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
    return (
      <>
      <Modal
        title="Edit Transaction"
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
        <AddForm  setModal={setModalOpen} addForm={addForm} setAddForm={setAddForm} AddFormErrors={AddFormErrors} setAddFormErrors={setAddFormErrors}/>
        {/* <AddForm addFormData={isEditData} formType={isEditData?.type} setModal={setModalOpen}/> */}
      </Modal>
      <Table bordered={true} columns={columns} dataSource={transactionDetails?.transactionDetails} style={{margin: "20px"}} loading={loading}/>
      </>
    )
  };
  export default TransactionsTable;
