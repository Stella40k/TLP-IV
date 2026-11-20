import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user.model";
import { Ticket } from "./ticket.model";

export interface ISubscriptionAttributes {
  id?: number;
  userId: number;
  ticketId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type SubscriptionCreationAttributes = Optional<
  ISubscriptionAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class Subscription
  extends Model<ISubscriptionAttributes, SubscriptionCreationAttributes>
  implements ISubscriptionAttributes
{
  public id!: number;
  public userId!: number;
  public ticketId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subscription.init(
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
  },
  {
    sequelize,
    tableName: "subscriptions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "ticketId"],
      },
    ],
  },
);

User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions" });
Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });

Ticket.hasMany(Subscription, { foreignKey: "ticketId", as: "subscriptions" });
Subscription.belongsTo(Ticket, { foreignKey: "ticketId", as: "ticket" });
