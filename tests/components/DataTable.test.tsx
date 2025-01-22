import { fireEvent, render, screen } from "@testing-library/react";

import { DataTable } from "@/components/DataTable";
import { CellContext, ColumnDef } from "@tanstack/react-table";

describe("DataTable component", () => {
  type DataTableType = {
    id: number;
    name: string;
  };

  const columns: ColumnDef<DataTableType, never>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }: CellContext<DataTableType, number>) => (
        <span>{getValue()}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }: CellContext<DataTableType, string>) => (
        <span>{getValue()}</span>
      ),
    },
  ];

  const data = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  it("renders the table with data", () => {
    render(<DataTable columns={columns} data={data} />);

    // Check for header columns
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();

    // Check for data rows
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders empty state when no data is provided", () => {
    render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText("Sem posts ainda.")).toBeInTheDocument();
  });

  it("sorts data when clicking on sortable headers", async () => {
    render(<DataTable columns={columns} data={data} />);

    const idHeader = screen.getByText("ID");

    // Simulate clicking on the header to sort
    fireEvent.click(idHeader);

    // Check if the data is sorted
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("1");
    expect(rows[2]).toHaveTextContent("2");
  });
});
