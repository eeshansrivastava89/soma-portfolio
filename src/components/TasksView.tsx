import { useState, useEffect } from 'react'
import TasksTable from './TasksTable'
import SearchBar from './SearchBar'
import FilterPanel from './FilterPanel'
import type { Task } from '../lib/validate-build-with-me'
import type { Category, Status } from '../data/build-with-me-config'

interface TasksViewProps {
	tasks: Task[]
}

export default function TasksView({ tasks }: TasksViewProps) {
	const [searchFilteredTasks, setSearchFilteredTasks] = useState<Task[]>(tasks)
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
	const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])
	const [finalTasks, setFinalTasks] = useState<Task[]>(tasks)

	useEffect(() => {
		let filtered = searchFilteredTasks

		// Apply category filter
		if (selectedCategories.length > 0) {
			filtered = filtered.filter((task) =>
				task.category.some((cat) => selectedCategories.includes(cat))
			)
		}

		// Apply status filter
		if (selectedStatuses.length > 0) {
			filtered = filtered.filter((task) => selectedStatuses.includes(task.status))
		}

		setFinalTasks(filtered)
	}, [searchFilteredTasks, selectedCategories, selectedStatuses])

	return (
		<div className='space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex-1'>
					<SearchBar tasks={tasks} onFilteredTasks={setSearchFilteredTasks} />
				</div>
				<FilterPanel
					selectedCategories={selectedCategories}
					selectedStatuses={selectedStatuses}
					onCategoryChange={setSelectedCategories}
					onStatusChange={setSelectedStatuses}
				/>
			</div>
			<TasksTable tasks={finalTasks} />
		</div>
	)
}
