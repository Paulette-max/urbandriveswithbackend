
import { relations } from "drizzle-orm";
import { integer, pgTable, varchar, text, serial, numeric, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: varchar({ length: 255 }).primaryKey(), 
  name: varchar({ length: 255 }),  
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean().default(false),
  image: varchar({ length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});




export const session = pgTable('session', {
  id: varchar({ length: 255 }).primaryKey(),
  userId: varchar({ length: 255 }).notNull().references(()=>user.id),
  token: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar({ length: 255 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const account = pgTable('account', {
  id: varchar({ length: 255 }).primaryKey(),
  userId: varchar({ length: 255 }).notNull().references(()=>user.id),
  accountId: varchar({ length: 255 }).notNull(),
  providerId: varchar({ length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const verifications = pgTable('verification', {
  id: varchar({ length: 255 }).primaryKey(),
  identifier: varchar({ length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const cars = pgTable('cars', {
  id: serial('id').primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price', 10, 2).notNull(),
  platform: varchar({ length: 255 }),
  images: jsonb('images'),
  coverImage: varchar({ length: 255 }),
  sellerId: varchar({ length: 255 }).notNull().references(() => user.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  make: varchar({ length: 255 }).notNull(),
  model: varchar({ length: 255 }).notNull(),
  year: integer('year').notNull(),
  transmission: varchar({ length: 50 }).notNull(),
  fuelType: varchar({ length: 50 }).notNull(),
  seats: integer('seats').notNull(),
  dailyRate: numeric('daily_rate', 10, 2).notNull(),
  weeklyRate: numeric('weekly_rate', 10, 2).notNull(),
  monthlyRate: numeric('monthly_rate', 10, 2).notNull(),
  features: jsonb('features'),
  location: varchar({ length: 255 }).notNull(),
  pickupLocation: varchar({ length: 255 }).notNull(),
});
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  carId: integer('car_id').notNull().references(() => cars.id),
  userId: varchar({ length: 255 }).notNull().references(() => user.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalPrice: numeric('total_price', 10, 2).notNull(),
  status: varchar({ length: 50 }).notNull().default('pending'), // pending, confirmed, cancelled
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
export const carRelations = relations(cars, ({ one }) => ({
  seller: one(user, {
    fields: [cars.sellerId],
    references: [user.id],
  }),
  bookings: one(bookings, {
    fields: [cars.id],
    references: [bookings.carId],
  }),
}));