const allRoles = {
  user:  ['getUsers', 'manageUsers','getTags','manageTags','getDomains','manageDomains'],
  admin: ['getUsers', 'manageUsers','getTags','manageTags','getDomains','manageDomains'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
