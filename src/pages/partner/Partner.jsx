import React from 'react';
import {
    SolutionOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCheckExpirationQuery } from '../../services/packageAPI';
import { useSelector } from 'react-redux';

const { Content, Sider } = Layout;

const Partner = () => {
    const location = useLocation();
    const packageId = useSelector(state => state.auth.packageId);
    const { data } = packageId !== null ? useCheckExpirationQuery() : { data: {} };
    const checkPackage = data?.message;
    const determineActiveKey = (path) => {
        if (path.startsWith('/partner/manage-hotel')) {
            return '/partner/manage-hotel';
        }
        return path;
    };
    const selectedKey = determineActiveKey(location.pathname);
    const {
        token: { colorBgContainer, borderRadiusLG, ...other },
    } = theme.useToken();

    const items = [
        {
            label: (
                <Link to="/partner/package">Buy Package</Link>
            ),
            key: "/partner/package",
            icon: <DollarOutlined style={{ fontSize: '20px' }} />,
        },
        {
            label: (
                checkPackage !== null && checkPackage === "Package is still valid" &&
                <Link to="/partner/manage-hotel">Manage Hotel</Link>
            ),
            key: "/partner/manage-hotel",
            icon: (
                checkPackage !== null && checkPackage === "Package is still valid" &&
                <SolutionOutlined style={{ fontSize: '20px' }} />
            ),
            disabled: (checkPackage === null && checkPackage !== "Package is still valid")
        },
    ];

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

export default Partner