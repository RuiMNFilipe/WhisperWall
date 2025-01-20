"use client";

import { Moderator } from "@prisma/client";
import { useState } from "react";

interface TempNewUserState {
  tempNewUser: Partial<Moderator> | null;
  setTempNewUser: React.Dispatch<
    React.SetStateAction<Partial<Moderator> | null>
  >;
  resetTempNewUser: () => void;
  updateTempNewUserField: <K extends keyof Moderator>(
    field: K,
    value: Moderator[K]
  ) => void;
}

export const useTempNewUser = (): TempNewUserState => {
  const [tempNewUser, setTempNewUser] = useState<Partial<Moderator> | null>(
    null
  );

  const resetTempNewUser = () => {
    setTempNewUser(null);
  };

  const updateTempNewUser = <K extends keyof Moderator>(
    field: K,
    value: Moderator[K]
  ) => {
    setTempNewUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    tempNewUser,
    setTempNewUser,
    resetTempNewUser,
    updateTempNewUserField: updateTempNewUser,
  };
};
