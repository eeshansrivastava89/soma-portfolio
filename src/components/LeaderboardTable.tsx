import { useEffect, useRef, useState } from 'react'
import { Trophy } from 'lucide-react'
import type { LeaderboardEntry } from '../lib/validate-build-with-me'

interface LeaderboardTableProps {
	entries: LeaderboardEntry[]
}

function CountUpPoints({ target }: { target: number }) {
	const [current, setCurrent] = useState(0)
	const hasAnimated = useRef(false)

	useEffect(() => {
		if (hasAnimated.current) return
		hasAnimated.current = true

		const duration = 700
		const stepTime = 16
		const steps = duration / stepTime
		const increment = target / steps
		let currentValue = 0

		const timer = setInterval(() => {
			currentValue += increment
			if (currentValue >= target) {
				setCurrent(target)
				clearInterval(timer)
			} else {
				setCurrent(Math.round(currentValue))
			}
		}, stepTime)

		return () => clearInterval(timer)
	}, [target])

	return <span>{current} pts</span>
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
	return (
		<div className='rounded-2xl border border-border bg-primary-foreground p-4 shadow-lg shadow-black/5'>
			<div className='mb-3 flex items-center gap-2'>
				<Trophy className='h-5 w-5 text-orange-600' />
				<h2 className='text-xl font-semibold text-foreground'>Leaderboard</h2>
			</div>
			<p className='mb-4 text-sm text-muted-foreground'>
				Points weighted by merged PRs, reviews, docs.
			</p>
			<div className='space-y-2'>
				{entries.map((entry, idx) => {
					const isTopThree = idx < 3
					const rankColors = ['text-amber-500', 'text-slate-400', 'text-orange-700']
					const rankColor = isTopThree ? rankColors[idx] : 'text-orange-600'

					return (
						<div
							key={entry.name}
							className='flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 transition hover:bg-muted/70'
						>
							<div className='flex items-center gap-3'>
								<span className={`text-lg font-bold ${rankColor}`}>#{idx + 1}</span>
								{entry.avatarUrl && (
									<img
										src={entry.avatarUrl}
										alt={entry.name}
										className='h-10 w-10 rounded-full border-2 border-border'
									/>
								)}
								<div>
									<div className='text-sm font-semibold text-foreground'>{entry.name}</div>
									<div className='flex items-center gap-2 text-xs text-muted-foreground'>
										<span>PRs {entry.mergedPRs}</span>
										<span>·</span>
										<span>Reviews {entry.reviews}</span>
										<span>·</span>
										<span>Docs {entry.docs}</span>
									</div>
								</div>
							</div>
							<div className='text-right'>
								<div className='text-xl font-bold text-emerald-700'>
									<CountUpPoints target={entry.points} />
								</div>
								{isTopThree && (
									<div className='text-xs text-muted-foreground'>
										{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
			{entries.length === 0 && (
				<p className='py-8 text-center text-sm text-muted-foreground'>
					No entries yet. Be the first to contribute!
				</p>
			)}
		</div>
	)
}
