interface FilterBarProps {
  tags: string[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  className?: string;
}

export function FilterBar({
  tags,
  selectedTag,
  onSelectTag,
  className = "",
}: FilterBarProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={`backdrop-blur-sm inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive px-4 py-2 has-[>svg]:px-3 rounded-full text-sm h-8 ${
            selectedTag === tag
              ? "bg-white text-dark-bg hover:bg-white/90"
              : "bg-white/10 text-dark-text hover:bg-white/20"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
