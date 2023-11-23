import type { DatePickerProps } from 'antd';
import { DatePicker, Divider, Switch, Select, Table, Tag, Radio, Col, Row, Button,Checkbox } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RadioChangeEvent } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { DownloadOutlined } from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVideoCounts, useVideos } from '@/hooks';
import { connect, ConnectedProps } from 'react-redux';
import moment from 'moment';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

import { getVideoListRange, setDate, getCuratorList, setFilter, sendVideoList } from '../../actions/admin';
import Spinner from '../../components/layout/Spinner';
const { RangePicker } = DatePicker;
interface Assignment {
  key: string;
  video_title: string;
  video_channel_title: string;
  video_owner_handle: string;
  video_curator: string;
  video_createdAt: Date;
  video_checkedAt: Date;
  video_yt_id: string;
  video_nft_id: string;
  video_check_tag: string;
  video_check_flag: boolean;
  video_check_description: string;
  video_category: string;
  video_play: string;
  video_duplicate: string;
}

interface CuratorList {
  handle?: string;
}

const columns: ColumnsType<Assignment> = [
  {
    title: 'ID',
    dataIndex: 'key',
  },
  {
    title: 'TITLE',
    dataIndex: 'video_title',
  },
  {
    title: 'CHANNEL NAME',
    dataIndex: 'video_channel_title',
  },
  {
    title: 'OWNER',
    dataIndex: 'video_owner_handle',
  },
  {
    title: 'UPLOAD TIME',
    dataIndex: 'video_createdAt',
  },
  {
    title: 'YPP',
    dataIndex: 'video_yt_id',
  },
  {
    title: 'NFT',
    dataIndex: 'video_nft_id',
  },
  {
    title: 'CURATOR',
    dataIndex: 'video_curator',
  },
  {
    title: 'ENTITY PALYS',
    dataIndex: 'video_play',
  },
  {
    title: 'CATEGORY',
    dataIndex: 'video_category',
  },
  {
    title: 'TOXIC CONTENT',
    dataIndex: 'video_check_tag',
    render: (_, { video_check_tag, video_check_flag }) =>
      video_check_tag ? (
        <Tag color="volcano" key={video_check_tag}>
          {video_check_tag}
        </Tag>
      ) : video_check_flag ? (
        <Tag color="green">checked</Tag>
      ) : (
        ''
      ),
  },
  {
    title: 'DUPLICATE',
    dataIndex: 'video_duplicate',
  },

  {
    title: 'CHECKED TIME',
    dataIndex: 'video_checkedAt',
  },

  {
    title: 'COMMENT',
    dataIndex: 'video_check_description',
  },
];

