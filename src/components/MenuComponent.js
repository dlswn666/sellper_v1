import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons'; // HomeOutlined 아이콘을 import

const MenuComponent = () => {
    const navigate = useNavigate();
    const items = [
        {
            label: 'Home',
            key: '/',
            icon: <HomeOutlined />,
        },
        {
            label: 'About',
            key: '/about',
            icon: <HomeOutlined />,
        },
        {
            label: 'Contact',
            key: '/contact',
            icon: <HomeOutlined />,
        },
        {
            label: 'Navigation Three - Submenu',
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                {
                    type: 'group',
                    label: 'Item 1',
                    children: [
                        {
                            label: 'Option 1',
                            key: 'setting:1',
                        },
                        {
                            label: 'Option 2',
                            key: 'setting:2',
                        },
                    ],
                },
                {
                    type: 'group',
                    label: 'Item 2',
                    children: [
                        {
                            label: 'Option 3',
                            key: 'setting:3',
                        },
                        {
                            label: 'Option 4',
                            key: 'setting:4',
                        },
                    ],
                },
            ],
        },
    ];

    const handleClick = (e) => {
        // e.key 값을 통해 해당 경로로 이동
        navigate(e.key);
    };

    return (
        <>
            <Menu onClick={handleClick} mode="horizontal" defaultSelectedKeys={['/']} items={items}></Menu>
        </>
    );
};

export default MenuComponent;
