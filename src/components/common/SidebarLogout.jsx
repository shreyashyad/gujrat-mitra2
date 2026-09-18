import { LogOut } from "lucide-react";

export default function SidebarLogout({ onClose }) {
  return (
    <div className="p-4 pb-6">
      <button
        type="button"
        onClick={onClose}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-3
                   bg-red-500/10 dark:bg-red-500/15 backdrop-blur-md
                   text-red-600 dark:text-red-400 border border-red-500/10 dark:border-red-500/20
                   hover:bg-red-500/20 dark:hover:bg-red-500/25
                   active:scale-[0.98] active:opacity-80
                   transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]
                   shadow-xs cursor-pointer"
      >
        <LogOut size={16} strokeWidth={2.25} />
        <span className="font-gu text-sm font-bold">લોગ આઉટ</span>
      </button>
    </div>
  );
}