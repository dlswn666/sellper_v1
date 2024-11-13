import React, { useRef } from 'react';
import InputComponent from './InputComponent';

export default {
    title: 'Components/InputComponent',
    component: InputComponent,
    argTypes: {
        type: {
            control: 'text',
            description: 'The type of input',
            defaultValue: 'text',
        },
        readOnly: {
            control: 'boolean',
            description: 'Set input to read-only mode',
            defaultValue: false,
        },
        onBlur: { action: 'blurred', description: 'Function to call on blur' },
        onFocus: { action: 'focused', description: 'Function to call on focus' },
    },
};

const Template = (args) => <InputComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    type: 'text',
    readOnly: false,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    type: 'text',
    readOnly: true,
};

export const NumberInput = Template.bind({});
NumberInput.args = {
    type: 'number',
    readOnly: false,
};

export const GroupNavigation = () => {
    const group1 = useRef([]);
    const group2 = useRef([]);

    const handleGroupKeyNavigation = (key, groupKey, currentInput) => {
        const currentIndex = groupKey.current.indexOf(currentInput);

        if (key === 'ArrowUp' && currentIndex > 0) {
            groupKey.current[currentIndex - 1].focus();
        } else if (key === 'ArrowDown' && currentIndex < groupKey.current.length - 1) {
            groupKey.current[currentIndex + 1].focus();
        }
    };

    return (
        <div>
            <h3>Group 1</h3>
            {[...Array(3)].map((_, index) => (
                <InputComponent
                    key={`group1-${index}`}
                    groupKey={group1}
                    onGroupKeyNavigation={handleGroupKeyNavigation}
                    ref={(el) => (group1.current[index] = el)}
                />
            ))}

            <h3>Group 2</h3>
            {[...Array(3)].map((_, index) => (
                <InputComponent
                    key={`group2-${index}`}
                    groupKey={group2}
                    onGroupKeyNavigation={handleGroupKeyNavigation}
                    ref={(el) => (group2.current[index] = el)}
                />
            ))}
        </div>
    );
};
