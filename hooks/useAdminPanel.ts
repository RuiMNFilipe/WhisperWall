import { getUsersAction } from "@/actions/get-users";
import { updateUserRoleAction } from "@/actions/update-user-role";
import { Moderator, Role } from "@prisma/client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTempNewUser } from "./useTempNewUser";
import { adminDeleteUserAction } from "@/actions/admin-delete-user";
import { adminAddModAction } from "@/actions/admin-add-mod";

export const useAdminPanel = () => {
  const [usersList, setUsersList] = useState<Moderator[] | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [originalRoleMap, setOriginalRoleMap] = useState<Record<number, Role>>(
    {}
  );
  const [addingUser, setAddingUser] = useState<boolean>(false);
  const {
    resetTempNewUser,
    setTempNewUser,
    tempNewUser,
    updateTempNewUserField,
  } = useTempNewUser();

  useEffect(() => {
    const fetchUsersList = async () => {
      const result = await getUsersAction();

      if (result.success) {
        setUsersList(result.data as Moderator[]);
        const initialRoleMap = (
          result.data as {
            id: number;
            email: string;
            password: string;
            sessionToken: string | null;
            role: Role;
          }[]
        )?.reduce((acc, user) => {
          acc[user.id] = user.role;
          return acc;
        }, {} as Record<number, Role>);

        setOriginalRoleMap(initialRoleMap);
      } else {
        toast.error(result.message);
      }
    };

    fetchUsersList();
  }, []);

  const onConfirmRoleChange = async (id: number, newRole: Role) => {
    const result = await updateUserRoleAction(id, newRole);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleAddUserRow = () => {
    if (!addingUser) {
      const newEmptyUser: Partial<Moderator> = {
        id: -1,
        email: "",
        password: "",
        role: Role.MODERATOR, // default value
      };
      setTempNewUser(newEmptyUser as Moderator);
      setAddingUser(true);
    }
  };

  const handleSaveNewUser = async () => {
    if (!tempNewUser?.email || !tempNewUser?.role) {
      return;
    }

    const formData = new FormData();
    formData.append("email", tempNewUser.email);
    formData.append("role", tempNewUser.role);
    formData.append("password", "test");

    const result = await adminAddModAction(formData);

    if (result.success) {
      toast.success(result.message);
      const updatedUsersResult = await getUsersAction();

      if (updatedUsersResult.success) {
        setUsersList(updatedUsersResult.data as Moderator[]);
      }

      resetTempNewUser();
      setAddingUser(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleCancelNewUser = () => {
    resetTempNewUser();
    setAddingUser(false);
  };

  const handleDeleteUser = async (id: number) => {
    const result = await adminDeleteUserAction(id);

    if (result.success) {
      toast.success(result.message);
      const updatedUsersResult = await getUsersAction();

      if (updatedUsersResult.success) {
        setUsersList(updatedUsersResult.data as Moderator[]);
      }
    } else {
      toast.error(result.message);
    }
  };

  return {
    usersList,
    setUsersList,
    editingRowId,
    setEditingRowId,
    originalRoleMap,
    setOriginalRoleMap,
    addingUser,
    setAddingUser,
    resetTempNewUser,
    setTempNewUser,
    tempNewUser,
    updateTempNewUserField,
    onConfirmRoleChange,
    handleCancelNewUser,
    handleDeleteUser,
    handleSaveNewUser,
    handleAddUserRow,
  };
};
