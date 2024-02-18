import UserInfo from "@/components/UserInfo";
import { CurrentUser } from "@/lib/auth";
import React from "react";

type Props = {};

export default async function ServerPage({}: Props) {
  const user = await CurrentUser();
  return (
    <div>
      <UserInfo user={user} label="💻 Server Component" />
    </div>
  );
}
