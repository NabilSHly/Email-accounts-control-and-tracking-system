import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, RefreshCw } from "lucide-react";

// Action type badge variants
const actionBadgeVariants = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "destructive",
  LOGIN: "default",
  APPROVE: "success",
  REJECT: "destructive",
  OTHER: "secondary"
};

// Entity type badge variants
const entityBadgeVariants = {
  employee: "default",
  department: "secondary",
  municipality: "outline",
  user: "destructive"
};

// Helper function to format dates without date-fns
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString( { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  });
  
  // Filters
  const [filters, setFilters] = useState({
    userId: "",
    actionType: "all",
    entityType: "all",
    entityId: "",
    startDate: null,
    endDate: null
  });
  
  // Fetch logs
  const fetchLogs = async (page = 1) => {
    setLoading(true);
    
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', pagination.limit);
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          // Format dates
          if (key === 'startDate' || key === 'endDate') {
            params.append(key, value.toISOString());
          } else {
            params.append(key, value);
          }
        }
      });
      
      const response = await axios.get(`http://localhost:3000/audit-logs`, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      
      setLogs(response.data.logs);
      console.log(response);
      
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error("فشل تحميل سجلات التدقيق", {
        description: error.response?.data?.error || "حدث خطأ أثناء جلب السجلات."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Apply filters
  const applyFilters = () => {
    fetchLogs(1); // Reset to first page when applying filters
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      userId: "",
      actionType: "all",
      entityType: "all",
      entityId: "",
      startDate: null,
      endDate: null
    });
    fetchLogs(1);
  };
  
  // Format details for display
  const formatDetails = (detailsJson) => {
    try {
      const details = JSON.parse(detailsJson);
      return (
        <div className="text-xs">
          {details.method && <div><strong>Method:</strong> {details.method}</div>}
          {details.path && <div><strong>Path:</strong> {details.path}</div>}
          {details.body && (
            <div>
              <strong>Data:</strong> 
              <pre className="mt-1 max-h-20 overflow-auto bg-muted p-1 rounded text-xs">
                {JSON.stringify(details.body, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <span className="text-xs">{detailsJson}</span>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">سجل النشاطات</CardTitle>
              <CardDescription>
                عرض جميع الإجراءات والتغييرات التي تمت في النظام
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => fetchLogs(pagination.page)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">تحديث</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">المستخدم</label>
              <Input 
                placeholder="معرف المستخدم"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">نوع الإجراء</label>
              <Select 
                value={filters.actionType}
                onValueChange={(value) => handleFilterChange('actionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الإجراء" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="CREATE">إنشاء</SelectItem>
                  <SelectItem value="UPDATE">تحديث</SelectItem>
                  <SelectItem value="DELETE">حذف</SelectItem>
                  <SelectItem value="LOGIN">تسجيل دخول</SelectItem>
                  <SelectItem value="APPROVE">موافقة</SelectItem>
                  <SelectItem value="REJECT">رفض</SelectItem>
                  <SelectItem value="OTHER">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">نوع الكيان</label>
              <Select 
                value={filters.entityType}
                onValueChange={(value) => handleFilterChange('entityType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الكيان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="employee">موظف</SelectItem>
                  <SelectItem value="department">قسم</SelectItem>
                  <SelectItem value="municipality">بلدية</SelectItem>
                  <SelectItem value="user">مستخدم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">من تاريخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? (
                      formatDate(filters.startDate)
                    ) : (
                      <span>اختر التاريخ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) => handleFilterChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">إلى تاريخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? (
                      formatDate(filters.endDate)
                    ) : (
                      <span>اختر التاريخ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.endDate}
                    onSelect={(date) => handleFilterChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mb-6">
            <Button variant="outline" onClick={resetFilters}>
              إعادة تعيين
            </Button>
            <Button onClick={applyFilters}>
              تطبيق الفلاتر
            </Button>
          </div>
          
          {/* Logs Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد سجلات مطابقة للفلاتر المحددة
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="text-start">
                      <TableHead className="text-start">التاريخ والوقت</TableHead>
                      <TableHead className="text-start">المستخدم</TableHead>
                      <TableHead className="text-start">الإجراء</TableHead>
                      <TableHead className="text-start">الكيان</TableHead>
                      <TableHead className="text-start">معرف الكيان</TableHead>
                      <TableHead className="text-start">التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>
                          <Badge variant={actionBadgeVariants[log.actionType] || "secondary"}>
                            {log.actionType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={entityBadgeVariants[log.entityType] || "default"}>
                            {log.entityType}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.entityId || "-"}</TableCell>
                        <TableCell>{formatDetails(log.details)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => fetchLogs(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    {pagination.page > 2 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => fetchLogs(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis if needed */}
                    {pagination.page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Previous page if not first */}
                    {pagination.page > 1 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => fetchLogs(pagination.page - 1)}>
                          {pagination.page - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Current page */}
                    <PaginationItem>
                      <PaginationLink isActive>
                        {pagination.page}
                      </PaginationLink>
                    </PaginationItem>
                    
                    {/* Next page if not last */}
                    {pagination.page < pagination.pages && (
                      <PaginationItem>
                        <PaginationLink onClick={() => fetchLogs(pagination.page + 1)}>
                          {pagination.page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis if needed */}
                    {pagination.page < pagination.pages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page */}
                    {pagination.page < pagination.pages - 1 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => fetchLogs(pagination.pages)}>
                          {pagination.pages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => fetchLogs(Math.min(pagination.pages, pagination.page + 1))}
                        disabled={pagination.page === pagination.pages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 