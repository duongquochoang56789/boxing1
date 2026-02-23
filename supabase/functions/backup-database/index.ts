import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TABLES = [
  'trainers',
  'trainer_availability',
  'profiles',
  'user_roles',
  'group_classes',
  'class_schedules',
  'class_registrations',
  'site_content',
  'project_slides',
  'leads',
  'chat_conversations',
  'chat_messages',
  'pt_sessions',
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

    // Verify the user is admin
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

    // Check admin role
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

    // Fetch all tables
    const tables: Record<string, unknown[]> = {}
    for (const table of TABLES) {
      const { data, error } = await adminClient.from(table).select('*')
      if (error) {
        console.error(`Error fetching ${table}:`, error.message)
        tables[table] = []
      } else {
        tables[table] = data || []
      }
    }

    const backup = {
      version: '1.0',
      created_at: new Date().toISOString(),
      project: 'flyfit',
      tables,
    }

    const backupJson = JSON.stringify(backup, null, 2)
    const fileName = `backup-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`

    // Save to storage bucket
    const { error: uploadError } = await adminClient.storage
      .from('backups')
      .upload(fileName, new Blob([backupJson], { type: 'application/json' }), {
        contentType: 'application/json',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError.message)
    }

    // Also return the backup data for direct download
    const url = req.url
    const params = new URL(url).searchParams
    const action = params.get('action')

    if (action === 'list') {
      // List existing backups
      const { data: files, error: listError } = await adminClient.storage
        .from('backups')
        .list('', { sortBy: { column: 'created_at', order: 'desc' } })

      if (listError) {
        return new Response(JSON.stringify({ error: listError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ files }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      fileName,
      backup 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
