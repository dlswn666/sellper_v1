import React from 'react';
import CardCompnent from './CardComponent.js';

export default {
    title: 'Example/CardCompnent',
    component: CardCompnent,
};

const Template = (args) => <CardCompnent {...args} />;

export const Default = Template.bind({});

Default.args = {};
