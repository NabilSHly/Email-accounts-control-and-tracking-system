import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Filter, Download } from 'lucide-react';
import { Edit } from 'lucide-react';
import { reportEmployee } from '@/services/api';
import { EmployeeEditForm } from './EmployeeEditForm';
// Simple helper functions
const formatDepartments = (departmentIds, departmentsList) => {
  return departmentIds
    .map(id => {
      const dept = departmentsList.find(d => d.departmentId === id);
      return dept?.department;
    })
    .filter(Boolean)
    .join(", ") || "N/A";
};

const formatMunicipality = (id, list) => {
  const item = list.find(m => m.municipalityId === id);
  return item ? item.municipality : "N/A";
};

// WhatsApp message template
const createWhatsAppMessage = (employee) => {
  const message = `السلام عليكم ورحمة الله وبركاته
بعد التحية
نرسل إليكم بيانات البريد الإلكتروني المخصص لكم والمختص بمراسلاتكم ومعاملاتكم الإدارية في وزارة الحكم المحلي . 
يعتبر البريد الالكتروني مسؤولية شخصية وكل مراسلة صادرة منه هي مراسلة رسمية.

البريد الإلكتروني:
${employee.email}
كلمة المرور:
${employee.password}

الخادم:
mail.mun.lgm.gov.ly
رابط التطبيق اندرويد :
https://play.google.com/store/apps/details?id=com.microsoft.office.outlook
رابط التطبيق ابل :
https://apps.apple.com/us/app/microsoft-outlook/id951937596

تم إرفاق لسادتكم شروحات مرئية لكيفية تسجيل دخولكم للبريد على الهاتف المحمول (اندرويد , ios). في حال مواجهنكم لأي مشكلة يمكنكم مراسلة الدعم الفني لقسم نظم وتقنية المعلومات التابع للوزارة وسيتم الرد على استفساراتكم.

فريق التحول الرقمي / وزارة الحُكــم المحلي.`;

  return encodeURIComponent(message);
};

// Function to open WhatsApp with the message
const sendWhatsAppMessage = async (employee) => {

  if (!employee.phoneNumber) {
    alert("No phone number available for this employee");
    return;
  }
  
  // Format phone number (remove spaces, +, etc.)
  const phoneNumber = employee.phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
  const message = createWhatsAppMessage(employee);
  // Update reported status to true
  try {
    const response = await reportEmployee(employee.employeeId, { reported: true });

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  window.location.reload();

    return response.data;
  } catch (error) {
    console.error('Error reporting employee:', error);
    throw error;
  }

  // Open WhatsApp web or app
  
};

// Simple helper function to get department name
const getDepartmentName = (departmentId, departmentsList) => {
  if (!departmentId) return "N/A";
  const dept = departmentsList.find(d => d.departmentId === departmentId);
  return dept ? dept.department : "N/A";
};

