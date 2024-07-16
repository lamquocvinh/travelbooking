import React, { useState, useRef } from 'react'
import "./AdminManagePartners.scss"
import { Table, Tag, Button, Modal, Tooltip, notification, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    LockOutlined,
    UnlockOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useChangeStatusUserMutation, useGetPartnersQuery } from '../../../services/userAPI';
import { useUpdateStatusPackageMutation } from '../../../services/packageAPI';
import { Link } from 'react-router-dom';

const AdminManageUsers = () => {
    // hook call api
    const [changeStatus, { isLoading }] = useChangeStatusUserMutation();
    const [updateStatus, { isLoading: isUpdate }] = useUpdateStatusPackageMutation();
    const { data, isLoading: isFetching, refetch } = useGetPartnersQuery();

    // search in table
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    // active-inactive user
    const [activeUser, setActiveUser] = useState({});
    const [packageStatus, setPackageStatus] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenPackage, setIsModalOpenPackage] = useState(false);

    // ham xu ly modal - active-inactive user
    const showModal = (body) => {
        setActiveUser(body)
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        try {
            const result = await changeStatus(activeUser);
            if (result?.error?.originalStatus == 200) {
                notification.success({
                    message: "Change status successfully!"
                })
                refetch();
            }
        } catch (error) {
            notification.error({
                message: "Some thing wrong!"
            })
        }
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // ham xu ly modal - status package
    const showModalPackage = (body) => {
        setPackageStatus(body)
        setIsModalOpenPackage(true);
    };
    const handleOkPackage = async () => {
        try {
            const result = await updateStatus(packageStatus);
            if (result?.error?.originalStatus == 200) {
                notification.success({
                    message: "Change status successfully!"
                })
                refetch();
            }
        } catch (error) {
            notification.error({
                message: "Some thing wrong!"
            })
        }
        setIsModalOpenPackage(false);
    };
    const handleCancelPackage = () => {
        setIsModalOpenPackage(false);
    };

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
    const getColumnSearchProps = (dataIndex) => ({
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
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text, record) =>
            searchedColumn === dataIndex ? (
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
                text
            ),
    });

    // render - xu ly onChange 
    const columns = [
        {
            title: 'Name',
            dataIndex: 'full_name',
            key: 'full_name',
            width: "20%",
            ...getColumnSearchProps('full_name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: "20%",
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone_number',
            key: 'phone_number',
            width: "20%",
            ...getColumnSearchProps('phone_number'),
        },
        {
            title: 'Status',
            key: 'is_active',
            dataIndex: 'is_active',
            width: 150,
            align: "center",
            filters: [
                {
                    text: 'ACTIVE',
                    value: true,
                },
                {
                    text: 'INACTIVE',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (_, record) => (
                <div>
                    {record.is_active === true &&
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            ACTIVE
                        </Tag>
                    }
                    {record.is_active === false &&
                        <Tag icon={<ExclamationCircleOutlined />} color="warning">
                            INACTIVE
                        </Tag>
                    }
                </div>
            ),
        },
        {
            title: 'Package Status',
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
                    text: 'ACTIVE',
                    value: "ACTIVE",
                },
                {
                    text: 'INACTIVE',
                    value: "INACTIVE",
                },
                {
                    text: 'EXPIRED',
                    value: "EXPIRED",
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
                    {record.status === "ACTIVE" &&
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            ACTIVE
                        </Tag>
                    }
                    {record.status === "INACTIVE" &&
                        <Tag icon={<ExclamationCircleOutlined />} color="warning">
                            INACTIVE
                        </Tag>
                    }
                    {record.status === "EXPIRED" &&
                        <Tag icon={<ClockCircleOutlined />} color="cyan">
                            EXPIRED
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
                <Space>
                    {record.is_active === true
                        ?
                        <Tooltip title="INACTIVE USER" color='red'>
                            <Button
                                icon={<LockOutlined />}
                                danger
                                onClick={() => {
                                    showModal({
                                        userId: record.id,
                                        status: 0
                                    })
                                }} />
                        </Tooltip>
                        :
                        <Tooltip title="ACTIVE USER" color='green'>
                            <Button
                                icon={<UnlockOutlined />}
                                onClick={() => {
                                    showModal({
                                        userId: record.id,
                                        status: 1
                                    })
                                }} ></Button>
                        </Tooltip>}
                    {record.status === "PENDING" &&
                        <Tooltip title="ACTIVE PACKAGE" color='green'>
                            <Button
                                icon={<UnlockOutlined />}
                                danger
                                onClick={() => {
                                    showModalPackage({
                                        userId: record.id,
                                        status: "ACTIVE"
                                    })
                                }} />
                        </Tooltip>}
                    {/* {record.status === "ACTIVE" &&
                        <Tooltip title="EXPIRED PACKAGE" color='cyan'>
                            <Button
                                icon={<ClockCircleOutlined />}
                                onClick={() => {
                                    showModalPackage({
                                        userId: record.id,
                                        status: "EXPIRED"
                                    })
                                }} ></Button>
                        </Tooltip>} */}
                    <Tooltip title="View Details" color='blue'>
                        <Link to={`partner-details/${record.id}`}>
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

    const transformedData = data?.map((item, index) => ({
        ...item,
        key: index, // add key property
    }));

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className='admin-manage-users-wrapper'>
            <h2 className='title'>List of partners:</h2>
            <Table
                loading={isFetching}
                bordered={true}
                columns={columns}
                dataSource={transformedData}
                onChange={onChange}
            />
            <Modal
                title="Change Status Of User"
                open={isModalOpen}
                onOk={handleOk}
                confirmLoading={isLoading}
                onCancel={handleCancel}
                centered
                width={"400px"}
                style={{
                    zIndex: "9999",
                }}
            >
                <p>Are you sure to do that?</p>
            </Modal>
            <Modal
                title="Change Status Of Package"
                open={isModalOpenPackage}
                onOk={handleOkPackage}
                confirmLoading={isUpdate}
                onCancel={handleCancelPackage}
                centered
                width={"400px"}
                style={{
                    zIndex: "9999",
                }}
            >
                <p>Are you sure to do that?</p>
            </Modal>
        </div >
    )
}

export default AdminManageUsers;