"use client";

import { useSession, signIn, signOut } from "next-auth/react";
function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed In as {session.user.email}
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }
  return (
    <>
      Not signed In <br />
      <button onClick={() => signIn()}>Sign In</button>
    </>
  );
}

export default Component;
