"use client";
import { FocusEvent, MouseEvent, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import DropdownMenu from "./dropdownMenu";

interface DropdownProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

export default function Dropdown({
  children,
  title,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  let buttonRef = useRef(null);
  return (
    <div className={className + " dropdown"} onBlur={handleBlur}>
      <button className="dropdown-btn" onClick={handleClick} ref={buttonRef}>
        {title}
        <ChevronDownIcon className="w-4 h-4 inline"></ChevronDownIcon>
      </button>
      <DropdownMenu isVisible={open}>{children}</DropdownMenu>
    </div>
  );
  function handleClick(event: MouseEvent) {
    event.preventDefault();
    setOpen(!open);
  }

  function handleBlur(event: FocusEvent) {
    event.preventDefault();
    setOpen(false);
  }
}
