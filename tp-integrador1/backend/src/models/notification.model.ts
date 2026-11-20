import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user.model";
import { Ticket } from "./ticket.model";

export interface INotificationAttributes {
  id?: number;
  userId: number;
  ticketId: number;
  message: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type NotificationCreationAttributes = Optional<
  INotificationAttributes,
  "id" | "read" | "createdAt" | "updatedAt"
>;

export class Notification
  extends Model<INotificationAttributes, NotificationCreationAttributes>
  implements INotificationAttributes
{
  public id!: number;
  public userId!: number;
  public ticketId!: number;
  public message!: string;
  public read!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tickets",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: true,
  },
);

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

Ticket.hasMany(Notification, { foreignKey: "ticketId", as: "notifications" });
Notification.belongsTo(Ticket, { foreignKey: "ticketId", as: "ticket" });
