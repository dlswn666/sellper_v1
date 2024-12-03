import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuComponent from './components/MenuComponent.js';
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout.js';
import Home from './pages/Home.js';
import Contact from './pages/Contact.js';
import Products from './pages/Products.js';

// router 설정
// redux, context api, recoil을 이용한 전역 상태 관리
// styled-components, material-ui, css, sass를 이용한 글로벌 스타일 테마 설정 가능
// 공통 레이아웃
// 로깅 시스템 설정 가능

function App() {
    const headerCss = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottom: '1px solid #e8e8e8',
    };

    return (
        <Router>
            <Layout>
                <Header style={headerCss}>
                    <div className="sellper-logo" style={{ width: '100px', marginRight: '20px' }}>
                        <h1>SellPer</h1>
                    </div>
                    <MenuComponent />
                </Header>
                <Content style={{ padding: '0 48px', height: 'auto', minHeight: '1800px' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/products" element={<Products />} />
                    </Routes>
                </Content>
                <Footer>
                    <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid #e8e8e8' }}>
                        ©2024 My Website. All Rights Reserved.
                    </div>
                </Footer>
            </Layout>
        </Router>
    );
}

export default App;
