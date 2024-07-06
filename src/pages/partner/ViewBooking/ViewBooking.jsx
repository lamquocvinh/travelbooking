import React, { useState, useRef, useEffect } from 'react'
import "./ViewBooking.scss"
import { Table, Tag, Button, Popover, Modal, notification, Input, Space, Tooltip } from 'antd';
import {
    SearchOutlined,
    PlusCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useGetBookingByHotelQuery } from '../../../services/bookingAPI';

const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

const ViewBooking = () => {
    const { hotelId } = useParams();
    const { data } = useGetBookingByHotelQuery(hotelId);
    const [hasStatusChanged, setHasStatusChanged] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef(null);
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
            title: 'Customer Name',
            dataIndex: 'full-name',
            key: 'full-name',
            ...getColumnSearchProps('user.full_name', (text, record) => record["full-name"]),
        },

        {
            title: 'Total Price',
            dataIndex: 'total-price',
            key: 'total-price',
            sorter: (a, b) => a['total-price'] - b['total-price'],
        },
        {
            title: 'Booking Date',
            dataIndex: 'booking-date',
            key: 'booking-date',
            ...getColumnSearchProps('booking-date', (text, record) => `${record["booking-date"][2]}/${record["booking-date"][1]}/${record["booking-date"][0]} - ${record["booking-date"][3]}:${record["booking-date"][4]}:${record["booking-date"][5]}`),
        },
        {
            title: 'Check In',
            dataIndex: 'check-in-date',
            key: 'check-in-date',
            ...getColumnSearchProps('check-in-date', (text, record) => `${record["check-in-date"][2]}/${record["check-in-date"][1]}/${record["check-in-date"][0]}`),
        },
        {
            title: 'Check Out',
            dataIndex: 'check-out-date',
            key: 'check-out-date',
            ...getColumnSearchProps('check-out-date', (text, record) => `${record["check-out-date"][2]}/${record["check-out-date"][1]}/${record["check-out-date"][0]}`),
        },

        {
            title: 'Payment Method',
            dataIndex: 'payment-method',
            key: 'payment-method',
            ...getColumnSearchProps('payment-method', (text, record) => record['payment-method']),
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

    return (
        <div className='manage-hotel-wrapper'>
            <p><h2 className='title'>Booking</h2></p>

            <Table
                bordered={true}
                columns={columns}
                dataSource={data?.data?.content || []}
                onChange={onChange}
                scroll={{
                    y: 440,
                }}
            />

        </div>
    )
}

export default ViewBooking