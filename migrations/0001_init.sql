-- Migration number: 0001 	 2024-11-24T16:28:45.449Z
create table roles (role_id text primary key);

--> statement-breakpoint
create table membership_roles (membership_role_id text primary key);

--> statement-breakpoint
create table users (
  user_id integer primary key,
  email text not null unique,
  name text not null default '',
  role text not null references roles (role_id)
);

--> statement-breakpoint
create table organizations (
  organization_id integer primary key,
  name text not null
);

--> statement-breakpoint
create table memberships (
  organization_id integer not null references organizations (organization_id) on delete cascade,
  user_id integer not null references users (user_id) on delete cascade,
  membership_role not null references membership_roles (membership_role_id),
  primary key (organization_id, user_id)
);
