import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLocation } from 'react-router';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
const API_URL = import.meta.env.VITE_API_URL;

/* ====================
   Validation Schemas
==================== */
const newEmailSchema = z.object({
  engFirstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  engFatherName: z.string().min(2, { message: "Father's name must be at least 2 characters." }),
  engLastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  arFirstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  arMiddleName: z.string().min(2, { message: 'Middle name must be at least 2 characters.' }),
  arLastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  departments: z.array(z.number()).min(1, { message: 'Select at least one department.' }),
  nationalID: z.string().min(12, { message: 'National ID must be at least 12 digits.' }),
  municipalityId: z.number({ message: 'Municipality is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  phoneNumber: z
    .string().max(10,{message:'لازم اقل من 10 ارقام يا حاتم (>_<).'})
    .min(10, { message: 'Phone number must be at least 10 digits.' })
    .regex(/^[0-9]+$/, { message: 'Phone number must contain only digits.' }).startsWith('09', {
      message:"لازم يبدا ب 09"
    }),
  notes: z.string().optional(),
});

const approveRequestSchema = z.object({
  requestId: z.number({ message: 'Please select a request to approve.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

/* ====================
   Custom Hook for Data Fetching
==================== */
const useFetchData = () => {
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const [deptResponse, muniResponse, pendingResponse] = await Promise.all([
            axios.get(`${API_URL}/departments`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            }),
            axios.get(`${API_URL}/municipalities`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            }),
            axios.get(`${API_URL}/employees/pending`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            }),
          ]);
          
          setDepartments(deptResponse.data);
          setMunicipalities(muniResponse.data);
          setPendingRequests(pendingResponse.data);
          
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data', {
          description: 'Could not load required data. Please try refreshing.',
        });
      }
    };

    fetchData();
  }, []);

  return { departments, municipalities, pendingRequests, setPendingRequests };
};


