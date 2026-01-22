-- Add client quotation access via JWT email claim (no direct auth.users access)

begin;

alter table public.quotations enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='quotations' and policyname='Clients can view quotations sent to them'
  ) then
    execute $pol$
      create policy "Clients can view quotations sent to them"
      on public.quotations
      for select
      to authenticated
      using (
        client_email is not null
        and client_email = (auth.jwt() ->> 'email')
      )
    $pol$;
  end if;
end $$;

commit;
