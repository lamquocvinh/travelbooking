import React from 'react';
import {
    SolutionOutlined,
    BarChartOutlined,
    BankOutlined,
    UserOutlined,
    UsergroupAddOutlined,
    WifiOutlined,
    InboxOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Content, Sider } = Layout;

const items = [
    {
        label: (
            <Link to="/admin/">Dashboard</Link>
        ),
        key: "/admin/",
        icon: <BarChartOutlined style={{ fontSize: '20px' }} />,
    },
    {
        label: (
            <Link to="/admin/manage-bookings">Bookings</Link>
        ),
        key: "/admin/manage-bookings",
        icon: <SolutionOutlined style={{ fontSize: '20px' }} />,
    },
    {
        label: (
            <Link to="/admin/manage-users">Users</Link>
        ),
        key: "/admin/manage-users",
        icon: <UserOutlined style={{ fontSize: '20px' }} />,
    },
    {
        label: (
            <Link to="/admin/manage-partners">Partners</Link>
        ),
        key: "/admin/manage-partners",
        icon: <UsergroupAddOutlined style={{ fontSize: '20px' }} />,
    },
    {
        label: (
            <Link to="/admin/manage-hotels">Hotels</Link>
        ),
        key: "/admin/manage-hotels",
        icon: <BankOutlined style={{ fontSize: '20px' }} />,
    },
    {
        label: (
            <Link to="/admin/manage-packages">Packages</Link>
        ),
        key: "/admin/manage-packages",
        icon: <InboxOutlined style={{ fontSize: '20px' }} />,
    },
    {
        label: (
            <Link to="/admin/manage-conveniences">Conveniences</Link>
        ),
        key: "/admin/manage-conveniences",
        icon: <WifiOutlined style={{ fontSize: '20px' }} />,
    },
];

const Admin = () => {
    const location = useLocation();
    const selectedKey = location.pathname;
    const {
        token: { colorBgContainer, borderRadiusLG, ...other },
    } = theme.useToken();

    return (
        <div>
            <Layout
                style={{
                    padding: '24px 0',
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Sider
                    style={{
                        background: colorBgContainer,
                    }}
                    width={200}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        items={items}
                    />
                </Sider>
                <Content
                    style={{
                        padding: '0 24px',
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </div>
    )
}

export default Admin