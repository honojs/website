import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SettingsClient } from '@/components/settings/SettingsClient'

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user!.id).single()

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>設定</h1>
        <p className='text-muted-foreground text-sm'>アカウントとポートフォリオの設定</p>
      </div>
      <SettingsClient
        userId={user!.id}
        displayName={profile?.display_name ?? ''}
      />
    </div>
  )
}
