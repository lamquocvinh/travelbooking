import React, { useState, useRef, useEffect } from 'react'
import "./AdminManagePackages.scss"
import { Table, Button, Tooltip, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';
import { useGetAllPackagesQuery } from '../../../services/packageAPI';
import { Link } from 'react-router-dom';

const AdminManagePackages = () => {
    // hook call api
    // const { data, refetch } = useGetBookingQuery();
    const { data, refetch } = useGetAllPackagesQuery();

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
            title: 'Package name',
            dataIndex: 'name',
            key: 'name',
            width: "30%",
            ...getColumnSearchProps('name', (text, record) => record["name"]),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: "30%",
            sorter: (a, b) => a["price"] - b["price"],
            ...getColumnSearchProps('price', (text, record) => `${record["price"]?.toLocaleString()} VND`),
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            width: "30%",
            sorter: (a, b) => a["duration"] - b["duration"],
            ...getColumnSearchProps('duration', (text, record) => `${record["duration"]?.toLocaleString()} Days`),
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                    <Tooltip title="Details">
                        <Link to={`package-details/${record["id"]}`}>
                            <Button icon={<EyeOutlined />}></Button>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Link to={`package-edit/${record["id"]}`}>
                            <Button icon={<EditOutlined />}></Button>
                        </Link>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const transformedData = data?.data?.map((item, index) => ({
        ...item,
        key: index, // add key property
    }));

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    useEffect(() => {
        refetch()
    }, [])

    return (
        <div className='admin-manage-packages-wrapper'>
            <div className="action">
                <h2>List of packages</h2>
                <Link className="new-btn" to={"package-create"}>
                    <PlusCircleOutlined />
                    New package
                </Link>
            </div>            <Table
                bordered={true}
                columns={columns}
                dataSource={transformedData}
                onChange={onChange}
            />
        </div>
    )
}

export default AdminManagePackages;