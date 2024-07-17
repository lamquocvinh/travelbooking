import React, { useState, useRef, useEffect } from 'react'
import "./ManageRoom.scss"
import { Table, Tag, Button, Popover, Modal, notification, Input, Space, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    PlusCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    EditOutlined,
    MenuOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { roomApi } from '../../../services/roomAPI';

const ManageRoom = () => {
    const { id } = useParams();
    const { data, refetch, isLoading } = roomApi.useGetAllRoomQuery(id);
    const [changeStatus] = roomApi.useUpdateStatusMutation();
    const [hotelCount, setHotelCount] = useState(0);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [statusRoom, setStatusRoom] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        try {
            const result = await changeStatus(statusRoom);
            if (result.data.status === "OK") {
                notification.success({
                    message: "Change status successfully!"
                });
            }
            refetch
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

    // ham xu ly search
    const searchInput = useRef(null);
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
            width: "30%",
            ...getColumnSearchProps('room_type_name', (text, record) => record?.room_type_name),
        },
        {
            title: 'Quantity',
            dataIndex: 'number_of_rooms',
            key: 'number_of_rooms',
            sorter: (a, b) => a.number_of_rooms - b.number_of_rooms,
        },
        {
            title: 'Price',
            dataIndex: 'room_price',
            key: 'room_price',
            ...getColumnSearchProps('room_price', (text, record) => record?.room_price?.toLocaleString()),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
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
                <Space>
                    < Popover content={
                        < div >
                            <Link className='link' to={`${record.id}/update`}>
                                <Button
                                    className='action-item'
                                    icon={<EditOutlined />}
                                >
                                    <span className='link'>Update</span>
                                </Button>
                            </Link>

                            {
                                record.status === "DISABLED" && <div>
                                    <Button
                                        className='action-item'
                                        style={{ marginTop: '5px' }}
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => {
                                            setStatusRoom({
                                                roomTypeId: record.id,
                                                status: `"AVAILABLE"`
                                            });
                                            showModal();
                                        }}
                                    >
                                        <span className='link'>Available</span>
                                    </Button>
                                </div>
                            }
                            {
                                record.status === "AVAILABLE" && <div>
                                    <Button
                                        className='action-item'
                                        style={{ marginTop: '5px' }}
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => {
                                            setStatusRoom({
                                                roomTypeId: record.id,
                                                status: `"DISABLED"`
                                            });
                                            showModal();
                                        }}
                                    >
                                        <span className='link'>Disabled</span>
                                    </Button>
                                </div>
                            }
                        </div >
                    } trigger="hover" placement='left'>
                        <Button icon={<MenuOutlined />}></Button>
                    </Popover>
                    <Tooltip title="View Details" color='blue'>
                        <Link to={`room-details/${record.id}`}>
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
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

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

    return (
        <div className='manage-hotel-wrapper'>
            <div className="action">
                <h2 className='title'>Manage Rooms</h2>
                <Link className="new-btn" to={"create-room"}>
                    <PlusCircleOutlined />
                    New Room
                </Link>
            </div>
            <Table
                loading={isLoading}
                bordered={true}
                columns={columns}
                dataSource={transformedData}
                onChange={onChange}
            />
            <Modal
                title="Change Status Of Room"
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
    )
}

export default ManageRoom