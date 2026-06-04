
export default function Button({ title, onClick, icon, disabled, className }) {
    return <button
        disabled={disabled}
        onClick={onClick}
        className={`${className} bg-[#41431B] hover:bg-[#515422] transition-colors cursor-pointer text-white shadow `}
    >
        {icon}
        {title}
    </button>
}