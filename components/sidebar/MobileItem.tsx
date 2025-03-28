import { cn } from "@/lib/utils";
import Link from "next/link";

interface MobileItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}
const MobileItem = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: MobileItemProps) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      onClick={handleClick}
      href={href}
      className={cn(
        "group flex w-full justify-center gap-x-3 p-4 text-sm leading-6 font-semibold text-gray-500 transition-all hover:bg-gray-100 hover:text-black",
        active && "bg-gray-100 text-black",
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default MobileItem;
