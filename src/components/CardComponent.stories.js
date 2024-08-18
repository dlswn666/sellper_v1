import React from 'react';
import CardCompnent from './CardComponent';

export default {
    title: 'Example/CardCompnent',
    component: CardCompnent,
};

const Template = (args) => <CardCompnent {...args} />;

export const Default = Template.bind({});

Default.args = {};
