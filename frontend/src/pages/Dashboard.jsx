import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "@/context/AuthContext"; // Import context
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Building2, Landmark, AlertCircle, MailWarning } from "lucide-react";
import { Link } from 'react-router';
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Import API services
import { fetchDashboardStats, fetchAuditLogs } from '@/services/api';

export default function Dashboard() {
  const { userData } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingRequests: 0,
    totalDepartments: 0,
    totalMunicipalities: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, logsData] = await Promise.all([
          fetchDashboardStats(),
          fetchAuditLogs() // Limit to 5 most recent logs
        ]);
  console.log(statsData, logsData);
  
        setStats(statsData);
        setRecentActivity(logsData || []); // Ensure logsData is always an array
        setError(""); // Clear any previous error
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError("Failed to load dashboard data. Please refresh the page.");
        toast.error("فشل تحميل بيانات  ", {
          description: "تعذر تحميل إحصائيات لوحة المعلومات والنشاط. يرجى محاولة التحديث."
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-200 rounded hover:bg-red-300"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
               مستخدمي النظام 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              الحسابات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.activeEmployees}</div>
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              الطلبات المعلقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <MailWarning className="h-5 w-5 text-muted-foreground" />
            </div>
            {stats.pendingRequests > 0 && userData?.permissions?.includes('ADMIN') && (
              <Link 
                to="/employees/create" 
                className="text-xs text-primary hover:underline mt-2 block"
              >
                عرض الطلبات المعلقة
              </Link>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              الأقسام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalDepartments}</div>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              البلديات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalMunicipalities}</div>
              <Landmark className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاطات الأخيرة</CardTitle>
          <CardDescription>
            آخر الإجراءات التي تمت في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              لا توجد نشاطات حديثة
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">التاريخ والوقت</TableHead>
                  <TableHead className="text-start">المستخدم</TableHead>
                  <TableHead className="text-start">الإجراء</TableHead>
                  <TableHead className="text-start">الكيان</TableHead>
                  <TableHead className="text-start">uniqueId </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {new Date(activity.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{activity.username}</TableCell>
                    <TableCell>
                      <Badge variant={actionBadgeVariants[activity.actionType] || "outline"}>
                        {activity.actionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entityBadgeVariants[activity.entityType] || "outline"}>
                        {activity.entityType}
                      </Badge>
                    </TableCell>
                    <TableCell>{activity.entityId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
