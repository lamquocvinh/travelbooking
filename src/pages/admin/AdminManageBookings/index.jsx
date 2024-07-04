import React, { useState, useRef } from 'react'
import "./AdminManageBookings.scss"
import { Table, Tag, Button, Modal, Tooltip, notification, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useGetBookingQuery } from '../../../services/bookingAPI';
import { Link } from 'react-router-dom';

const AdminManageBookings = () => {
    // hook call api
    const { data, refetch } = useGetBookingQuery();

    // search in table
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

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

    // render - xu ly onChange 
    const columns = [
        {
            title: 'Guest Name',
            dataIndex: 'full-name',
            key: 'full-name',
            width: "25%",
            ...getColumnSearchProps('user.full_name', (text, record) => record["full-name"]),
        },
        {
            title: 'Date',
            dataIndex: 'booking-date',
            key: 'booking-date',
            width: "25%",
            ...getColumnSearchProps('booking-date', (text, record) => `${record["booking-date"][2]}/${record["booking-date"][1]}/${record["booking-date"][0]} - ${record["booking-date"][3]}:${record["booking-date"][4]}:${record["booking-date"][5]}`),
        },
        {
            title: 'Total',
            dataIndex: 'total-price',
            key: 'total-price',
            width: "25%",
            sorter: (a, b) => a["total-price"] - b["total-price"],
            ...getColumnSearchProps('total-price', (text, record) => record["total-price"]?.toLocaleString()),
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: 150,
            align: "center",
            filters: [
                {
                    text: 'PENDING',
                    value: "PENDING",
                },
                {
                    text: 'CONFIRMED',
                    value: "CONFIRMED",
                },
                {
                    text: 'PAID',
                    value: "PAID",
                },
                {
                    text: 'CANCELLED',
                    value: "CANCELLED",
                },
            ],
            onFilter: (value, record) => record.status === value,
            render: (_, record) => (
                <div>
                    {record.status === "PENDING" &&
                        <Tag icon={<SyncOutlined spin />} color="processing">
                            PENDING
                        </Tag>
                    }
                    {record.status === "CONFIRMED" &&
                        <Tag icon={<CheckCircleOutlined />} color="warning">
                            CONFIRMED
                        </Tag>
                    }
                    {record.status === "PAID" &&
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            PAID
                        </Tag>
                    }
                    {record.status === "CANCELLED" &&
                        <Tag icon={<CloseCircleOutlined />} color="error">
                            CANCELLED
                        </Tag>
                    }
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            align: "center",
            render: (_, record) => (
                <Tooltip title="View detail">
                    <Link to={`booking-details/${record["booking-id"]}`}>
                        <Button icon={<EyeOutlined />}></Button>
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
        <div className='admin-manage-bookings-wrapper'>
            <h2 className='title'>List of bookings:</h2>
            <Table
                bordered={true}
                columns={columns}
                dataSource={transformedData}
                onChange={onChange}
            />
        </div>
    )
}

export default AdminManageBookings;