import { Model, DataTypes, Sequelize } from 'sequelize';
import {sequelize} from '../config/index'; 

class User extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public profile_picture?: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
      // Aquí guardarás la URL de Firebase Storage
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true, // Crea createdAt y updatedAt
  }
);

export default User;