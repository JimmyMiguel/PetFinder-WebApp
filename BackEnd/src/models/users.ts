import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/index";

class User extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone: string | null;
  declare profile_picture: string | null;

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // Permite que los usuarios se registren sin dar el teléfono inicialmente
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true, // Crea createdAt y updatedAt
  },
);

export default User;
