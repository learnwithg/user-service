export const rolesAndPermissions = [
  {
    role: 'super-admin',
    appScopes: ['all'],
    permissions: ['allow.all'],
  },
  {
    role: 'sub-admin',
    appScopes: ['all'],
    Permissions: [],
  },
  {
    role: 'manage-users',
    appScopes: ['all'],
    Permissions: [
      'users.view',
      'user.view',
      'user.create',
      'user.update',
      'user.delete',
    ],
  },
];
