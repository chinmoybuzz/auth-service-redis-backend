import User from "./User.model.js";
import Post from "./Post.model.js";
import Role from "./Role.model.js";
import UserToken from "./UserToken.js";

// User - Post
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
});

// Role - User (1 role → many users)
Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users",
});

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

//user - refresh token (1 user -> many token)
User.hasMany(UserToken, {
  foreignKey: "userId",
  as: "tokens",
});
UserToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
