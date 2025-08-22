export const Roles = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  INVENTORY_VIEWER: "Inventory Viewer",
  INVENTORY_MANAGER: "Inventory Manager",
  SALES_MANAGER: "Sales Manager",
  SALES: "Sales",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export type PageAccess = "inventory" | "sales" | "admin";

export const AccessControl: Record<Role, PageAccess[]> = {
  [Roles.SUPER_ADMIN]: ["inventory", "sales", "admin"],
  [Roles.ADMIN]: ["inventory", "sales"],
  [Roles.INVENTORY_VIEWER]: ["inventory"],
  [Roles.INVENTORY_MANAGER]: ["inventory"],
  [Roles.SALES_MANAGER]: ["sales"],
  [Roles.SALES]: ["sales"],
};

export const hasAccess = (role: string, page: PageAccess): boolean => {
  if (!Object.values(Roles).includes(role as Role)) {
    return false;
  }

  const allowed = AccessControl[role as Role];
  return allowed.includes(page);
};

export const hasAnyAccess = (roles: string[], page: PageAccess) => {
  return roles.some(role => hasAccess(role, page));
};




