import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const advanceId = params.id;
  const { reason } = await request.json(); // Expect a reason for rejection in the body

  if (!reason) {
    return new NextResponse(JSON.stringify({ error: 'Bad Request: Rejection reason is required.' }), { status: 400 });
  }

  try {
    // 1. Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // 2. Fetch the advance to check if the current user is the assigned approver
    const { data: advance, error: fetchError } = await supabase
      .from('travel_advances')
      .select('assigned_approver_id, status')
      .eq('id', advanceId)
      .single();

    if (fetchError) {
        return new NextResponse(JSON.stringify({ error: 'Advance not found' }), { status: 404 });
    }

    // 3. Security Check: Is the user the assigned approver and is the status correct?
    if (advance.assigned_approver_id !== user.id) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden: You are not the approver for this request.' }), { status: 403 });
    }
    if (advance.status !== 'pending_approval') {
      return new NextResponse(JSON.stringify({ error: `Conflict: This advance is already in status '${advance.status}'.` }), { status: 409 });
    }

    // 4. Update the advance status to 'rejected'
    const { data: updatedAdvance, error: updateError } = await supabase
      .from('travel_advances')
      .update({
        status: 'rejected',
        rejection_reason: reason
      })
      .eq('id', advanceId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedAdvance);

  } catch (error: any) {
    console.error('Error rejecting advance:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}
