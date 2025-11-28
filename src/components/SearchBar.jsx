import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Search...", onSearch, className = "" }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div
            className={`
                relative flex items-center transition-all duration-300 ease-out
                ${isFocused ? 'w-72 shadow-[0_0_15px_rgba(67,24,255,0.3)]' : 'w-64'}
                ${className}
            `}
        >
            <div className={`
                absolute left-3 transition-colors duration-300
                ${isFocused ? 'text-blue-500' : 'text-gray-400'}
            `}>
                <Search size={18} />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className={`
                    w-full bg-[#111C44] border text-white pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all duration-300
                    ${isFocused
                        ? 'border-blue-500 bg-[#111C44] shadow-inner'
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
                    }
                    placeholder-gray-500
                `}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => onSearch && onSearch(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
