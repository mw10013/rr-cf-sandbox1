import type { ColumnProps, SortDescriptor } from 'react-aria-components'
import { useMemo, useState } from 'react'
import { Group, TableBody } from 'react-aria-components'
import {
  Cell,
  Column,
  Row,
  Table,
  TableHeader,
} from '~/lib/components/rac-starter/Table1'

const rows = [
  { id: 1, name: 'Games', date: '6/7/2020', type: 'File folder' },
  { id: 2, name: 'Program Files', date: '4/7/2021', type: 'File folder' },
  { id: 3, name: 'bootmgr', date: '11/20/2010', type: 'System file' },
  { id: 4, name: 'log.txt', date: '1/18/2016', type: 'Text Document' },
  { id: 5, name: 'Proposal.ppt', date: '6/18/2022', type: 'PowerPoint file' },
  { id: 6, name: 'Taxes.pdf', date: '12/6/2023', type: 'PDF Document' },
  { id: 7, name: 'Photos', date: '8/2/2021', type: 'File folder' },
  { id: 8, name: 'Documents', date: '3/18/2023', type: 'File folder' },
  { id: 9, name: 'Budget.xls', date: '1/6/2024', type: 'Excel file' },
]

export const Example = (args: any) => {
  let [sortDescriptor, setSortDescriptor] = useState({
    column: 'name',
    direction: 'ascending',
  })

  let items = useMemo(() => {
    console.log({ sortDescriptor })
    // @ts-ignore
    let items = rows
      .slice()
      .sort((a, b) =>
        a[sortDescriptor.column].localeCompare(b[sortDescriptor.column])
      )
    if (sortDescriptor.direction === 'descending') {
      items.reverse()
    }
    return items
  }, [sortDescriptor])

  return (
    <Table
      aria-label="Files"
      {...args}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}>
      <TableHeader>
        <Column id="name" isRowHeader allowsSorting>
          Name
        </Column>
        <Column id="type" allowsSorting>
          Type
        </Column>
        <Column id="date" allowsSorting>
          Date Modified
        </Column>
      </TableHeader>
      <TableBody items={items}>
        {(row) => (
          <Row>
            <Cell>{row.name}</Cell>
            <Cell>{row.type}</Cell>
            <Cell>{row.date}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  )
}

Example.args = {
  onRowAction: null,
  onCellAction: null,
  selectionMode: 'multiple',
}

export default function RouteComponent() {
  console.log('render')
  let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  })

  let items = useMemo(() => {
    console.log({ sortDescriptor })
    // @ts-ignore
    let items = rows
      .slice()
      .sort((a, b) =>
        a[sortDescriptor.column].localeCompare(b[sortDescriptor.column])
      )
    if (sortDescriptor.direction === 'descending') {
      items.reverse()
    }
    return items
  }, [sortDescriptor])

  return (
    <div className="container p-6">
      <h1>Tab1</h1>
      {/* <Table
        aria-label="Files"
        selectionMode="multiple"
        selectionBehavior="replace"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}>
        <TableHeader>
          <StockColumn id="name" isRowHeader allowsSorting>
            Name
          </StockColumn>
          <StockColumn id="type" allowsSorting>
            Type
          </StockColumn>
          <StockColumn id="date" allowsSorting>
            Date Modified
          </StockColumn>
        </TableHeader>
        <TableBody items={items}>
          {(row) => (
            <Row>
              <Cell>{row.name}</Cell>
              <Cell>{row.type}</Cell>
              <Cell>{row.date}</Cell>
            </Row>
          )}
        </TableBody>
      </Table> */}
    </div>
  )
}

function StockColumn(props: ColumnProps & { children: React.ReactNode }) {
  return (
    <Column
      {...props}
      className="sticky top-0 cursor-default whitespace-nowrap border-0 border-b border-solid border-slate-300 bg-slate-200 p-0 text-left font-bold outline-none first:rounded-tl-lg last:rounded-tr-lg">
      {({ allowsSorting, sortDirection }) => (
        <div className="flex items-center py-1 pl-4">
          <Group
            role="presentation"
            tabIndex={-1}
            className="flex flex-1 items-center overflow-hidden rounded outline-none ring-slate-600 focus-visible:ring-2">
            <span className="flex-1 truncate">{props.children}</span>
            {allowsSorting && (
              <span
                className={`ml-1 flex h-4 w-4 items-center justify-center transition ${
                  sortDirection === 'descending' ? 'rotate-180' : ''
                }`}>
                {/* {sortDirection && <ArrowUpIcon width={8} height={10} />} */}
                {sortDirection && 'UP'}
              </span>
            )}
          </Group>
          {/* <ColumnResizer className="resizing:bg-slate-800 resizing:w-[2px] resizing:pl-[7px] h-5 w-px cursor-col-resize rounded bg-slate-400 bg-clip-content px-[8px] py-1 ring-inset ring-slate-600 focus-visible:ring-2" /> */}
        </div>
      )}
    </Column>
  )
}
