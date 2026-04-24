export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  CLIENT: "client",
};

export const PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canManageProjects: true,
    canAssignTasks: true,
    canViewAllProjects: true,
    canDeleteAny: true,
  },
  staff: {
    canManageUsers: false,
    canManageProjects: false,
    canAssignTasks: true,
    canViewAllProjects: false,
    canDeleteAny: false,
  },
  client: {
    canManageUsers: false,
    canManageProjects: false,
    canAssignTasks: false,
    canViewAllProjects: false,
    canDeleteAny: false,
  },
};

export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.[permission] ?? false;
};
