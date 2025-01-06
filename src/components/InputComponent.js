import React, { useRef, forwardRef, useState, useImperativeHandle } from 'react';
import { Input } from 'antd';

const InputComponent = forwardRef(
    (
        {
            type = 'text',
            readOnly = false,
            onBlur,
            onFocus,
            groupKey,
            onGroupKeyNavigation,
            defaultValue,
            showCount = false,
            maxLength = 100,
            ...props
        },
        ref
    ) => {
        // userRef - React Hook 중 하나. Dom 요소나 값을 기억할 수 있는 방법을 제공
        // useRef는 Dom 요소에 접근하거나 컴포넌트가 다시 렌더링 되어도 값이 변하지 않게 하려고 사용함.
        const inputRef = useRef(null);
        const [value, setValue] = useState(defaultValue || '');

        useImperativeHandle(ref, () => ({
            focus: () => inputRef.current?.focus(),
            setInputValue: (newValue) => setValue(newValue), // 외부에서 접근하여 value를 설정
        }));

        const handleKeyDown = (e) => {
            if (groupKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                onGroupKeyNavigation(e.key, groupKey, inputRef.current);
            }
        };

        const handleChange = (e) => {
            setValue(e.target.value);
        };

        return (
            <Input
                ref={(node) => {
                    inputRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                type={type}
                readOnly={readOnly}
                onBlur={onBlur}
                onFocus={(e) => {
                    if (onFocus) {
                        onFocus(e);
                    }
                    inputRef.current?.select();
                }}
                onKeyDown={handleKeyDown}
                value={value} // Controlled component로 설정
                onChange={handleChange} // 상태 업데이트 핸들러
                showCount={showCount}
                maxLength={maxLength}
                {...props}
            />
        );
    }
);

export default InputComponent;
