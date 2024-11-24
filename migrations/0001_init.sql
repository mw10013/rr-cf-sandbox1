-- Migration number: 0001 	 2024-11-24T16:28:45.449Z
create table roles (role_id text primary key);

--> statement-breakpoint
create table membership_roles (membership_role_id text primary key);

--> statement-breakpoint
