import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-blue-400">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-sm font-medium">{text}</p>
        </div>
    );
};

export default Loader;
