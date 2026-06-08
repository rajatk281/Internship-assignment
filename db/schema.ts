import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  email: varchar("email", { length: 255 })
    .unique()
    .notNull(),

  password: varchar("password", { length: 255 })
    .notNull(),

  role: roleEnum("role")
    .default("user")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 })
    .notNull(),

  description: text("description"),

  completed: boolean("completed")
    .default(false)
    .notNull(),

  createdBy: integer("created_by")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
  }),
}));