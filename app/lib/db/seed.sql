-- https://orm.drizzle.team/kit-docs/conf#sql-breakpoints
-- https://www.answeroverflow.com/m/1193324770092134430
insert into
  roles (role_id)
values
  ('admin'),
  ('customer');

--> statement-breakpoint
insert into
  membership_roles (membership_role_id)
values
  ('owner'),
  ('member');
