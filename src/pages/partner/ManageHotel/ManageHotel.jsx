import React, { useState, useRef, useEffect } from 'react';
import "./ManageHotel.scss";
import { Table, Tag, Button, Popover, Modal, notification, Input, Space, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    MenuOutlined,
    PlusCircleOutlined,
    EditOutlined,
    BankOutlined,
    SolutionOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useGetHotelForPartnerQuery, useChangeStatusHotelMutation } from "../../../services/hotelAPI";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ManageHotel = () => {
    const packageId = useSelector((state) => state.auth.packageId);
    const navigate = useNavigate()

    // call api
    const [changeStatus] = useChangeStatusHotelMutation();
    const { data, refetch, isLoading } = useGetHotelForPartnerQuery();
    const [hotelCount, setHotelCount] = useState(0); // to track number of hotels

    // search in table
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [statusHotel, setStatusHotel] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const result = await changeStatus(statusHotel);
            if (result.data.status === "OK") {
                notification.success({
                    message: "Change status successfully!"
                });
                refetch // cập nhật trạng thái đã thay đổi
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Some thing wrong!"
            });
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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

    // render column
    const columns = [
        {
            title: 'Hotel Name',
            dataIndex: 'hotel_name',
            key: 'hotel_name',
            width: '30%',
            ...getColumnSearchProps('hotel_name', (text, record) => record?.hotel_name),
        },
        {
            title: 'Address',
            dataIndex: 'location.address',
            key: 'location.address',
            width: '30%',
            ...getColumnSearchProps('location.address', (text, record) => record?.location?.address),

        },
        {
            title: 'Province',
            dataIndex: 'location.province',
            key: 'location.province',
            ...getColumnSearchProps('location.province', (text, record) => record?.location?.province),
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: '15%',
            align: "center",
            filters: [
                {
                    text: 'PENDING',
                    value: 'PENDING',
                },
                {
                    text: 'APPROVED',
                    value: 'APPROVED',
                },
                {
                    text: 'REJECTED',
                    value: 'REJECTED',
                },
                {
                    text: 'ACTIVE',
                    value: 'ACTIVE',
                },
                {
                    text: 'INACTIVE',
                    value: 'INACTIVE',
                },
                {
                    text: 'CLOSED',
                    value: 'CLOSED',
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: (_, record) => (
                <div>
                    {record.status === "APPROVED" &&
                        < Tag icon={<CheckCircleOutlined />} color="success">
                            {record.status}
                        </Tag>
                    }
                    {record.status === "PENDING" &&
                        < Tag icon={< SyncOutlined spin />} color="processing" >
                            {record.status}
                        </Tag >
                    }
                    {record.status === "REJECTED" &&
                        < Tag icon={< CloseCircleOutlined />} color="error" >
                            {record.status}
                        </Tag >
                    }
                    {record.status === "ACTIVE" &&
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            {record.status}
                        </Tag>
                    }
                    {record.status === "INACTIVE" &&
                        <Tag icon={<ExclamationCircleOutlined />} color="warning">
                            {record.status}
                        </Tag>
                    }
                    {record.status === "CLOSED" &&
                        <Tag icon={<CloseCircleOutlined />} color="error">
                            {record.status}
                        </Tag>
                    }
                </div >
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            align: "center",
            render: (_, record) => (
                <Space>
                    {record.status !== "PENDING" && record.status !== "REJECTED" &&
                        < Popover content={
                            < div >
                                {
                                    record.status === "ACTIVE" && <div>
                                        <Button
                                            className='action-item approved'
                                            icon={<ExclamationCircleOutlined />}
                                            onClick={() => {
                                                setStatusHotel({
                                                    hotelId: record.id,
                                                    status: `"INACTIVE"`
                                                });
                                                showModal();
                                            }}
                                        >
                                            <span className='link'>INACTIVE</span>
                                        </Button>

                                    </div>
                                }
                                {
                                    record.status === "INACTIVE" && <div>
                                        <Button
                                            className='action-item approved'
                                            icon={<CheckCircleOutlined />}
                                            onClick={() => {
                                                setStatusHotel({
                                                    hotelId: record.id,
                                                    status: `"ACTIVE"`
                                                });
                                                showModal();
                                            }}
                                        >
                                            <span className='link'>ACTIVE</span>
                                        </Button>

                                    </div>
                                }

                                <Link className='link' to={`${record.id}/manage-room`}>
                                    <Button
                                        className='action-item'
                                        icon={<BankOutlined />}
                                    >
                                        <span className='link'>Room</span>
                                    </Button>
                                </Link>
                                <Link className='link' to={`booking/${record.id}`}>
                                    <Button
                                        className='action-item'
                                        icon={<SolutionOutlined />}
                                    >
                                        <span className='link'>Booking</span>
                                    </Button>
                                </Link>
                            </div >
                        } trigger="hover" placement='left'>
                            <Button icon={<MenuOutlined />}></Button>
                        </Popover>}
                    <Tooltip title="View Details" color='blue'>
                        <Link to={`hotel-details/${record.id}`}>
                            <Button
                                icon={<EyeOutlined />}
                            >
                            </Button>
                        </Link>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const transformedData = data?.data?.content?.map((item, index) => ({
        ...item,
        key: index, // add key property
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 10000);

        if (data?.data?.content?.length !== hotelCount) {
            setHotelCount(data?.data?.content?.length);
            refetch();
        }
        return () => clearInterval(interval);
    }, [data, hotelCount, refetch]);

    // kiểm tra trước khi cho manage hotel
    useEffect(() => {
        if (packageId == null) {
            notification.error({
                message: "You need to buy package first!"
            });
            navigate('/partner/package')
        }
    }, [])

    return (
        <div className='partner-manage-hotel-wrapper'>
            <div className="action">
                <h2>Manage Hotels</h2>
                <Link className="new-btn" to={"/partner/create-hotel"}>
                    <PlusCircleOutlined />
                    New Hotel
                </Link>
            </div>
            <Table
                bordered={true}
                columns={columns}
                dataSource={transformedData}
                loading={isLoading}
            />
            <Modal
                title="Change Status Of Hotel"
                open={isModalOpen}
                confirmLoading={isLoading}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                width={"400px"}
                style={{
                    zIndex: "9999",
                }}
            >
                <p>Are you sure to do that?</p>
            </Modal>
        </div>
    );
};

export default ManageHotel;
