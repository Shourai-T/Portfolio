import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={20}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-text-secondary"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-[#1e1e1e] text-dark-text rounded-xl border border-white/10 focus:border-white/30 focus:outline-none transition-colors placeholder:text-dark-text-secondary"
      />
    </div>
  );
}
