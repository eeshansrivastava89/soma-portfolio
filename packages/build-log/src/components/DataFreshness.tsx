import { Clock, AlertCircle } from 'lucide-react'

interface DataFreshnessProps {
	lastFetchTime?: string
}

export default function DataFreshness({ lastFetchTime }: DataFreshnessProps) {
	if (!lastFetchTime) {
		return (
			<div className='flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100'>
				<AlertCircle className='h-3.5 w-3.5' />
				<span>Data freshness unknown</span>
			</div>
		)
	}

	const fetchDate = new Date(lastFetchTime)
	const now = new Date()
	const ageMinutes = Math.floor((now.getTime() - fetchDate.getTime()) / 60000)

	let displayText = ''
	let colorClass = ''

	if (ageMinutes < 5) {
		displayText = 'Just now'
		colorClass = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
	} else if (ageMinutes < 60) {
		displayText = `${ageMinutes}m ago`
		colorClass = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
	} else if (ageMinutes < 1440) {
		// < 24 hours
		const hours = Math.floor(ageMinutes / 60)
		displayText = `${hours}h ago`
		colorClass = 'border-sky-500/30 bg-sky-500/10 text-sky-100'
	} else {
		const days = Math.floor(ageMinutes / 1440)
		displayText = `${days}d ago`
		colorClass = 'border-amber-500/30 bg-amber-500/10 text-amber-100'
	}

	return (
		<div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${colorClass}`}>
			<Clock className='h-3.5 w-3.5' />
			<span>Updated {displayText}</span>
		</div>
	)
}
