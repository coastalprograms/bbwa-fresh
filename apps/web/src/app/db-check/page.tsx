import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DbCheckPage() {
  let status: { ok: boolean; message: string; rows?: Array<{ id: string; title: string | null }> } = {
    ok: true,
    message: 'OK',
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1)

    if (error) {
      status = { ok: false, message: `Query error: ${error.message}` }
    } else {
      status = { ok: true, message: 'Query succeeded', rows: data ?? [] }
    }
  } catch (err: any) {
    status = { ok: false, message: `Client error: ${err?.message ?? 'Unknown error'}` }
  }

  return (
    <main className="min-h-dvh p-8">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Database Check</h1>
        <p className={status.ok ? 'text-green-600' : 'text-red-600'}>
          {status.ok ? 'Success' : 'Failure'}: {status.message}
        </p>
        {status.rows && status.rows.length > 0 && (
          <div className="rounded border p-3">
            <p className="text-sm text-gray-500">Sample rows (projects):</p>
            <ul className="list-disc pl-5">
              {status.rows.map((r) => (
                <li key={r.id} className="text-sm">
                  {r.title ?? r.id}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-xs text-gray-400">
          Note: Ensure `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. Public read policies are
          enabled for `projects` in the migration.
        </p>
      </div>
    </main>
  )
}
