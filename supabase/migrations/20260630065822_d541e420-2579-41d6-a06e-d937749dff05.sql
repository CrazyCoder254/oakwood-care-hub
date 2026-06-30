
-- 1. Private schema not exposed via PostgREST
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 2. Recreate helpers inside private
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION private.get_user_role(_user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
  ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'doctor' THEN 2 ELSE 3 END
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.get_user_role(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.get_user_role(uuid) TO authenticated, service_role;

-- 3. Rewire RLS policies that referenced public.has_role
DROP POLICY IF EXISTS "Profiles viewable by owner or admin" ON public.profiles;
CREATE POLICY "Profiles viewable by owner or admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
CREATE POLICY "Admins update any profile" ON public.profiles
  FOR UPDATE USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage doctors" ON public.doctors;
CREATE POLICY "Admins manage doctors" ON public.doctors
  FOR ALL USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services
  FOR ALL USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage courses" ON public.courses;
CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own enrollments" ON public.course_enrollments;
CREATE POLICY "Users view own enrollments" ON public.course_enrollments
  FOR SELECT USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update enrollments" ON public.course_enrollments;
CREATE POLICY "Admins update enrollments" ON public.course_enrollments
  FOR UPDATE USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own appointments" ON public.appointments;
CREATE POLICY "Users view own appointments" ON public.appointments
  FOR SELECT USING (
    auth.uid() = user_id
    OR private.has_role(auth.uid(), 'admin')
    OR (private.has_role(auth.uid(), 'doctor') AND doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Owner or doctor or admin update appointments" ON public.appointments;
CREATE POLICY "Owner or doctor or admin update appointments" ON public.appointments
  FOR UPDATE USING (
    auth.uid() = user_id
    OR private.has_role(auth.uid(), 'admin')
    OR (private.has_role(auth.uid(), 'doctor') AND doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Admins manage CMS" ON public.cms_sections;
CREATE POLICY "Admins manage CMS" ON public.cms_sections
  FOR ALL USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- 4. Drop the public-exposed helpers now that policies don't depend on them
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.get_user_role(uuid);

-- 5. handle_new_user is a trigger function on auth.users — triggers don't require EXECUTE,
-- so revoke from API roles so it can't be called as an RPC.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
