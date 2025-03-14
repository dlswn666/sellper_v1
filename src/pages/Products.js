import React, { useEffect, useRef, useState } from 'react';
import { Space, Row, Col, Steps } from 'antd';
import productNameTestData from '../assets/testData/productNameTestData.js';
import SearchKeywordCardStep from '../components/products/SearchKeywordCardSteps.js';
import SelectWSProductCardSteps from '../components/products/SelectWSProductCardSteps.js';
import ProductNameCardSteps from '../components/products/ProductNameCardSteps.js';
import ProductTageCardSteps from '../components/products/ProductTagCardSteps.js';
import ProductCategoryCardSteps from '../components/products/ProductCategoryCardSteps.js';
import ProductPriceCardSteps from '../components/products/ProductPriceCardSteps.js';
import ProductAttributeCardSteps from '../components/products/ProductAttributeCardSteps.js';
import ProductOptionPriceCardSteps from '../components/products/ProductOptionPriceCardSteps.js';
import ThumbnailUploadCardSteps from '../components/products/ThumbnailUploadCardSteps.js';
import ProductFinalCheckCardSteps from '../components/products/ProductFinalCheckCardSteps.js';

const Products = () => {
    const initImageGroup = [
        'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
    ];

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

    const steps = [
        {
            title: '작업 상품 선택',
            description: (
                <span style={{ fontSize: '10px' }}>
                    가공할 상품을
                    <br />
                    선택해주세요
                </span>
            ),
            content: (
                <SelectWSProductCardSteps
                    searchKeywordUrl={searchKeywordUrl}
                    setSearchKeywordUrl={setSearchKeywordUrl}
                    searchKeywordFocusedIndex={searchKeywordFocusedIndex}
                    setSearchKeywordFocusedIndex={setSearchKeywordFocusedIndex}
                />
            ),
        },
        {
            title: '검색어 등록',
            description: <span style={{ fontSize: '10px' }}>검색어를 입력하세요</span>,
            content: (
                <SearchKeywordCardStep
                    searchKeywordUrl={searchKeywordUrl}
                    setSearchKeywordUrl={setSearchKeywordUrl}
                    searchKeywordFocusedIndex={searchKeywordFocusedIndex}
                    setSearchKeywordFocusedIndex={setSearchKeywordFocusedIndex}
                />
            ),
        },
        {
            title: '상품명 등록',
            description: <span style={{ fontSize: '10px' }}>상품명을 입력하세요</span>,
            content: <ProductNameCardSteps></ProductNameCardSteps>,
        },
        {
            title: '태그 등록',
            description: <span style={{ fontSize: '10px' }}>상품 태그를 입력하세요</span>,
            content: <ProductTageCardSteps></ProductTageCardSteps>,
        },
        {
            title: '카테고리 등록',
            description: '상품명 등록',
            content: <ProductCategoryCardSteps></ProductCategoryCardSteps>,
        },
        {
            title: '기본 가격 설정',
            description: '상품명 등록',
            content: <ProductPriceCardSteps></ProductPriceCardSteps>,
        },
        {
            title: '옵션 설정',
            description: '옵션 설정',
            content: <ProductOptionPriceCardSteps></ProductOptionPriceCardSteps>,
        },
        {
            title: '상품 주요 정보',
            description: '상품 주요 정보 입력',
            content: <ProductAttributeCardSteps></ProductAttributeCardSteps>,
        },
        {
            title: '썸네일 가공',
            description: '상품명 등록',
            content: <ThumbnailUploadCardSteps />,
        },
        {
            title: '최종 확인',
            content: <ProductFinalCheckCardSteps />,
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
