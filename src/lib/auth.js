export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  CLIENT: "client",
  VIEWER: "viewer",
};

export const PERMISSIONS = {
  admin:   { canEdit: true,  canManageUsers: true,  canViewAll: true,  canPublish: true  },
  manager: { canEdit: true,  canManageUsers: false, canViewAll: false, canPublish: true  },
  staff:   { canEdit: false, canManageUsers: false, canViewAll: false, canPublish: false },
  client:  { canEdit: false, canManageUsers: false, canViewAll: false, canPublish: false },
  viewer:  { canEdit: false, canManageUsers: false, canViewAll: false, canPublish: false },
};

export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.[permission] ?? false;
};
