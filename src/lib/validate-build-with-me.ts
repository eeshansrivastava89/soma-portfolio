import type { Category, Status, Difficulty } from '../data/build-with-me-config'

export interface Task {
	id: string
	title: string
	projectSlug: string
	category: Category[]
	status: Status
	difficulty?: Difficulty
	points?: number
	assignees?: { name: string; avatar?: string }[]
	labels?: string[]
	githubUrl: string
}

export interface Cycle {
	slug: string
	name: string
	phase: string
	openTasks: number
	claimed: number
	mergedThisWeek: number
	highlight?: string
}

export interface Hat {
	name: string
	hats: Category[]
	status: Status
	prNumber?: number
}

export interface LeaderboardEntry {
	name: string
	avatar?: string
	points: number
	mergedPRs: number
	reviews: number
	docs: number
}

export interface BuildWithMeData {
	cycles: Cycle[]
	tasks: Task[]
	hats: Hat[]
	leaderboard: LeaderboardEntry[]
	lastFetchTime?: string
}

export function validateBuildWithMeData(data: unknown): BuildWithMeData | null {
	if (!data || typeof data !== 'object') {
		console.error('❌ Invalid data: not an object')
		return null
	}

	const d = data as Record<string, unknown>

	if (!Array.isArray(d.cycles)) {
		console.error('❌ Invalid data: cycles must be array')
		return null
	}

	if (!Array.isArray(d.tasks)) {
		console.error('❌ Invalid data: tasks must be array')
		return null
	}

	if (!Array.isArray(d.hats)) {
		console.error('❌ Invalid data: hats must be array')
		return null
	}

	if (!Array.isArray(d.leaderboard)) {
		console.error('❌ Invalid data: leaderboard must be array')
		return null
	}

	// Validate each task has required fields
	for (const task of d.tasks) {
		if (typeof task !== 'object' || !task) {
			console.error('❌ Invalid task: not an object', task)
			return null
		}
		const t = task as Record<string, unknown>
		if (!t.id || !t.title || !t.githubUrl || !Array.isArray(t.category)) {
			console.error('❌ Invalid task: missing required fields', task)
			return null
		}
	}

	// Type assertion is safe here because we've validated the structure
	return {
		cycles: d.cycles as Cycle[],
		tasks: d.tasks as Task[],
		hats: d.hats as Hat[],
		leaderboard: d.leaderboard as LeaderboardEntry[]
	}
}
