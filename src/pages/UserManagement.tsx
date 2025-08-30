// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import MainLayout from "@/components/layout/MainLayout";
// import AddUserForm, {
//   AddUserFormValues,
// } from "../components/usermanagement/AddUserForm";
// import {
//   useUsers,
//   useAddUser,
//   useUpdateUser,
//   useDeleteUser,
// } from "@/hooks/users/useUsers";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: "admin" | "test_manager" | "test_engineer";
// }

// export default function UserManagement() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   // Fetch
//   const { data: users, isLoading } = useUsers();

//   // Mutations
//   const addUserMutation = useAddUser();
//   const updateUserMutation = useUpdateUser();
//   const deleteUserMutation = useDeleteUser();

//   const openAddModal = () => {
//     setEditingUser(null);
//     setModalOpen(true);
//   };

//   const openEditModal = (user: User) => {
//     setEditingUser(user);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setEditingUser(null);
//   };

//   // Add
//   const handleAddUser = (data: AddUserFormValues) => {
//     // password is required when adding
//     addUserMutation.mutate(
//       {
//         name: data.name,
//         email: data.email,
//         role: data.role,
//         password: data.password!, // form enforces this on add
//       },
//       {
//         onSuccess: closeModal,
//       }
//     );
//   };

//   // Edit
//   const handleEditUser = (data: AddUserFormValues) => {
//     if (!editingUser) return;
//     updateUserMutation.mutate(
//       {
//         id: editingUser._id,
//         updates: {
//           name: data.name,
//           email: data.email,
//           role: data.role,
//         },
//       },
//       {
//         onSuccess: closeModal,
//       }
//     );
//   };

//   // Delete
//   const handleDeleteUser = (id: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     setDeletingId(id);

//     deleteUserMutation.mutate(id, {
//       onSettled: () => setDeletingId(null), // reset when done
//     });
//   };

//   const isSaving = addUserMutation.isPending || updateUserMutation.isPending;

//   return (
//     <MainLayout>
//       <Card className="w-full">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>User Management</CardTitle>
//           <Button onClick={openAddModal}>+ Add User</Button>
//         </CardHeader>

//         <CardContent>
//           {isLoading ? (
//             <p>Loading users...</p>
//           ) : !users || users.length === 0 ? (
//             <p>No users found</p>
//           ) : (
//             <table className="w-full border-collapse border text-sm">
//               <thead>
//                 <tr className="bg-gray-100 dark:bg-gray-800">
//                   <th className="border px-3 py-2 text-left">Name</th>
//                   <th className="border px-3 py-2 text-left">Email</th>
//                   <th className="border px-3 py-2 text-left">Role</th>
//                   <th className="border px-3 py-2 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user: User) => (
//                   <tr key={user._id}>
//                     <td className="border px-3 py-2">{user.name}</td>
//                     <td className="border px-3 py-2">{user.email}</td>
//                     <td className="border px-3 py-2 capitalize">
//                       {user.role.replace("_", " ")}
//                     </td>
//                     <td className="border px-3 py-2 flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openEditModal(user)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => handleDeleteUser(user._id)}
//                         disabled={
//                           deletingId === user._id &&
//                           deleteUserMutation.isPending
//                         }
//                       >
//                         {deletingId === user._id && deleteUserMutation.isPending
//                           ? "Deleting..."
//                           : "Delete"}
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </CardContent>

//         {/* Single modal reused for Add / Edit */}
//         <Dialog
//           open={modalOpen}
//           onOpenChange={(open) => (open ? setModalOpen(true) : closeModal())}
//         >
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>
//                 {editingUser ? "Edit User" : "Add User"}
//               </DialogTitle>
//               <DialogDescription>
//                 {editingUser
//                   ? "Update the user’s details and role."
//                   : "Create a new user with a role and temporary password."}
//               </DialogDescription>
//             </DialogHeader>

//             <AddUserForm
//               isEdit={!!editingUser}
//               defaultValues={
//                 editingUser
//                   ? {
//                       name: editingUser.name,
//                       email: editingUser.email,
//                       role: editingUser.role,
//                     }
//                   : undefined
//               }
//               onSubmit={editingUser ? handleEditUser : handleAddUser}
//               submitting={isSaving}
//             />
//           </DialogContent>
//         </Dialog>
//       </Card>
//     </MainLayout>
//   );
// }
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import MainLayout from "@/components/layout/MainLayout";
import AddUserForm, {
  AddUserFormValues,
} from "../components/usermanagement/AddUserForm";
import {
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/users/useUsers";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "test_manager" | "test_engineer";
}

export default function UserManagement() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Fetch
  const { data: users, isLoading } = useUsers();

  // Mutations
  const addUserMutation = useAddUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const openAddModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const confirmDeleteUser = (user: User) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    deleteUserMutation.mutate(deletingUser._id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeletingUser(null);
      },
      onSettled: () => setDeletingUser(null),
    });
  };

  // Add
  const handleAddUser = (data: AddUserFormValues) => {
    addUserMutation.mutate(
      {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password!,
      },
      {
        onSuccess: closeModal,
      }
    );
  };

  // Edit
  const handleEditUser = (data: AddUserFormValues) => {
    if (!editingUser) return;
    updateUserMutation.mutate(
      {
        id: editingUser._id,
        updates: {
          name: data.name,
          email: data.email,
          role: data.role,
        },
      },
      {
        onSuccess: closeModal,
      }
    );
  };

  const isSaving = addUserMutation.isPending || updateUserMutation.isPending;

  return (
    <MainLayout>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button onClick={openAddModal}>+ Add User</Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p>Loading users...</p>
          ) : !users || users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-3 py-2 text-left">Name</th>
                  <th className="border px-3 py-2 text-left">Email</th>
                  <th className="border px-3 py-2 text-left">Role</th>
                  <th className="border px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => (
                  <tr key={user._id}>
                    <td className="border px-3 py-2">{user.name}</td>
                    <td className="border px-3 py-2">{user.email}</td>
                    <td className="border px-3 py-2 capitalize">
                      {user.role.replace("_", " ")}
                    </td>
                    <td className="border px-3 py-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeleteUser(user)}
                        disabled={
                          deletingUser?._id === user._id &&
                          deleteUserMutation.isPending
                        }
                      >
                        {deletingUser?._id === user._id &&
                        deleteUserMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>

        {/* Add / Edit Modal */}
        <Dialog
          open={modalOpen}
          onOpenChange={(open) => (open ? setModalOpen(true) : closeModal())}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update the user’s details and role."
                  : "Create a new user with a role and temporary password."}
              </DialogDescription>
            </DialogHeader>

            <AddUserForm
              isEdit={!!editingUser}
              defaultValues={
                editingUser
                  ? {
                      name: editingUser.name,
                      email: editingUser.email,
                      role: editingUser.role,
                    }
                  : undefined
              }
              onSubmit={editingUser ? handleEditUser : handleAddUser}
              submitting={isSaving}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteDialogOpen(false);
              setDeletingUser(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deletingUser?.name}</span>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </MainLayout>
  );
}
