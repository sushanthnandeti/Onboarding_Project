import {
    pgTable,
    pgEnum,
    text, 
    timestamp, 
    integer, 
    boolean,
    serial
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
    onsite: text('onsite'),
    compensation: text('compensation'),
  })


export const onboarding_components = pgTable("onboarding_components", {
  id: serial("id").primaryKey(),
  component: text("component").notNull(),
  page: integer("page").notNull(), // 1, 2, or 3
});

export const ALL_COMPONENTS = [
  { key: "aboutMe", label: "About Me" },
  { key: "birthdate", label: "Birthdate" },
  { key: "address", label: "Address" },
  { key: "skillLevel", label: "Skill Level" },
  { key: "onsite", label: "Onsite Willingness" },
  { key: "compensation", label: "Compensation" },
];


