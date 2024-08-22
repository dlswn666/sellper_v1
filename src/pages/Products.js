import React, { useEffect, useRef, useState } from 'react';
import { Space, Row, Col, Steps } from 'antd';
import SearchKeywordCard from '../components/products/SearchKeywordCard';
import ProductNameCard from '../components/products/ProductNameCard';
//검색어 등록 데이터
import testData from '../assets/testData/test';
import productNameTestData from '../assets/testData/productNameTestData';
import ProductKeywordCard from '../components/products/ProductKeywordCard';
import ProductTagCard from '../components/products/ProductTagCard';

const Products = () => {
    const initImageGroup = [
        'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
    ];

    // 검색어 등록 데이터
    const modifiedTestData = testData.map((item) => ({
        ...item,
        images: initImageGroup,
    }));

    const modifiedProductTestData = productNameTestData.map((item) => ({
        ...item,
        images: initImageGroup,
    }));

    // 각 컴포넌트별 포커스 상태와 참조 관리
    const [searchKeywordFocusedIndex, setSearchKeywordFocusedIndex] = useState(0);
    const [searchKeywordUrl, setSearchKeywordUrl] = useState(0);
    const searchKeywordCardRefs = useRef([]);

    const [productNameFocusedIndex, setProductNameFocusedIndex] = useState(0);
    const productNameCardRefs = useRef([]);

    const [productKeywordFocusedIndex, setProductKeywordFocusedIndex] = useState(0);
    const productKeywordCardRefs = useRef([]);

    const [productTagFocusedIndex, setProductTagFocusedIndex] = useState(0);
    const productTagCardRefs = useRef([]);

    const [currentStep, setCurrentStep] = useState(0);

    const handleSearchKeywordKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSearchKeywordFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, modifiedTestData.length - 1);
                searchKeywordCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setSearchKeywordFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                searchKeywordCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
    };

    const handleProductNameKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setProductNameFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, modifiedProductTestData.length - 1);
                productNameCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductNameFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                productNameCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
    };

    const handleProductKeywordKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setProductKeywordFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, modifiedProductTestData.length - 1);
                productKeywordCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductKeywordFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                productKeywordCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
    };

    const handleProductTagKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setProductTagFocusedIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, modifiedProductTestData.length - 1);
                productTagCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            setProductTagFocusedIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                productTagCardRefs.current[newIndex]?.focusInput();
                return newIndex;
            });
        }
    };

    useEffect(() => {
        // 각 스텝에 처음 진입할 때 첫 번째 카드에 포커스
        if (currentStep === 0) {
            searchKeywordCardRefs.current[0]?.focusInput();
        } else if (currentStep === 1) {
            productNameCardRefs.current[0]?.focusInput();
        } else if (currentStep === 3) {
            productKeywordCardRefs.current[0]?.focusInput();
        } else if (currentStep === 4) {
            productTagCardRefs.current[0]?.focusInput();
        }
    }, [currentStep]);

    const onFocusSearchKeywordCard = (index) => {
        setSearchKeywordFocusedIndex(index);
        setSearchKeywordUrl(modifiedTestData[index].siteUrl);
    };

    // 각 스텝의 활성화 상태를 관리할 수 있는 상태 변수 (예시로 두 번째 스텝을 비활성화)
    const [stepDisabledStatus, setStepDisabledStatus] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]);

    const steps = [
        {
            title: '검색어 등록',
            description: <span style={{ fontSize: '10px' }}>검색어를 입력하세요</span>,
            content: (
                <Row>
                    <Col span={12}>
                        <Space
                            direction="vertical"
                            size={'middle'}
                            style={{ display: 'flex' }}
                            onKeyDown={handleSearchKeywordKeyDown}
                            tabIndex={0}
                        >
                            {modifiedTestData.map((item, index) => (
                                <SearchKeywordCard
                                    key={index}
                                    data={item}
                                    isFocused={index === searchKeywordFocusedIndex}
                                    ref={(el) => (searchKeywordCardRefs.current[index] = el)}
                                    onCardFocus={() => onFocusSearchKeywordCard(index)}
                                />
                            ))}
                        </Space>
                    </Col>
                    <Col span={12}>
                        {searchKeywordUrl && (
                            <iframe
                                src={searchKeywordUrl}
                                title="Embedded Webpage"
                                width="100%"
                                height="1200px"
                                style={{
                                    transform: `scale(0.8)`,
                                    transformOrigin: '0 0', // Top-left corner as the origin
                                    width: `${100 / 0.8}%`,
                                    height: '1200px',
                                    border: 'none',
                                }}
                            />
                        )}
                    </Col>
                </Row>
            ),
        },
        {
            title: '상품명 등록',
            description: <span style={{ fontSize: '10px' }}>상품명을 입력하세요</span>,
            content: (
                <Row>
                    <Col span={24}>
                        <Space
                            direction="vertical"
                            size={'middle'}
                            style={{ display: 'flex' }}
                            onKeyDown={handleProductNameKeyDown}
                            tabIndex={0}
                        >
                            {modifiedProductTestData.map((item, index) => (
                                <ProductNameCard
                                    key={index}
                                    data={item}
                                    isFocused={index === productNameFocusedIndex}
                                    ref={(el) => (productNameCardRefs.current[index] = el)}
                                    onCardFocus={() => setProductNameFocusedIndex(index)}
                                />
                            ))}
                        </Space>
                    </Col>
                </Row>
            ),
        },
        {
            title: '키워드 등록',
            description: (
                <span style={{ fontSize: '10px' }}>
                    상품 키워드를 <br /> 입력하세요
                </span>
            ),
            content: (
                <Row>
                    <Col span={24}>
                        <Space
                            direction="vertical"
                            size={'middle'}
                            style={{ display: 'flex' }}
                            onKeyDown={handleProductKeywordKeyDown}
                            tabIndex={0}
                        >
                            {modifiedProductTestData.map((item, index) => (
                                <ProductKeywordCard
                                    key={index}
                                    data={item}
                                    isFocused={index === productKeywordFocusedIndex}
                                    ref={(el) => (productKeywordCardRefs.current[index] = el)}
                                    onCardFocus={() => setProductKeywordFocusedIndex(index)}
                                />
                            ))}
                        </Space>
                    </Col>
                </Row>
            ),
        },
        {
            title: '태그 등록',
            description: <span style={{ fontSize: '10px' }}>상품 태그를 입력하세요</span>,
            content: (
                <Row>
                    <Col span={24}>
                        <Space
                            direction="vertical"
                            size={'middle'}
                            style={{ display: 'flex' }}
                            onKeyDown={handleProductTagKeyDown}
                            tabIndex={0}
                        >
                            {modifiedProductTestData.map((item, index) => (
                                <ProductTagCard
                                    key={index}
                                    data={item}
                                    isFocused={index === productTagFocusedIndex}
                                    ref={(el) => (productTagCardRefs.current[index] = el)}
                                    onCardFocus={() => setProductTagFocusedIndex(index)}
                                />
                            ))}
                        </Space>
                    </Col>
                </Row>
            ),
        },
        {
            title: '카테고리 등록',
            description: '상품명 등록',
            content: <div>상품 선택 컴포넌트 내용</div>,
        },
        {
            title: '가격 설정',
            description: '상품명 등록',
            content: <div>상품 선택 컴포넌트 내용</div>,
        },
        {
            title: '상품 옵션 설정',
            description: '상품명 등록',
            content: <div>상품 선택 컴포넌트 내용</div>,
        },
        {
            title: '썸네일 가공',
            description: '상품명 등록',
            content: <div>상품 선택 컴포넌트 내용</div>,
        },
        {
            title: '최종 확인',
            content: <div>선택한 상품을 확인하는 컴포넌트 내용</div>,
        },
        // 다른 스텝들도 추가 가능
    ];

    return (
        <>
            <Row style={{ margin: '30px 0' }}>
                <Col span={24}>
                    <Steps
                        current={currentStep}
                        onChange={(newStep) => {
                            // 클릭된 스텝이 비활성화 상태가 아니면 스텝을 변경
                            if (!stepDisabledStatus[newStep]) {
                                setCurrentStep(newStep);
                            }
                        }}
                        items={steps.map((step, index) => ({
                            title: step.title,
                            description: step.description,
                            disabled: stepDisabledStatus[index], // 각 스텝의 비활성화 상태 적용
                        }))}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: 24 }}>
                <Col span={24}>{steps[currentStep].content}</Col>
            </Row>
        </>
    );
};

export default Products;
