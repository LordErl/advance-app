import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // 1. Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // 2. Check if the user is a manager by checking their profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_manager')
      .eq('id', user.id)
      .single();

    if (profileError || !profile.is_manager) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden: User is not a manager' }), { status: 403 });
    }

    // 3. Find which teams the manager approves for
    const { data: managedTeams, error: teamsError } = await supabase
      .from('approver_teams')
      .select('team_id')
      .eq('approver_id', user.id);

    if (teamsError) {
      throw teamsError;
    }

    const managedTeamIds = managedTeams.map(t => t.team_id);

    if (managedTeamIds.length === 0) {
      return NextResponse.json([]); // Manager of no teams, return empty array
    }

    // 4. Fetch pending advances for users in those teams
    // We need to join profiles to get the team_id of the user who requested the advance
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
      .filter('profiles.team_id', 'in', `(${managedTeamIds.join(',')})`);

    if (advancesError) {
      // A more complex query like this might fail if relationships aren't set up perfectly.
      // Let's try a simpler, two-step query as a fallback.
      console.warn('Initial query failed, trying fallback:', advancesError.message);

      const { data: teamUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .in('team_id', managedTeamIds);

      if (usersError) throw usersError;
      const teamUserIds = teamUsers.map(u => u.id);

      const { data: fallbackAdvances, error: fallbackError } = await supabase
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

      if (fallbackError) throw fallbackError;
      return NextResponse.json(fallbackAdvances);
    }

    return NextResponse.json(advances);

  } catch (error: any) {
    console.error('Error fetching pending approvals:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}
