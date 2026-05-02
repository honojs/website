import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatUSD, formatDate, formatShares } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { Transaction } from '@/types/database'
import Link from 'next/link'

export default async function HistoryPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: portfolio } = await supabase.from('portfolios').select('id').eq('user_id', user!.id).single()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('portfolio_id', portfolio?.id ?? '')
    .order('executed_at', { ascending: false })

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>取引履歴</h1>
        <p className='text-muted-foreground text-sm'>過去のすべての取引</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>{transactions?.length ?? 0} 件の取引</CardTitle>
        </CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              <p>まだ取引履歴がありません。</p>
              <Link href='/trade' className='text-primary underline text-sm'>最初の取引をしてみよう →</Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日時</TableHead>
                  <TableHead>銘柄</TableHead>
                  <TableHead>種別</TableHead>
                  <TableHead className='text-right'>株数</TableHead>
                  <TableHead className='text-right'>単価</TableHead>
                  <TableHead className='text-right'>合計金額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transactions as Transaction[]).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className='text-xs text-muted-foreground whitespace-nowrap'>
                      {formatDate(t.executed_at)}
                    </TableCell>
                    <TableCell>
                      <Link href={`/stocks/${t.ticker}`} className='hover:underline'>
                        <span className='font-mono font-semibold'>{t.ticker}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.transaction_type === 'buy' ? 'gain' : 'loss'}>
                        {t.transaction_type === 'buy' ? '買い' : '売り'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right font-mono'>{formatShares(t.shares)}</TableCell>
                    <TableCell className='text-right'>{formatUSD(t.price)}</TableCell>
                    <TableCell className='text-right font-semibold'>{formatUSD(t.total_amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
