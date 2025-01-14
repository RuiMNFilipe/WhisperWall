import { JSX } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@prisma/client";

interface DropDownMenuProps {
  triggerBtn: string | JSX.Element;
  label: string;
  options: string[];
  onSelect: (option: Role) => void;
}

function DropDownMenu({
  label,
  options,
  triggerBtn,
  onSelect,
}: DropDownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{triggerBtn}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option, idx) => (
          <DropdownMenuItem key={idx} onClick={() => onSelect(option as Role)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropDownMenu;
