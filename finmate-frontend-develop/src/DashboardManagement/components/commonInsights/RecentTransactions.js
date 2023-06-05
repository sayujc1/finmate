import React,{useEffect} from "react";
import { Table, Tag, notification } from 'antd';
import moment from "moment";
import {loadRecentTransactionsDetails} from "../../apis/DashboardManagementAPI";
import { useDispatch,useSelector } from "react-redux";

  const RecentTransactions = () => {
    const [recentloading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const columns = [
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
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
        },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
       
      },
      {
        title: 'Remarks',
        key: 'remarks',
        dataIndex: 'remarks',
       
      },
    ];
    const dashboardDetails = useSelector(state => state.DashboardReducer);
    const loadTransactionsDetails = async () => {
      setLoading(true);
      try{
        await loadRecentTransactionsDetails(10, dispatch)
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
      console.log("loadTransactionsDetails", dashboardDetails.recentTransactions)
      loadTransactionsDetails();
      console.log("loadTransactionsDetails", dashboardDetails.recentTransactions)

      // eslint-disable-next-line
    }, []);
    console.log("loadTransactionsDetails", dashboardDetails.recentTransactions)
  return(
    <Table bordered={true} columns={columns} dataSource={dashboardDetails.recentTransactions} loading={recentloading}/>
  )};
  export default RecentTransactions;