export default function EmployeesTable({ data, departments, municipalities, searchTerm ,userPermissions  }) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
console.log(userPermissions);

  const columnLabels = {
    engname: "الاسم بالانجليزي",
    arname: "الاسم بالعربي",
    nationalID: "الرقم الوطني",
    email: "البريد الالكتروني",
    phoneNumber: "رقم الهاتف",
    status: "الحالة",
    reported: "تم التواصل معه",
    municipalityId: "البلدية",
    singleDepartmentId: "القسم",
    createdAt: "تاريخ الانشاء",
    actions: "actions",
  };
  // Define columns
  const columns = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected()}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    // {
    //   accessorKey: "employeeId",
    //   header: "ID",
    // },
    {
      accessorKey: "engname",
      header: "الاسم بالانجليزي",
    },
    {
      accessorKey: "arname",
      header: "الاسم بالعربي",
    },
    {
      accessorKey: "nationalID",
      header: "الرقم الوطني",
    },
    {
      accessorKey: "email",
      header: "البريد الالكتروني",
      cell: ({ row }) =>{
        return <div className='text-center font-bold'> {row.getValue("email") || "N/A"} </div>;
      } 
    },
    {
      accessorKey: "phoneNumber",
      header: "رقم الهاتف",
      cell: ({ row }) => row.getValue("phoneNumber") || "N/A",
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const variant = 
          status === "ACTIVE" ? "success" : 
          status === "PENDING" ? "warning" : "destructive";
        return <Badge variant={variant}>{
          status === "ACTIVE" ? "نشط" : 
          status === "PENDING" ? "قيد المراجعة" : "غير نشط"
        }</Badge>;
      },
    },
    {
      accessorKey: "reported",
      header: "تم التواصل معه",
      cell: ({ row }) => {
        const reported = row.getValue("reported");
        return (
          <Badge variant={reported ? "success" : "destructive"}>
            {reported ? "نعم" : "لا"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "municipalityId",
      header: "البلدية",
      cell: ({ row }) => formatMunicipality(row.getValue("municipalityId"), municipalities),
    },
    {
      accessorKey: "singleDepartmentId",
      header: "القسم",
      cell: ({ row }) => getDepartmentName(row.getValue("singleDepartmentId"), departments),
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الانشاء",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
    },
    ...(userPermissions.includes('ADMIN') ? [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const employee = row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendWhatsAppMessage(employee)}
                className="flex bg-[#25D366] text-white hover:text-[#25D366] items-center gap-1"
                disabled={!employee.phoneNumber}
              >
                <img src="./whatsapp-logo-4456.png" className="w-6 h-6" alt="" />
                تبليغ
              </Button>
              <EmployeeEditForm
                employee={employee}
                departments={departments}
                municipalities={municipalities}
              />
            </div>
          );
        },
      }
    ] : []), // If not "ADMIN", do not include the actions column
  ];

  // Configure table with rowId
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: searchTerm,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: [
        {
          id: 'createdAt',  // Column to sort by
          desc: true,       // Descending order (newest first)
        },
      ],
    },
    getRowId: row => row.rowId, // Use our custom rowId for selection
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // initialState: {
    //   pagination: { pageSize: 5 },
    // },
  });

  // Export to CSV - need to handle the expanded rows
  const handleExport = () => {
    // Get selected rows or all filtered rows if none selected
    const rowsToExport = Object.keys(rowSelection).length > 0
      ? table.getFilteredRowModel().rows
          .filter(row => rowSelection[row.id])
          .map(row => row.original)
      : table.getFilteredRowModel().rows.map(row => row.original);
    
    // Create CSV content
    const headers = columns
      .filter(col => col.id !== 'select' && col.id !== 'actions' && columnVisibility[col.accessorKey] !== false)
      .map(col => col.header)
      .join(',');
    
    const rows = rowsToExport.map(row => {
      return columns
        .filter(col => col.id !== 'select' && col.id !== 'actions' && columnVisibility[col.accessorKey] !== false)
        .map(col => {
          let value = row[col.accessorKey];
          
          // Format special fields
          if (col.accessorKey === 'municipalityId') {
            value = formatMunicipality(value, municipalities);
          } else if (col.accessorKey === 'singleDepartmentId') {
            value = getDepartmentName(value, departments);
          } else if (col.accessorKey === 'createdAt') {
            value = new Date(value).toLocaleDateString();
          } else if (col.accessorKey === 'reported') {
            value = value ? 'نعم' : 'لا';
          }
          
          // Handle commas in values
          if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
          }
          
          return value || '';
        })
        .join(',');
    }).join('\n');
    
    // Download CSV
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className=" rounded-sm px-1 bg-white ">
      <div className="flex justify-end gap-2  items-center py-4">
      
        <Button
          onClick={handleExport}
          className="flex items-center gap-2 "
        >
          <Download className="h-4 w-4" />
          Export CSV ({table.getFilteredRowModel().rows.length})
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button  className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              الاعمدة
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                >
                  { columnLabels[column.id] }
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
       
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-center text-gray-700 text-lg  border-r border-gray-200">
                    {header.isPlaceholder ? null : 
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="text-center border-r border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {Object.keys(rowSelection).length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div> */}
      </div>
    </div>
  );
} 