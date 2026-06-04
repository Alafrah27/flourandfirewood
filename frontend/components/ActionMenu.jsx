import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { EllipsisVertical } from 'lucide-react';

function ActionMenu({ actions }) {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    // Calculate portal menu position relative to the trigger button
    const updatePosition = useCallback(() => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        // Position the menu above the button (drop-up)
        setMenuPos({
            top: rect.top + window.scrollY,
            left: rect.right + window.scrollX,
        });
    }, []);

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event) {
            if (
                btnRef.current && !btnRef.current.contains(event.target) &&
                menuRef.current && !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        function handleScroll() {
            setIsOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isOpen]);

    // Update position when opened
    useEffect(() => {
        if (isOpen) updatePosition();
    }, [isOpen, updatePosition]);

    return (
        <>
            <button
                ref={btnRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center ${
                    isOpen
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Actions"
            >
                <EllipsisVertical size={16} />
            </button>

            {isOpen &&
                createPortal(
                    <div
                        ref={menuRef}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: menuPos.top,
                            left: menuPos.left,
                            transform: 'translate(-100%, -100%)',
                            zIndex: 9999,
                        }}
                        className="w-36 bg-[#12130c]/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 backdrop-blur-md text-left"
                    >
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                    action.onClick();
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-all text-left cursor-pointer ${
                                    action.danger
                                        ? 'text-rose-400 hover:bg-rose-500/10 border-t border-white/5'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {action.icon && <action.icon size={14} className="flex-shrink-0 text-slate-400" />}
                                {action.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    );
}

export default ActionMenu;
