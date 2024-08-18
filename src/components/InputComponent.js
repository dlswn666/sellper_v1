import React, { useRef, forwardRef } from 'react';
import { Input } from 'antd';

const InputComponent = forwardRef(
    ({ type = 'text', readOnly = false, onBlur, onFocus, groupKey, onGroupKeyNavigation, ...props }, ref) => {
        // userRef - React Hook 중 하나. Dom 요소나 값을 기억할 수 있는 방법을 제공
        // useRef는 Dom 요소에 접근하거나 컴포넌트가 다시 렌더링 되어도 값이 변하지 않게 하려고 사용함.
        const inputRef = useRef(null);

        const handleKeyDown = (e) => {
            if (groupKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                onGroupKeyNavigation(e.key, groupKey, inputRef.current);
            }
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
                    inputRef.current.select();
                }}
                onKeyDown={handleKeyDown}
                {...props}
            />
        );
    }
);

export default InputComponent;
