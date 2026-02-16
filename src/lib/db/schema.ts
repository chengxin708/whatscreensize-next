import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums
export const guideCategoryEnum = pgEnum('guide_category', [
  'tv',
  'monitor',
  'general',
]);

export const pageTypeEnum = pgEnum('page_type', [
  'tv',
  'monitor',
  'guide',
]);

export const voteTypeEnum = pgEnum('vote_type', [
  'best',
  'good',
]);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// TV products table
export const tvProducts = pgTable(
  'tv_products',
  {
    id: serial('id').primaryKey(),
    size_inches: integer('size_inches').notNull(),
    brand: varchar('brand', { length: 100 }).notNull(),
    model: varchar('model', { length: 255 }).notNull(),
    panel_type: varchar('panel_type', { length: 50 }).notNull(),
    resolution: varchar('resolution', { length: 10 }).notNull(),
    price_range: varchar('price_range', { length: 50 }).notNull(),
    features: jsonb('features').notNull(),
    image_url: varchar('image_url', { length: 500 }).default(''),
    link: varchar('link', { length: 500 }).default(''),
    year: integer('year').notNull(),
    sort_order: integer('sort_order').default(0),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
    buy_links: jsonb('buy_links'),
  },
  (table) => [
    index('idx_size_sort').on(table.size_inches, table.sort_order),
  ]
);

// Monitor products table
export const monitorProducts = pgTable(
  'monitor_products',
  {
    id: serial('id').primaryKey(),
    spec_key: varchar('spec_key', { length: 50 }).notNull(),
    brand: varchar('brand', { length: 100 }).notNull(),
    model: varchar('model', { length: 255 }).notNull(),
    panel_type: varchar('panel_type', { length: 50 }).notNull(),
    refresh_rate: varchar('refresh_rate', { length: 20 }).notNull(),
    price_range: varchar('price_range', { length: 50 }).notNull(),
    features: jsonb('features').notNull(),
    tags: jsonb('tags').notNull(),
    image_url: varchar('image_url', { length: 500 }).default(''),
    link: varchar('link', { length: 500 }).default(''),
    year: integer('year').notNull(),
    sort_order: integer('sort_order').default(0),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
    buy_links: jsonb('buy_links'),
  },
  (table) => [
    index('idx_spec_sort').on(table.spec_key, table.sort_order),
  ]
);

// Guides table
export const guides = pgTable(
  'guides',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    category: guideCategoryEnum('category').notNull().default('general'),
    reading_time: integer('reading_time').default(5),
    file_path: varchar('file_path', { length: 255 }).notNull(),
    icon_name: varchar('icon_name', { length: 50 }).default('document'),
    gradient_from: varchar('gradient_from', { length: 20 }).default('#6366f1'),
    gradient_to: varchar('gradient_to', { length: 20 }).default('#8b5cf6'),
    sort_order: integer('sort_order').default(0),
    is_published: boolean('is_published').default(true),
    published_at: timestamp('published_at').defaultNow(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('idx_category').on(table.category),
    index('idx_published').on(table.is_published, table.published_at),
    index('idx_sort').on(table.sort_order),
  ]
);

// Page analytics table
export const pageAnalytics = pgTable(
  'page_analytics',
  {
    id: serial('id').primaryKey(),
    page_type: pageTypeEnum('page_type').notNull(),
    page_identifier: varchar('page_identifier', { length: 100 }),
    session_id: varchar('session_id', { length: 64 }),
    ip_address: varchar('ip_address', { length: 45 }),
    user_agent: text('user_agent'),
    visited_at: timestamp('visited_at').defaultNow(),
  },
  (table) => [
    index('idx_page_type').on(table.page_type),
    index('idx_visited_at').on(table.visited_at),
    index('idx_session').on(table.session_id, table.page_type),
  ]
);

// TV votes table
export const tvVotes = pgTable(
  'tv_votes',
  {
    id: serial('id').primaryKey(),
    vote_type: voteTypeEnum('vote_type').notNull(),
    session_id: varchar('session_id', { length: 64 }).notNull(),
    ip_address: varchar('ip_address', { length: 45 }),
    voted_at: timestamp('voted_at').defaultNow(),
  },
  (table) => [
    index('idx_vote_type').on(table.vote_type),
    uniqueIndex('unique_session_vote').on(table.session_id),
  ]
);
