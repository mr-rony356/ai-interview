interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      className="lg:hidden relative w-10 h-10 text-white focus:outline-none"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Toggle menu"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-5">
        <span
          className={`absolute block h-0.5 w-full bg-current transform transition-all duration-200 ease-out ${
            isOpen ? "rotate-45 translate-y-2.5" : "translate-y-0"
          }`}
        />
        <span
          className={`absolute block h-0.5 w-full bg-current transform transition-all duration-200 ease-out ${
            isOpen ? "opacity-0" : "translate-y-2"
          }`}
        />
        <span
          className={`absolute block h-0.5 w-full bg-current transform transition-all duration-200 ease-out ${
            isOpen ? "-rotate-45 translate-y-2.5" : "translate-y-4"
          }`}
        />
      </div>
    </button>
  );
}
