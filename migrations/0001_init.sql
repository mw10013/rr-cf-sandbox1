-- Migration number: 0001 	 2024-11-24T16:28:45.449Z
create table roles (roleId text primary key);

--> statement-breakpoint
insert into
  roles (roleId)
values
  ('admin'),
  ('customer');

--> statement-breakpoint
create table membershipRoles (membershipRoleId text primary key);

--> statement-breakpoint
insert into
  membershipRoles (membershipRoleId)
values
  ('owner'),
  ('member');

--> statement-breakpoint
create table users (
  userId integer primary key,
  email text not null unique,
  name text not null default '',
  role text not null references roles (roleId)
);

--> statement-breakpoint
create table organizations (
  organizationId integer primary key,
  name text not null
);

--> statement-breakpoint
create table memberships (
  organizationId integer not null references organizations (organizationId) on delete cascade,
  userId integer not null references users (userId) on delete cascade,
  membership_role not null references membershipRoles (membershipRoleId),
  primary key (organizationId, userId)
);
