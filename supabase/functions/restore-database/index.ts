import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Order matters for foreign key constraints
const RESTORE_ORDER = [
  'trainers',
  'trainer_availability',
  'profiles',
  'user_roles',
  'group_classes',
  'class_schedules',
  'site_content',
  'project_slides',
  'leads',
  'chat_conversations',
  'chat_messages',
  'pt_sessions',
  'class_registrations',
  'admin_documents',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify admin
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data: roleData } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const backup = body.backup

    if (!backup || !backup.tables) {
      return new Response(JSON.stringify({ error: 'Invalid backup format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const results: Record<string, { success: boolean; count: number; error?: string }> = {}

    for (const table of RESTORE_ORDER) {
      const rows = backup.tables[table]
      if (!rows || rows.length === 0) {
        results[table] = { success: true, count: 0 }
        continue
      }

      try {
        const { error } = await adminClient.from(table).upsert(rows, {
          onConflict: 'id',
          ignoreDuplicates: false,
        })

        if (error) {
          results[table] = { success: false, count: rows.length, error: error.message }
        } else {
          results[table] = { success: true, count: rows.length }
        }
      } catch (e) {
        results[table] = { success: false, count: rows.length, error: e.message }
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