type PropsFromRedux = ConnectedProps<typeof connector>;
const tmp = 1;
const VideoList = ({
  getVideoList,
  getVideoListRange,
  setDate,
  sendVideoList,
  getCuratorList,
  setFilter,
  curator: { curators },
  admin: {
    all_num,
    ypp_num,
    nft_num,
    uncheck_num,
    cat_A,
    cat_B,
    cat_C,
    cat_D,
    toxic,
    duplicate,
    videos,
    loading,
    start,
    end,
    filter_data,
  },
}: any) => {
  const [value, setValue] = useState(tmp);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [curator, setCurator] = useState<CuratorList>();
  const [start_date, setStart_date] = useState<any>();
  const [end_date, setEnd_date] = useState<any>();

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    const filtertmp = e.target.value;
    setFilter(filtertmp);
  };

  useEffect(() => {
    getCuratorList();
  }, []);

  useEffect(() => {
    getVideoListRange(start_date, end_date);
  }, [start_date, end_date]);

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: Assignment[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onCuratorChange = (value: CuratorList) => {
    setCurator(value);
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

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (curator !== undefined && curator) {
      sendVideoList(selectedRowKeys, curator);
    }
  };
  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(filter_data))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';

    link.click();
  };

  const onDateChange = (value: RangePickerProps['value'], dateString: [string, string]) => {
    // console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    setStart_date(dateString[0]);
    setEnd_date(dateString[1]);
    getVideoListRange(dateString);
  };

  const onCheckChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
  };
  const onOk = (value: RangePickerProps['value']) => {
    console.log('onOk: ', value);
  };
  const { data } = useVideoCounts(start_date, end_date);
  return (
    <section className="container">
      <h1 className="large text-primary">Videos List</h1>
      <Divider />

      <Row>
        <Col span={2}>
          <Tag color="cyan">QN Size: </Tag>
          {data}
        </Col>
        <Col span={2}>
          <Tag color="cyan">DB Size: </Tag>
          {all_num}
        </Col>
        <Col span={2}>
          <Tag color="cyan">Ypp Videos: </Tag>
          {ypp_num}
        </Col>
        <Col span={2}>
          <Tag color="cyan">Nft Videos: </Tag> {nft_num}
        </Col>
        <Col span={2}>
          <Tag color="cyan">UnChecked Videos: </Tag>
          {uncheck_num}
        </Col>
        <Col span={2}>
          <Tag color="cyan">Category A: </Tag>
          {cat_A}
        </Col>
        <Col span={2}>
          <Tag color="cyan">Category B: </Tag>
          {cat_B}
        </Col>
        <Col span={2}>
          <Tag color="cyan">Category C: </Tag>
          {cat_C}
        </Col>
        <Col span={2}>
          <Tag color="cyan">Category D: </Tag>
          {cat_D}
        </Col>
        <Col span={2}>
          <Tag color="cyan">Toxic Contents: </Tag>
          {toxic}
        </Col>
        <Col span={2}>
          <Tag color="cyan">Duplicate Videos: </Tag>
          {duplicate}
        </Col>

        <Col span={2}>
          <Button type="primary" onClick={exportData} shape="round" icon={<DownloadOutlined />} size="large" >
            Download
          </Button>
        </Col>
      </Row>
      {/* <Col span={3}>  </Col> */}
      <Divider />
      <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChange}>
    <Row>
      <Col span={2}>
        <Checkbox value="A">YPP</Checkbox>
      </Col>
      <Col span={2}>
        <Checkbox value="B">Non YPP</Checkbox>
      </Col>
      <Col span={2}>
        <Checkbox value="C">NFT</Checkbox>
      </Col>
      <Col span={2}>
        <Checkbox value="D">Non NFT</Checkbox>
      </Col>
      <Col span={2}>
        <Checkbox value="E">CHECKED</Checkbox>
      </Col>
      <Col span={2}>
        <Checkbox value="F">Non CHECKED</Checkbox>
      </Col>
    </Row>
  </Checkbox.Group>
      <Row>
        <Col span={8}>
          <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={onDateChange} onOk={onOk} />
        </Col>

        <Col span={8}>
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>All</Radio>
            <Radio value={2}>YPP</Radio>
            <Radio value={5}>NON YPP</Radio>
            <Radio value={3}>NFT</Radio>
            <Radio value={6}>NON NFT</Radio>
            <Radio value={4}>CHECKED</Radio>
            <Radio value={7}>NOT CHECKED</Radio>
          </Radio.Group>
        </Col>
      </Row>

      <Divider />

      <Fragment>
        <form className="form" onSubmit={onSubmit}>
          {data != null && data > videos.length ? (
            <Link
              to={`/from-qn/${moment.utc(start_date).toISOString()}/${moment.utc(end_date).toISOString()}`}
              className="btn btn-primary"
            >
              Refresh
            </Link>
          ) : (
            <Button type="primary" disabled>
              Refresh
            </Button>
          )}
          <Select
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onCuratorChange}
            options={curators?.map((item: CuratorList) => {
              return { value: item.handle, label: item.handle };
            })}
          />
          <input type="submit" className="btn btn-primary" value="Assign" />
          <Table columns={columns} dataSource={filter_data} rowSelection={rowSelection} />
        </form>
      </Fragment>
    </section>
  );
};

const mapStateToProps = (state: any) => ({
  admin: state.admin,
  curator: state.curator,
  auth: state.auth,
});

const connector = connect(mapStateToProps, { getVideoListRange, sendVideoList, getCuratorList, setDate, setFilter });

export default connector(VideoList);
