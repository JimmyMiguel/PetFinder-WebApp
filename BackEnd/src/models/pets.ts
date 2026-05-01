import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/index';
import User from './users';

class Pet extends Model {
  public id!: string;
  public userId!: string;
  public status!: 'ENCONTRADA' | 'EN_ADOPCION' | 'ADOPTADA' | 'DEVUELTA';
  public name?: string | null;
  public animal_type!: string;
  public description!: string;
  public event_date!: Date;
  public location_text!: string;
  // ✅ CORRECCIÓN 1: Se mantiene location_geo en la clase para manejar el objeto Point
  public location_geo!: any; 
  public photos!: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',  
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('ENCONTRADA', 'EN_ADOPCION', 'ADOPTADA', 'DEVUELTA'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,  
    },
    animal_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATEONLY,  
      allowNull: false,
    },
    location_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
    location_geo: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: false,
     },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'pets',
    timestamps: true,
  }
);

User.hasMany(Pet, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'pets',
});

Pet.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

export default Pet;