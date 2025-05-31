import { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  options: string[];
  onSelect: (selected: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, placeholder = 'Select option' }) => {
  // 1. Refs and state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // 2. Event handlers
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  // 3. Side effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left w-48" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full px-4 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white text-sm hover:bg-gray-100"
      >
        {selectedOption || placeholder} <span className='text-bold'>^</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 list-none">
          <div className="py-1">
            {options.map((option) => (
              <li
                key={option}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

