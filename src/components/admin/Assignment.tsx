import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';
import { Divider, Table, Select } from 'antd';

import Spinner from '../../components/layout/Spinner';
import type { TableRowSelection } from 'antd/es/table/interface';
interface Assignment {
  key: string;
  video_title: string;
  video_link: string;
  video_owner_handle: string;
  video_curator: string;
}

interface CuratorList {
  handle?: String;
}

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const data: DataType[] = [];
const columns: ColumnsType<Assignment> = [
  {
    title: 'key',
    dataIndex: 'key',
  },
  {
    title: 'video_title',
    dataIndex: 'video_title',
  },
  {
    title: 'video_link',
    dataIndex: 'video_link',
  },
  {
    title: 'video_owner_handle',
    dataIndex: 'video_owner_handle',
  },
  {
    title: 'video_curator',
    dataIndex: 'video_curator',
  },
];

const Assignment = () => {
  const [assignment, setAssignment] = useState<Assignment[]>();
  const [curatorList, setCuratorList] = useState<CuratorList[]>();
  const [selectList, setSelectList] = useState<Assignment[]>();
  const [curator, setCurator] = useState<CuratorList>();
  const [msg, setMsg] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  useEffect(() => {
    getUnCheckedList();
    getCuratorList();
  }, [msg]);

  async function getUnCheckedList() {
    try {
      const response = await axios.get('http://localhost:5000/api/leader/assignment', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const assignmentList = response.data;
      setAssignment(assignmentList);
      // Do something with the user data
    } catch (error) {
      console.log(error, 'Fetch UnCheckedList Error');
    }
  }

  async function getCuratorList() {
    try {
      const response = await axios.get('http://localhost:5000/api/leader/curator-list', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const curatorListTmp = response.data;
      setCuratorList(curatorListTmp);
    } catch (error) {
      console.log(error, 'Fetch CuratorList Error');
    }
  }

  // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  //   console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };

  const onChange = (value: CuratorList) => {
    console.log(`selected ${value}`);
    setCurator(value);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Assignment> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  // const rowSelection = {
  //   onChange: (selectedRowKeys: React.Key[], selectedRows: Assignment[]) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //     setSelectedRowKeys([]);
  //     setSelectList(selectedRows);
  //   },
  // };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (selectList !== undefined && curator !== undefined && selectList.length > 0 && curator)
      sendVideoList(selectList, curator);
  };

  async function sendVideoList(selectList: Assignment[], curator: CuratorList) {
    try {
      let data = { selectList, curator };
      const response = await axios.post('http://localhost:5000/api/leader/assignment/send-video-list', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const sendVideoListResponse = response.data;
      setMsg(sendVideoListResponse.Success);
    } catch (error) {
      console.log(error, 'Fetch CuratorList Error');
    }
  }

  return (
    <section className="container">
      {assignment == undefined || assignment.length < 1 || curatorList === undefined ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Assignment</h1>
          <form className="form" onSubmit={onSubmit}>
            <Divider />

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={assignment}
            />

            <Select
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={onChange}
              options={curatorList.map((item: CuratorList) => {
                return { value: item.handle, label: item.handle };
              })}
            />

            <input type="submit" className="btn btn-primary" value="Send" />
          </form>
        </Fragment>
      )}
    </section>
  );
};

export default Assignment;