import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type AddUserFormValues = {
  name: string;
  email: string;
  password?: string; // required only when adding
  role: "admin" | "test_manager" | "test_engineer";
};

interface AddUserFormProps {
  defaultValues?: Partial<AddUserFormValues>;
  isEdit?: boolean;
  submitting?: boolean;
  onSubmit: (data: AddUserFormValues) => void;
}

export const AddUserSchema = z.object({
  name: z
    .string()

    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be at most 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .optional(), // required only on create
  role: z.enum(["admin", "test_manager", "test_engineer"], {
    errorMap: () => ({ message: "Invalid role selected" }),
  }),
});

const AddUserForm: React.FC<AddUserFormProps> = ({
  defaultValues,
  isEdit = false,
  submitting = false,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "test_engineer",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset({ role: "test_engineer", ...defaultValues });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("name")}
        placeholder="Name"
        className="w-full border rounded p-2"
      />
      {errors.name && (
        <p className="text-red-600 text-sm">{errors.name.message}</p>
      )}

      <input
        {...register("email")}
        placeholder="Email"
        type="email"
        className="w-full border rounded p-2"
      />
      {errors.email && (
        <p className="text-red-600 text-sm">{errors.email.message}</p>
      )}

      {!isEdit && (
        <>
          <input
            {...register("password")}
            placeholder="Temporary Password"
            type="password"
            className="w-full border rounded p-2"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </>
      )}

      <select {...register("role")} className="w-full border rounded p-2">
        <option value="admin">Admin</option>
        <option value="test_manager">Test Manager</option>
        <option value="test_engineer">Test Engineer</option>
      </select>
      {errors.role && (
        <p className="text-red-600 text-sm">{errors.role.message}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {submitting
          ? isEdit
            ? "Updating..."
            : "Adding..."
          : isEdit
          ? "Update User"
          : "Add User"}
      </button>
    </form>
  );
};

export default AddUserForm;
