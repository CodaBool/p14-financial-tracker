'use client'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { IoIosMore } from "react-icons/io"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "./ui/use-toast.js"
import HistoryForm from "./HistoryForm"
import { Input } from "./ui/input"
import { CalendarInput } from "./ui/calendar"

export default function History({originalData}) {
  const [editable, setEditable] = useState()
  const [data, setData] = useState(originalData)
  const [tmpDate, setTmpDate] = useState()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // captures incoming table updates of adds or deletes
    // does not capture edits but that is handled elsewhere
    if (originalData.length !== data.length) {
      setData(originalData)
    }
  }, [originalData])

  // udate table data a new date is selected, since the meta does not pick up date changes
  useEffect(() => {
    if (!tmpDate) return
    setData(old =>
      old.map((row, index) => {
        if (index === tmpDate[1]) {
          return {
            ...old[tmpDate[1]],
            ["date"]: tmpDate,
          }
        }
        return row
      })
    )
  }, [tmpDate])

  const defaultColumn = {
    cell: ({ getValue, row: { index }, row, column: { id }, table }) => {
      let val = getValue()
      const [editIndex, setEditIndex] = useState()
      const [value, setValue] = useState(val)
      // this will be created for each cell, this is bad for performance
      const [date, setDate] = useState(id === "date" && new Date(val))
      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(val)
      }, [val])
      useEffect(() => {
        if (date && editIndex) {
          setTmpDate([date, index])
        }
      }, [date])
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
      }
      useEffect(() => {
        if (index === editable) {
          setEditIndex(true)
        }
      }, [editable])
      if (editIndex && id !== "by") {
        if (id === "date") {
          return (
            <CalendarInput date={date} setDate={setDate} />
          )
          // if (!isNaN(Date.parse(value))) {
          //   // if it can be parsed as a date write it in date format
          //   // only really matters for the initial value to be set right
          //   return (
          //     <Input
          //       value={new Intl.DateTimeFormat('en-US').format(new Date(value))}
          //       onChange={e => setValue(e.target.value)}
          //       onBlur={onBlur}
          //     />
          //   )
          // }
        }
        return (
          <Input
            value={value}
            type={id === "amount" ? "number" : "text"}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            className="min-w-[250px]"
          />
        )
      } else {
        if (id === "amount") {
          return Number(val).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })
        } else if (id === "date") {
          return new Date(val).toLocaleDateString()
        }
        return val
      }
    },
  }

  async function save(row) {
    const body = {}
    for (const cell of row.getAllCells()) {
      if (cell.column.id === "actions") continue
      if (cell.column.id === "by") continue
      if (cell.column.id === "date") {
        if (tmpDate) {
          body.date = tmpDate[0]
        } else {
          body.date = cell.getValue()
        }
      } else {
        body[cell.column.id] = cell.getValue()
      }
    }
    body["id"] = row.original._id
    const res = await fetch('/api/statement', {method: 'PUT', body: JSON.stringify(body)})
    setEditable(null)
    const ress = await res.json()
    if (res.ok) {
      toast({
        title: "Row Saved",
        description: `The ${body.description} item for $${body.amount} has been saved`
      })
      router.refresh()
      return
    }
    toast({
      variant: "destructive",
      title: "The row could not be saved",
      description: ress.err,
    })
  }

  async function deleteRow(row) {
    const res = await fetch(`/api/statement?${new URLSearchParams({id: row.original._id})}`, { method: 'DELETE' })
    const ress = await res.json()
    if (res.ok) {
      toast({
        title: "Row Deleted",
        description: `The ${row.original.description} item for $${row.original.amount} has been deleted`
      })
      router.refresh()
      return
    }
    toast({
      variant: "destructive",
      title: "The row could not be deleted",
      description: ress.err,
    })
  }

  const columns = useMemo(() => [
    {
      id: "actions",
      cell: ({  row: { index }, row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <IoIosMore className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {editable === index
                ?
                  <DropdownMenuItem onClick={() => save(row)}>
                    Save
                  </DropdownMenuItem>
                : 
                  <DropdownMenuItem onClick={() => setEditable(index)}>
                    Edit
                  </DropdownMenuItem>
              }
              <DropdownMenuItem onClick={() => deleteRow(row)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "by",
      header: "By",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
  ])

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), defaultColumn,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
  })
  
  return (
    <>
      <div className="border rounded-md">
        <HistoryForm />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end py-4 space-x-2 me-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}