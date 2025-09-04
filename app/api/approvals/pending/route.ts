import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_manager')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.is_manager) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden: User is not a manager' }), { status: 403 });
    }

    const { data: managedTeams, error: teamsError } = await supabase
      .from('approver_teams')
      .select('team_id')
      .eq('approver_id', user.id);

    if (teamsError) throw teamsError;

    const managedTeamIds = managedTeams.map((t: { team_id: string }) => t.team_id);
    if (managedTeamIds.length === 0) {
      return NextResponse.json([]);
    }

    // Step 1: Get all user IDs from the teams managed by the approver.
    // This is more robust with RLS than filtering on a join.
    const { data: teamUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .in('team_id', managedTeamIds);

    if (usersError) throw usersError;
    
    const teamUserIds = teamUsers.map((u: { id: string }) => u.id);
    if (teamUserIds.length === 0) {
        return NextResponse.json([]); // No users in the managed teams
    }

    // Step 2: Fetch advances for those specific user IDs.
    const { data: advances, error: advancesError } = await supabase
      .from('travel_advances')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .in('status', ['pending_approval'])
      .in('user_id', teamUserIds);

    if (advancesError) throw advancesError;

    return NextResponse.json(advances);

  } catch (error: any) {
    console.error('Error fetching pending approvals:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}