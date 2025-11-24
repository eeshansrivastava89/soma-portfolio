import { useMemo, useState } from 'react'
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	flexRender,
	type ColumnDef,
	type SortingState,
	type ColumnFiltersState
} from '@tanstack/react-table'
import { ArrowUpDown, ExternalLink } from 'lucide-react'
import type { Task } from '../lib/validate-build-with-me'
import { CATEGORY_STYLES, STATUS_STYLES } from '../data/build-with-me-config'

interface TasksTableProps {
	tasks: Task[]
}

export default function TasksTable({ tasks }: TasksTableProps) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const columns = useMemo<ColumnDef<Task>[]>(
		() => [
			{
				accessorKey: 'title',
				header: ({ column }) => (
					<button
						className='flex items-center gap-2 font-semibold hover:text-foreground'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Task
						<ArrowUpDown className='h-3 w-3' />
					</button>
				),
				cell: ({ row }) => (
					<div className='max-w-md'>
						<div className='font-semibold text-foreground'>{row.original.title}</div>
						<div className='text-xs text-muted-foreground'>
							{row.original.projectSlug === 'ab-sim' ? 'A/B Simulator' : 'Basketball Analyzer'}
						</div>
					</div>
				)
			},
			{
				accessorKey: 'category',
				header: 'Category',
				cell: ({ row }) => (
					<div className='flex flex-wrap gap-1'>
						{row.original.category.map((cat) => (
							<span
								key={cat}
								className={`rounded-full px-2 py-1 text-[10px] font-semibold ${CATEGORY_STYLES[cat]}`}
							>
								{cat}
							</span>
						))}
					</div>
				)
			},
			{
				accessorKey: 'status',
				header: ({ column }) => (
					<button
						className='flex items-center gap-2 font-semibold hover:text-foreground'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Status
						<ArrowUpDown className='h-3 w-3' />
					</button>
				),
				cell: ({ row }) => (
					<span
						className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${STATUS_STYLES[row.original.status]}`}
					>
						{row.original.status}
					</span>
				)
			},
			{
				accessorKey: 'points',
				header: ({ column }) => (
					<button
						className='flex items-center gap-2 font-semibold hover:text-foreground'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Points
						<ArrowUpDown className='h-3 w-3' />
					</button>
				),
				cell: ({ row }) => (
					<span className='rounded-md bg-muted px-2 py-1 text-sm font-semibold text-foreground'>
						{row.original.points ?? 0}
					</span>
				)
			},
			{
				accessorKey: 'assignees',
				header: 'Assignees',
				cell: ({ row }) =>
					row.original.assignees?.length ? (
						<div className='flex flex-wrap gap-1'>
							{row.original.assignees.map((a) => (
								<span
									key={a.name}
									className='rounded bg-muted px-2 py-1 text-xs text-foreground'
								>
									{a.name}
								</span>
							))}
						</div>
					) : (
						<span className='text-xs text-emerald-700'>Unclaimed</span>
					)
			},
			{
				id: 'actions',
				header: '',
				cell: ({ row }) => (
					<a
						href={row.original.githubUrl}
						className='inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700'
						target='_blank'
						rel='noreferrer'
					>
						<ExternalLink className='h-3 w-3' />
						GitHub
					</a>
				)
			}
		],
		[]
	)

	const table = useReactTable({
		data: tasks,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		state: {
			sorting,
			columnFilters
		}
	})

	return (
		<div className='rounded-2xl border border-border bg-primary-foreground shadow-lg shadow-black/5'>
			{/* Desktop table view */}
			<div className='hidden overflow-x-auto lg:block'>
				<table className='w-full'>
					<thead className='border-b border-border bg-muted/30'>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className='px-4 py-3 text-left text-xs text-muted-foreground'>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className='border-b border-border/50 transition hover:bg-muted/20'
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className='px-4 py-3 text-sm'>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columns.length} className='px-4 py-8 text-center text-muted-foreground'>
									No tasks found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Mobile card view */}
			<div className='space-y-3 p-4 lg:hidden'>
				{table.getRowModel().rows.length ? (
					table.getRowModel().rows.map((row) => {
						const task = row.original
						return (
							<div
								key={row.id}
								className='rounded-xl border border-border bg-muted/30 p-4 transition hover:bg-muted/50'
							>
								<div className='mb-2 flex items-start justify-between gap-2'>
									<div className='flex-1'>
										<div className='text-xs text-muted-foreground'>
											{task.projectSlug === 'ab-sim' ? 'A/B Simulator' : 'Basketball Analyzer'}
										</div>
										<div className='mt-1 font-semibold text-foreground'>{task.title}</div>
									</div>
									<span
										className={`rounded-md px-2 py-1 text-xs font-semibold ${STATUS_STYLES[task.status]}`}
									>
										{task.status}
									</span>
								</div>
								<div className='mb-3 flex flex-wrap gap-1.5'>
									{task.category.map((cat) => (
										<span
											key={cat}
											className={`rounded-full px-2 py-1 text-[10px] font-semibold ${CATEGORY_STYLES[cat]}`}
										>
											{cat}
										</span>
									))}
								</div>
								<div className='flex items-center justify-between text-sm'>
									<div className='flex items-center gap-3'>
										<span className='rounded-md bg-muted px-2 py-1 text-xs font-semibold text-foreground'>
											{task.points ?? 0} pts
										</span>
										{task.assignees?.length ? (
											<span className='text-xs text-muted-foreground'>
												{task.assignees.map((a) => a.name).join(', ')}
											</span>
										) : (
											<span className='text-xs text-emerald-700'>Unclaimed</span>
										)}
									</div>
									<a
										href={task.githubUrl}
										className='inline-flex items-center gap-1 text-xs text-orange-600'
										target='_blank'
										rel='noreferrer'
									>
										<ExternalLink className='h-3 w-3' />
									</a>
								</div>
							</div>
						)
					})
				) : (
					<p className='py-8 text-center text-muted-foreground'>No tasks found.</p>
				)}
			</div>
		</div>
	)
}
