"use client";

import { logout } from "@/actions/logout";

type Props = {
  children?: React.ReactNode;
};

export default function LogoutButton({ children }: Props) {
  const onClick = () => {
    logout();
  };
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
}
