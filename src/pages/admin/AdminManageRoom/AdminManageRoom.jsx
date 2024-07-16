import React, { useState, useRef } from 'react'
import "./AdminManageRoom.scss"
import { Table, Tag, Button, Input, Space, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { roomApi } from '../../../services/roomAPI';

const AdminManageRoom = () => {
    const { hotelId } = useParams();
    const searchInput = useRef(null);
    const { data, isLoading: isFetching } = roomApi.useGetAllRoomQuery(hotelId);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    // ham xu ly search
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex, customRender) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            const keys = dataIndex.split('.');
            let data = record;
            keys.forEach(key => {
                data = data[key];
            });
            return data ? data.toString().toLowerCase().includes(value.toLowerCase()) : false;
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text, record) => {
            const keys = dataIndex.split('.');
            let data = record;
            keys.forEach(key => {
                data = data ? data[key] : null;
            });
            text = data; // update text to be the nested data

            return searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                customRender ? customRender(text, record) : text
            );
        },
    });

    const columns = [
        {
            title: 'Room Type',
            dataIndex: 'room_type_name',
            key: 'room_type_name',
            width: "40%",
            ...getColumnSearchProps('room_type_name', (text, record) => record.room_type_name),
        },
        {
            title: 'Quantity',
            dataIndex: 'number_of_rooms',
            key: 'number_of_rooms',
            width: 150,
            sorter: (a, b) => a.number_of_rooms - b.number_of_rooms,
        },
        {
            title: 'Price',
            dataIndex: 'room_price',
            key: 'room_price',
            width: 150,
            ...getColumnSearchProps('room_price', (text, record) => record?.room_price?.toLocaleString()),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: "center",
            filters: [
                {
                    text: 'UNAVAILABLE',
                    value: 'UNAVAILABLE',
                },
                {
                    text: 'DISABLED',
                    value: 'DISABLED',
                },
                {
                    text: 'AVAILABLE',
                    value: 'AVAILABLE',
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: (_, record) => (
                <div>
                    {record.status === "AVAILABLE" &&
                        < Tag icon={<CheckCircleOutlined />} color="success">
                            {record.status}
                        </Tag>
                    }
                    {record.status === "UNAVAILABLE" &&
                        < Tag icon={< SyncOutlined spin />} color="processing" >
                            {record.status}
                        </Tag >
                    }
                    {record.status === "DISABLED" &&
                        < Tag icon={< CloseCircleOutlined />} color="error" >
                            {record.status}
                        </Tag >
                    }
                </div >
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            align: "center",
            render: (_, record) => (
                <Tooltip title="View Details" color='blue'>
                    <Link to={`room-details/${record.id}`}>
                        <Button
                            icon={<EyeOutlined />}
                        >
                        </Button>
                    </Link>
                </Tooltip>
            ),
        },
    ];
    const transformedData = data?.data?.content?.map((item, index) => ({
        ...item,
        key: index, // add key property
    }));
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className='admin-manage-room-wrapper'>
            <div className='header-admin-room'>
                <h2 className='title'>List of Rooms</h2>
                <button className="item cancel" type="reset" onClick={() => {
                    window.history.back();
                }}>
                    <CloseCircleOutlined />
                </button>
            </div>
            <Table
                loading={isFetching}
                bordered={true}
                columns={columns}
                dataSource={transformedData}
                onChange={onChange}
            />
        </div>
    )
}

export default AdminManageRoom