/* ====================
   Helper Functions
==================== */
const generateEmail = (engname) => {
  const nameParts = engname.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0].toLowerCase()}.${nameParts[nameParts.length - 1].toLowerCase()}@mun.lgm.gov.ly`;
  }
  return '';
};

const generateRandomPassword = (engname) => {
  const nameParts = engname.split(' ');
  if (nameParts.length >= 2) {
    const firstName = nameParts[0];
    const lastName = nameParts[0];

    // Extracting first 2 letters of the first and last name and formatting
    const firstPart = firstName.slice(0, 2).toUpperCase();
    const lastPart = lastName.slice(0, 2).toLowerCase();

    // Returning the password in the format you described
    return `${firstPart}@2023${lastPart}`;
  }
  return '';  // Return an empty string if the name doesn't meet the criteria
};

/* ====================
   New Email Form Component
==================== */
const NewEmailForm = ({ departments, municipalities, onSuccess }) => {
  const form = useForm({
    resolver: zodResolver(newEmailSchema),
    defaultValues: {
      engFirstName: '',
      engFatherName: '',
      engLastName: '',
      arFirstName: '',
      arMiddleName: '',
      arLastName: '',
      nationalID: '',
      departments: [],
      municipalityId: undefined,
      email: '',
      password: '',
      phoneNumber: '',
      notes: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMunicipalities = useMemo(() => {
    if (!searchTerm) return municipalities;
    return municipalities.filter((muni) =>
      muni.municipality.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [municipalities, searchTerm]);
  

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const fullEngName = `${data.engFirstName} ${data.engFatherName} ${data.engLastName}`;
      const fullArName = `${data.arFirstName} ${data.arMiddleName} ${data.arLastName}`;
      const payload = {
        engname: fullEngName,
        arname: fullArName,
        nationalID: data.nationalID,
        departments: data.departments,
        municipalityId: data.municipalityId,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        notes: data.notes,
      };
      

        await axios.post(`${API_URL}/employees/admin`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
      toast.success('تم إنشاء البريد الإلكتروني', {
        description: 'تم إنشاء حساب البريد الإلكتروني الجديد للموظف بنجاح.',
        duration: 5000,
      });
      form.reset();
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error creating email:', error);
      toast.error('Creation Failed', {
        description:
          error.response?.data?.message ||
          'An error occurred while creating the email account.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} dir='rtl' className="space-y-6">
        {/* English Name Fields */}
        <div className="flex items-center  gap-6">

          <FormField
            control={form.control}
            name="engFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الاول بالانجليزي</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="engFatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الاب بالانجليزي</FormLabel>
                <FormControl>
                  <Input placeholder="Father's Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="engLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اللقب بالانجليزي</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Arabic Name Fields */}
        <div className="flex items-center  gap-6">
          <FormField
            control={form.control}
            name="arFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الأول</FormLabel>
                <FormControl>
                  <Input placeholder="الاسم الأول" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arMiddleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم الأب</FormLabel>
                <FormControl>
                  <Input placeholder="اسم الأب" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اللقب</FormLabel>
                <FormControl>
                  <Input placeholder="اللقب" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* National ID */}
        <FormField
          control={form.control}
          name="nationalID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرقم الوطني</FormLabel>
              <FormControl>
                <Input placeholder="الرقم الوطني" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email & Password */}
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input placeholder="example@domain.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>كلمة المرور</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input placeholder="09xxxxxxxx" type="tel" pattern="[0-9]*" {...field} />
              </FormControl>
              <FormDescription>رقم الهاتف للتواصل مع الموظف</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Municipality */}
        <FormField
          control={form.control}
          name="municipalityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البلدية</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البلدية" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="sticky top-0 p-2 bg-background">
                    <Input
                      placeholder="ابحث عن البلدية..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                  {filteredMunicipalities.map((muni) => (
                    <SelectItem key={muni.municipalityId} value={muni.municipalityId.toString()}>
                      {muni.municipality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Departments */}
        <FormField
          control={form.control}
          name="departments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المكاتب/ الإدارات</FormLabel>
              <FormDescription>اختر الإدارات التي ينتمي إليها الموظف</FormDescription>
              <FormControl>
                <MultiSelector
                  values={field.value.map((id) => id.toString())}
                  onValuesChange={(values) => field.onChange(values.map((v) => Number(v)))}
                  loop
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="اختر الاقسام" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {departments.map((dept) => (
                        <MultiSelectorItem
                          key={dept.departmentId}
                          value={dept.departmentId.toString()}
                        >
                          {dept.department}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات</FormLabel>
              <FormControl>
                <Textarea placeholder="اي معلومات اضافية" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting }>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري إنشاء البريد...
            </>
          ) : (
            'إنشاء البريد الإلكتروني'
          )}
        </Button>
      </form>
    </Form>
  );
};

/* ====================
   Approve Request Form Component
==================== */
const ApproveRequestForm = ({ selectedRequest, departments, municipalities, onRequestApproved }) => {
  const form = useForm({
    resolver: zodResolver(approveRequestSchema),
    defaultValues: {
      requestId: selectedRequest?.employeeId || undefined,
      email: selectedRequest ? generateEmail(selectedRequest.engname) : '',
      password: selectedRequest ? generateRandomPassword(selectedRequest.engname) : '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
console.log(selectedRequest,"dd");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
        await axios.post(
          `${API_URL}/employees/${data.requestId}/approve`,
          {
            email: data.email,
            password: data.password,
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
        );
      toast.success('تمت الموافقة على الطلب', {
        description: 'تم إنشاء حساب البريد الإلكتروني وتمت الموافقة على الطلب.',
        duration: 5000,
      });
      onRequestApproved(data.requestId);
      form.reset();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Approval Failed', {
        description:
          error.response?.data?.message ||
          'An error occurred while approving the request.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden Request ID */}
        <FormField
          control={form.control}
          name="requestId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value={selectedRequest.employeeId} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Request Details */}
        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2">تفاصيل الطلب</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              الاسم بالإنجليزية:{' '}
              <span className="font-medium">{selectedRequest.engname}</span>
            </div>
            <div>
              الاسم بالعربية:{' '}
              <span className="font-medium">{selectedRequest.arname}</span>
            </div>
            <div>
              رقم الهاتف:{' '}
              <span className="font-medium">{selectedRequest.phoneNumber}</span>
            </div>
            <div>
              البلدية:{' '}
              <span className="font-medium">
                {municipalities.find((m) => m.municipalityId === selectedRequest.municipalityId)
                  ?.municipality || 'غير معروف'}
              </span>
            </div>
            <div className="col-span-2">
              الإدارات:{' '}
              <span className="font-medium">
              {Array.isArray(selectedRequest.departments?.set) && selectedRequest.departments?.set
  .map((deptId) => departments.find((d) => d.departmentId === deptId)?.department)
  .join(', ')}

              </span>
            </div>
          </div>
        </div>

        {/* Email & Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input placeholder="example@domain.com" {...field} />
                </FormControl>
                <FormDescription>أدخل عنوان البريد الإلكتروني للموظف</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="text" {...field} />
                </FormControl>
                <FormDescription>الكلمة الأولية للحساب</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* disabled={isSubmitting || !form.formState.isValid} */}
        <Button type="submit" className="w-full" >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الموافقة...
            </>
          ) : (
            'الموافقة وإنشاء البريد الإلكتروني'
          )}
        </Button>
      </form>
    </Form>
  );
};


export default function CreateEmail() {
  
  const location = useLocation();
  const defaultTab = location.state?.activeTab || 'new';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const { departments, municipalities, pendingRequests, setPendingRequests } = useFetchData();
  
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleRequestSelect = useCallback((request) => {
    setSelectedRequest(request);
  }, []);

  const handleRequestApproved = (approvedId) => {
    setPendingRequests((prev) => prev.filter((req) => req.employeeId !== approvedId));
    setSelectedRequest(null);
  };

  return (
    <div className="w-3/4 mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">إنشاء بريد إلكتروني</CardTitle>
              <CardDescription>
                إنشاء بريد إلكتروني جديد للموظفين أو الموافقة على طلبات البريد المعلقة
              </CardDescription>
            </div>
            <Badge variant={activeTab === 'new' ? 'default' : 'outline'} className="ml-2">
              {pendingRequests.length} طلب معلق
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="new">
                <Plus className="h-4 w-4 mr-2" />
                إنشاء بريد جديد
              </TabsTrigger>
              <TabsTrigger value="pending">
                <RefreshCw className="h-4 w-4 mr-2" />
                الموافقة على الطلبات المعلقة
              </TabsTrigger>
            </TabsList>

            {/* New Email Tab */}
            <TabsContent value="new">
              <NewEmailForm
                departments={departments}
                municipalities={municipalities}
                onSuccess={() => setActiveTab('pending')}
              />
            </TabsContent>

            {/* Pending Requests Tab */}
            <TabsContent value="pending">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Requests List */}
                <div className="md:col-span-1 border rounded-md">
                  <div className="p-4 border-b font-medium">الطلبات المعلقة</div>
                  <ScrollArea className="h-[400px]">
                    {pendingRequests.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        لا توجد طلبات معلقة
                      </div>
                    ) : (
                      <div className="divide-y">
                        {pendingRequests.map((request) => (
                          <div
                            key={request.employeeId}
                            className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                              selectedRequest?.employeeId === request.employeeId ? 'bg-muted' : ''
                            }`}
                            onClick={() => handleRequestSelect(request)}
                          >
                            <div className="font-medium">{request.engname}</div>
                            <div className="text-sm text-muted-foreground">{request.arname}</div>
                            <div className="text-xs mt-1 flex justify-between">
                              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                              <Badge variant="outline" size="sm">
                                {request.phoneNumber}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Approve Request Form */}
                <div className="md:col-span-2">
                  {selectedRequest ? (
                    <ApproveRequestForm
                      selectedRequest={selectedRequest}
                      departments={departments}
                      municipalities={municipalities}
                      onRequestApproved={handleRequestApproved}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground border rounded-md">
                      <div className="mb-2">يرجى اختيار طلب من القائمة للموافقة عليه</div>
                      {pendingRequests.length === 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('new')}
                          className="mt-4"
                        >
                          إنشاء بريد إلكتروني جديد
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            * سيتم إرسال بيانات الدخول للموظف بعد إنشاء البريد الإلكتروني.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
