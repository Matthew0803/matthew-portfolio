CREATE TABLE `certifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`issuer` text NOT NULL,
	`issue_date` text NOT NULL,
	`expiry_date` text,
	`credential_id` text,
	`credential_url` text,
	`description` text,
	`display_order` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`institution` text NOT NULL,
	`degree` text NOT NULL,
	`field` text NOT NULL,
	`location` text,
	`description` text,
	`gpa` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`current` integer DEFAULT false,
	`display_order` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `experience` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text NOT NULL,
	`position` text NOT NULL,
	`location` text,
	`description` text NOT NULL,
	`logo_url` text,
	`responsibilities` text NOT NULL,
	`achievements` text,
	`technologies` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`current` integer DEFAULT false,
	`show_on_dice` integer DEFAULT false,
	`dice_order` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `experience_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`experience_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`caption` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_url` text NOT NULL,
	`description` text,
	`tag` text,
	`display_order` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `project_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`is_thumbnail` integer DEFAULT false,
	`display_order` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`long_description` text,
	`technologies` text NOT NULL,
	`key_features` text,
	`learnings` text,
	`image_url` text,
	`video_url` text,
	`demo_url` text,
	`github_url` text,
	`show_github` integer DEFAULT false,
	`show_demo` integer DEFAULT false,
	`developing` integer DEFAULT false,
	`featured` integer DEFAULT false,
	`display_order` integer DEFAULT 0,
	`start_date` text,
	`end_date` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`proficiency` integer NOT NULL,
	`icon` text,
	`display_order` integer DEFAULT 0,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
