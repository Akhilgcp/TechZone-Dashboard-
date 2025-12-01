import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400">This module is currently under development.</p>
    </div>
);

export default PlaceholderPage;
