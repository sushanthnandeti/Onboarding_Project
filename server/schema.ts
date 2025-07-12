import {
    pgTable,
    pgEnum,
    text, 
    timestamp, 
    integer, 
    boolean
  } from "drizzle-orm/pg-core"
  
  export const SkillLevelEnum = pgEnum("skill_level", [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
    "Master",
  ]);
  
  export const users = pgTable("user", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    firstName: text("firstName"),
    lastName: text("lastName"),
    email: text("email").notNull(),
    password: text("password"),
    aboutMe: text('about_me'),
    streetAddress: text('street_address'),
    city: text('city'),
    state: text('state'),
    zipCode: text('zip_code'),
    birthdate: text('birthdate'),
    currentStep: integer('current_step').default(1),
    isCompleted: boolean('is_completed').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    skillLevel: SkillLevelEnum("skill_level").notNull().default("Beginner"),
  })

