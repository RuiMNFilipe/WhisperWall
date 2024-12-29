import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModDashboardHeader from "@/components/ModDashboardHeader";

function DashboardPage() {
  return (
    <section>
      <ModDashboardHeader />
      <Table className="max-w-7xl mx-auto">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Conteúdo</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell className="flex items-center gap-x-5">
              <FaPencil color="green" />
              <FaTrashAlt color="red" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}

export default DashboardPage;
