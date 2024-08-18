import React from 'react';
import { Card, Col, Row, Input } from 'antd';

const { Meta } = Card;

const CardCompnent = () => (
    <Row gutter={16}>
        {[1, 2, 3].map((_, index) => (
            <Col span={8} key={index}>
                <Card
                    hoverable
                    style={{ width: 300 }}
                    cover={
                        <div style={{ display: 'flex', alignItems: 'center', padding: 16 }}>
                            <img
                                alt="example"
                                src="https://via.placeholder.com/60"
                                style={{ width: 60, height: 60, marginRight: 16 }}
                            />
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 'bold' }}>Image Title</div>
                                <div style={{ fontSize: 14, color: 'gray' }}>Image Description</div>
                            </div>
                        </div>
                    }
                >
                    <Meta title="Card title" description="This is the description" />
                    <div style={{ marginTop: 16 }}>
                        <Input placeholder="Enter some text" />
                    </div>
                </Card>
            </Col>
        ))}
    </Row>
);

export default CardCompnent;
