import React, { useEffect, useRef, useState } from 'react';
import { Space, Row, Col, Ste } from 'antd';
import SearchKeywordCard from '../components/products/SearchKeywordCard';
import testData from '../assets/testData/test';

const Products = () => {
    const initImageGroup = [
        'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
    ];

    const modifiedTestData = testData.map((item) => ({
        ...item,
        images: initImageGroup,
    }));

    const [focusedIndex, setFocusedIndex] = useState(0);
    const cardRefs = useRef([]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, modifiedTestData.length - 1);
                cardRefs.current[newIndex]?.focusInput(); // input에 포커스 이동
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                cardRefs.current[newIndex]?.focusInput(); // input에 포커스 이동
                return newIndex;
            });
        }
    };

    useEffect(() => {
        // 페이지 진입 시 첫 번째 카드의 input에 포커스
        console.log('실행1');
        cardRefs.current[0]?.focusInput();
    }, []);

    return (
        <>
            <Row>
                <Col span={24}>
                    <Space
                        direction="vertical"
                        size={'middle'}
                        style={{ display: 'flex' }}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        {modifiedTestData.map((item, index) => (
                            <SearchKeywordCard
                                key={index}
                                data={item}
                                isFocused={index === focusedIndex}
                                ref={(el) => (cardRefs.current[index] = el)} // 카드에 대한 참조 저장
                                onCardFocus={() => setFocusedIndex(index)}
                            />
                        ))}
                    </Space>
                </Col>
            </Row>
        </>
    );
};

export default Products;
