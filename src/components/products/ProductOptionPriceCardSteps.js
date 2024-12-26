import { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Empty, Affix, Button, Input, Tooltip, Space, Divider, Typography, Radio, message } from 'antd';
import { SaveOutlined, InfoCircleOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search.js';
import { getProductOption } from '../../apis/productsApi.js';
import ProductOptionPriceCard from './ProductOptionPriceCard.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js';
import { v4 as uuidv4 } from 'uuid';
import { postOptionSettings, getOptionSettings } from '../../apis/productsApi.js';

const ProductOptionPriceCardSteps = () => {
    const [searchLoading, setSearchLoading] = useState(false);
    const [productOptionData, setProductOptionData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { page, setPage, setLoading } = useInfiniteScroll(hasMore);
    const productOptionCardRefs = useRef([]);
    const [prevIndex, setPrevIndex] = useState(0);
    const [productOptionFocusedIndex, setProductOptionFocusedIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [optionEditData, setOptionEditData] = useState({});
    const [optionRow, setOptionRow] = useState([{ optionId: uuidv4(), optionName: '색상', optionValue: '레드' }]);
    const [optionSettings, setOptionSettings] = useState([]);
    const [optionType, setOptionType] = useState('single');

    const { Text } = Typography;

    useEffect(() => {
        getProductOptionData();
    }, []);

    useEffect(() => {
        if (page > 1 && !searchLoading) {
            getProductOptionData();
        }
    }, [page]);

    useEffect(() => {
        if (productOptionData && productOptionData.length > 0) {
            initializeFirstCard();
        }
    }, [productOptionData]);

    const initializeFirstCard = () => {
        setTimeout(() => {
            productOptionCardRefs.current[0]?.focusInput();
            onFocusProductOptionCard(0);
        }, 100);
    };

    const onFocusProductOptionCard = (index) => {
        setPrevIndex(index);
        setProductOptionFocusedIndex(index);
        handleOptionData(index);
        setOptionType('single');
        setOptionSettings([]);
    };

    const handleOptionData = async (index) => {
        if (!productOptionData || !productOptionData[index]) {
            setOptionRow([
                {
                    optionId: uuidv4(),
                    optionName: '옵션명',
                    optionValue: '옵션값',
                    optionPrice: 0,
                },
            ]);
            setOptionEditData({
                marginPercent: 30,
                optionPrice: '+300, +200, +300',
            });
            return;
        }

        const optionData = {
            ...productOptionData[index],
            marginPercent: 30,
        };

        // 옵션 가격 임의 설정 test
        optionData.optionPrice = '+300, +200, +300';
        let optionPrice = optionData.optionPrice.split(',');
        optionPrice = optionPrice.map((price) => parseInt(price));

        let optionValueJoin = '';

        // optionProduct가 존재하는 경우에만 처리
        if (optionData.optionProduct && Array.isArray(optionData.optionProduct)) {
            //옵션 값 설정
            optionData.optionProduct.forEach((option, index) => {
                if (index === optionData.optionProduct.length - 1) {
                    optionValueJoin += `${option.optionValue} : ${parseInt(option.optionPrice)}`;
                } else {
                    optionValueJoin += `${option.optionValue} : ${parseInt(option.optionPrice)}\r\n`;
                }
            });
            optionData.optionValueJoin = optionValueJoin;

            //옵션 설정 정보 조회
            const productId = productOptionData[index].productId;
            const wholesaleProductId = productOptionData[index].wholesaleProductId;
            const createUser = 'sellper';
            const platform = 'all';

            const param = {
                productsId: productId,
                wholesaleProductId: wholesaleProductId,
                platform: platform,
                createUser: createUser,
            };
            const optionSettingsData = await getOptionSettings(param);

            if (optionSettingsData.length > 0) {
                if (optionSettingsData[0].optionType === 'single') {
                    setOptionType('single');
                    const optionRowData = optionSettingsData.reduce((acc, option) => {
                        const existingOption = acc.find((o) => o.optionName === option.optionName);
                        if (existingOption) {
                            existingOption.optionValue += `,${option.optionValue}`;
                        } else {
                            acc.push(option);
                        }
                        return acc;
                    }, []);
                    setOptionRow(optionRowData);
                } else if (optionSettingsData[0].optionType === 'combination') {
                    setOptionType('combination');
                    const combinationOption = [];
                    const optionNameArry = optionSettingsData[0].optionName.split('/');
                    for (let i = 0; i < optionNameArry.length; i++) {
                        const optionValueArry = [];
                        optionSettingsData.forEach((option) => {
                            optionValueArry.push(option.optionValue.split('/')[i]);
                        });
                        //optionValueArry 중복 제거
                        const uniqueOptionValueArry = optionValueArry.filter(
                            (value, index, self) => self.indexOf(value) === index
                        );

                        combinationOption.push({
                            optionId: uuidv4(),
                            optionName: optionNameArry[i],
                            optionValue: uniqueOptionValueArry.join(','),
                            optionPrice: 0,
                        });
                    }
                    setOptionRow(combinationOption);
                }
            } else {
                const optionRowData = optionData.optionProduct.map((option) => ({
                    optionId: option.optionId || uuidv4(),
                    optionName: option.optionName,
                    optionValue: option.optionValue,
                    optionPrice: option.optionPrice,
                    productId: productId,
                }));
                setOptionRow(optionRowData);
            }
        } else {
            // optionProduct가 없는 경우 기본값 설정
            setOptionRow([
                {
                    optionId: uuidv4(),
                    optionName: '옵션명',
                    optionValue: '옵션값',
                    optionPrice: 0,
                },
            ]);
        }

        setOptionEditData(optionData);
    };

    const handleAddOptionRow = (flag, optionId) => {
        if (flag === 'add') {
            setOptionRow((prev) => [
                ...prev,
                {
                    optionId: uuidv4(),
                    optionName: '',
                    optionValue: '',
                    optionPrice: 0,
                    optionStock: 100,
                },
            ]);
        } else if (flag === 'remove') {
            // optionId가 일치하는 항목 제거
            setOptionRow((prev) => prev.filter((item) => item.optionId !== optionId));
        }
    };

    const handleEditOptionRow = (index, key, value) => {
        setOptionRow((prev) => prev.map((item) => (item.optionId === index ? { ...item, [key]: value } : item)));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setHasMore(true);
        setProductOptionData([]);
        setPage(1);
        getProductOptionData(value);
    };

    const getProductOptionData = async (productId, isLoadMore = false) => {
        if (searchLoading) return;
        setSearchLoading(true);
        try {
            const response = await getProductOption(productId, 100, isLoadMore ? page : 1);
            if (!isLoadMore) {
                setProductOptionData(response.data);
                setProductOptionFocusedIndex(0);
            } else {
                setProductOptionData((prev) => [...prev, ...response.data]);
            }
            setHasMore(response.data.length >= 100);
        } catch (error) {
            console.error('Error fetching product option data:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    const handleSave = async () => {
        //옵션 설정 값 가져오기
        //optionSettings에 optionType 추가
        optionSettings.forEach((option) => {
            option.optionPrice = parseInt(option.optionPrice);
            option.optionType = optionType;
        });
        const result = await postOptionSettings(optionSettings);
        if (result.success) {
            message.success(result.message);
        } else {
            message.error(result.message);
        }
    };

    const handlePriceChange = (index, key, value) => {
        setOptionEditData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleApplyOptionRow = () => {
        if (optionType === 'single') {
            // 단독 옵션 처리
            const newOptionSettings = optionRow.flatMap((item) => {
                // optionValue가 존재하는 경우에만 split 실행
                const values = Array.isArray(item.optionValue)
                    ? item.optionValue
                    : item.optionValue
                      ? item.optionValue.split(',')
                      : [];
                return values.map((value) => ({
                    optionId: uuidv4(),
                    optionName: item.optionName || '',
                    optionValue: value.trim(),
                    optionPrice: item.optionPrice || 0,
                    optionStock: item.optionStock || 100,
                    wholesaleProductId: optionEditData?.wholesaleProductId,
                    productsId: optionEditData?.productId,
                    platform: 'all',
                    createUser: 'sellper',
                    updateUser: 'sellper',
                }));
            });
            setOptionSettings(newOptionSettings);
        } else {
            // 조합 옵션 처리
            const optionCombinations = optionRow
                .map((item) => ({
                    optionName: item.optionName || '',
                    optionValues: item.optionValue
                        ? item.optionValue.length > 0
                            ? item.optionValue.split(',')
                            : []
                        : [],
                }))
                .filter((item) => item.optionValues.length > 0);

            const generateCombinations = (arr) => {
                if (arr.length === 0) return [];

                return arr.reduce((acc, current) => {
                    if (acc.length === 0) {
                        return current.optionValues.map((value) => [
                            { optionName: current.optionName, optionValue: value },
                        ]);
                    }

                    return acc.flatMap((combo) =>
                        current.optionValues.map((value) => [
                            ...combo,
                            { optionName: current.optionName, optionValue: value },
                        ])
                    );
                }, []);
            };

            const combinations = generateCombinations(optionCombinations);

            const newOptionSettings = combinations.map((combo) => ({
                optionId: uuidv4(),
                optionName: combo.map((c) => c.optionName).join('/'),
                optionValue: combo.map((c) => c.optionValue).join('/'),
                optionPrice: 0,
                optionStock: 100,
                productsId: optionEditData?.productId,
                wholesaleProductId: optionEditData?.wholesaleProductId,
                platform: 'all',
                createUser: 'sellper',
            }));

            setOptionSettings(newOptionSettings);
        }
    };

    // 옵션 설정 정보 수정 함수
    const handleOptionSettingChange = (optionId, field, value) => {
        setOptionSettings((prev) =>
            prev.map((option) => (option.optionId === optionId ? { ...option, [field]: value } : option))
        );
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row style={{ marginBottom: '16px' }}>
                <Col span={24}>
                    <Search
                        placeholder="상품 검색어를 입력해 주세요"
                        enterButton="Search"
                        size="large"
                        loading={searchLoading}
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title={`작업 상품 목록 (${productOptionData.length}개)`}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                            {productOptionData.length > 0 ? (
                                productOptionData.map((item, index) => (
                                    <ProductOptionPriceCard
                                        key={item.productOptionId}
                                        data={item}
                                        isFocused={productOptionFocusedIndex === index}
                                        onCardFocus={() => onFocusProductOptionCard(index)}
                                        ref={(el) => (productOptionCardRefs.current[index] = el)}
                                    />
                                ))
                            ) : (
                                <Empty description="검색 결과가 없습니다" />
                            )}
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Affix offsetTop={24}>
                        <Card
                            title="가격 설정 정보"
                            onKeyDown={handleKeyPress}
                            style={{
                                maxHeight: 'calc(100vh - 200px)',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                        >
                            {optionEditData ? (
                                <div>
                                    <div
                                        style={{
                                            marginBottom: 16,
                                            padding: '20px',
                                            background: '#f8f9fa',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div style={{ flex: 2 }}>
                                                <h2
                                                    style={{
                                                        color: '#1890ff',
                                                        marginBottom: '4px',
                                                        fontSize: '16px',
                                                    }}
                                                >
                                                    상품 이름
                                                </h2>
                                                <p
                                                    style={{
                                                        fontSize: '20px',
                                                        fontWeight: 500,
                                                        color: '#262626',
                                                        margin: 0,
                                                    }}
                                                >
                                                    {optionEditData?.productName}
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    width: '1px',
                                                    height: '100%',
                                                    background: '#e8e8e8',
                                                    margin: '0 24px',
                                                }}
                                            ></div>
                                            <div style={{ flex: 1 }}>
                                                <h2
                                                    style={{
                                                        color: '#1890ff',
                                                        marginBottom: '4px',
                                                        fontSize: '16px',
                                                    }}
                                                >
                                                    판매가
                                                </h2>
                                                <p
                                                    style={{
                                                        fontSize: '20px',
                                                        fontWeight: 500,
                                                        color: '#262626',
                                                        margin: 0,
                                                    }}
                                                >
                                                    {optionEditData?.productPrice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider className="divider" />
                                    <h3>옵션별 판매 가격</h3>
                                    <Space
                                        direction="vertical"
                                        size="middle"
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            minHeight: 'calc(100vh - 200px)',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        <Card
                                            key={optionEditData.productOptionId}
                                            size="small"
                                            className="platform-price-card"
                                            actions={[
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        marginRight: '16px',
                                                    }}
                                                >
                                                    <Button
                                                        type="primary"
                                                        icon={<SaveOutlined />}
                                                        size="small"
                                                        style={{ width: '100px', height: '40px' }}
                                                        onClick={() => handleSave(productOptionFocusedIndex)}
                                                    >
                                                        저장
                                                    </Button>
                                                </div>,
                                            ]}
                                        >
                                            <h3>옵션 설정</h3>
                                            <Row style={{ marginBottom: '16px' }}>
                                                <Col span={24}>
                                                    <Radio.Group
                                                        value={optionType}
                                                        onChange={(e) => setOptionType(e.target.value)}
                                                        style={{ marginBottom: '16px' }}
                                                    >
                                                        <Radio.Button value="single">단독 옵션</Radio.Button>
                                                        <Radio.Button value="combination">조합 옵션</Radio.Button>
                                                    </Radio.Group>
                                                    <Text type="secondary" style={{ marginLeft: '16px' }}>
                                                        {optionType === 'single'
                                                            ? '단독 옵션: 각 옵션값이 독립적으로 생성됩니다.'
                                                            : '조합 옵션: 입력한 옵션값들의 모든 조합이 생성됩니다.'}
                                                    </Text>
                                                </Col>
                                            </Row>
                                            {optionRow.map((item) => (
                                                <Row
                                                    key={item.optionId}
                                                    gutter={[16, 16]}
                                                    justify="space-between"
                                                    align="middle"
                                                >
                                                    <Col span={10}>
                                                        <div className="price-input-group">
                                                            <Text type="secondary">옵션 이름</Text>
                                                            <Input
                                                                value={item.optionName}
                                                                onChange={(e) =>
                                                                    handleEditOptionRow(
                                                                        item.optionId,
                                                                        'optionName',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col span={10}>
                                                        <div className="price-input-group">
                                                            <Text type="secondary">옵션 값</Text>
                                                            <Input
                                                                value={item.optionValue}
                                                                onChange={(e) =>
                                                                    handleEditOptionRow(
                                                                        item.optionId,
                                                                        'optionValue',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                addonAfter={
                                                                    <Tooltip
                                                                        title={
                                                                            <>
                                                                                여러 옵션 있을 경우 &nbsp;&nbsp; <br />
                                                                                , 로 구분해 주세요 &nbsp;&nbsp; <br />
                                                                                예) 색상, 사이즈
                                                                            </>
                                                                        }
                                                                    >
                                                                        <InfoCircleOutlined />
                                                                    </Tooltip>
                                                                }
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col span={2}>
                                                        <Space>
                                                            <Button
                                                                type="primary"
                                                                icon={<PlusOutlined />}
                                                                onClick={() => handleAddOptionRow('add')}
                                                            />
                                                            <Button
                                                                type="default"
                                                                icon={<MinusOutlined />}
                                                                onClick={() =>
                                                                    handleAddOptionRow('remove', item.optionId)
                                                                }
                                                                disabled={optionRow.length === 1}
                                                            />
                                                        </Space>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Row justify="end">
                                                <Col
                                                    span={3}
                                                    style={{
                                                        marginTop: '16px',
                                                        marginBottom: '16px',
                                                        justifyContent: 'flex-end',
                                                    }}
                                                >
                                                    <Button
                                                        type="primary"
                                                        onClick={handleApplyOptionRow}
                                                        style={{ width: '80px' }}
                                                    >
                                                        적용
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Divider className="divider" />
                                            <h3>옵션 마진 설정</h3>
                                            <Row justify="space-between" align="middle" gutter={[16, 16]}>
                                                <Col span={24}>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={12}>
                                                            <div className="price-input-group">
                                                                <Text type="secondary">옵션 단순 마진율</Text>
                                                                <Input
                                                                    value={optionEditData.marginPercent}
                                                                    onChange={(e) => {
                                                                        handlePriceChange(
                                                                            productOptionFocusedIndex,
                                                                            'marginPercent',
                                                                            e.target.value
                                                                        );
                                                                    }}
                                                                    suffix="%"
                                                                    addonAfter={
                                                                        <Tooltip title="도매 판매가 옵션에 대한 단순 마진율입니다">
                                                                            <InfoCircleOutlined />
                                                                        </Tooltip>
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col span={12}>
                                                            <div className="price-input-group">
                                                                <Text type="secondary">옵션 단순 마진액</Text>
                                                                <Input
                                                                    value={optionEditData.marginPrice}
                                                                    disabled
                                                                    suffix="원"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Divider className="divider" />
                                            <h3>옵션 설정 정보</h3>
                                            <div style={{ marginTop: '16px' }}>
                                                {optionSettings.length > 0 ? (
                                                    optionSettings.map((option) => (
                                                        <Row
                                                            key={option.optionId}
                                                            gutter={[16, 16]}
                                                            align="middle"
                                                            style={{ marginBottom: '16px' }}
                                                        >
                                                            <Col span={5}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">옵션 이름</Text>
                                                                    <Input value={option.optionName} disabled />
                                                                </div>
                                                            </Col>
                                                            <Col span={7}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">옵션 값</Text>
                                                                    <Input value={option.optionValue} disabled />
                                                                </div>
                                                            </Col>
                                                            <Col span={6}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">옵션 가격</Text>
                                                                    <Input
                                                                        value={option.optionPrice}
                                                                        onChange={(e) =>
                                                                            handleOptionSettingChange(
                                                                                option.optionId,
                                                                                'optionPrice',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        suffix="원"
                                                                        type="number"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={6}>
                                                                <div className="price-input-group">
                                                                    <Text type="secondary">재고</Text>
                                                                    <Input
                                                                        value={option.optionStock}
                                                                        onChange={(e) =>
                                                                            handleOptionSettingChange(
                                                                                option.optionId,
                                                                                'optionStock',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        type="number"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))
                                                ) : (
                                                    <Empty description="옵션을 적용해주세요" />
                                                )}
                                            </div>
                                        </Card>
                                    </Space>
                                </div>
                            ) : (
                                <Empty description="검색 결과가 없습니다" />
                            )}
                        </Card>
                    </Affix>
                </Col>
            </Row>
        </div>
    );
};

export default ProductOptionPriceCardSteps;
