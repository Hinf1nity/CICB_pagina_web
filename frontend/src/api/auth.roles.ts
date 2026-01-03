export type Role = "admin_general" | "Usuario" | "admin_ciudad" | "invitado";

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
    admin_general: [
        "admin.access",
    ],
    admin_ciudad: [
        "admin.users.manage",
    ],
    Usuario: [
        "users.read",
    ],
    invitado: [],
};

export const hasPermission = (
    role: Role | undefined,
    permission: string
): boolean => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.includes(permission);
};
