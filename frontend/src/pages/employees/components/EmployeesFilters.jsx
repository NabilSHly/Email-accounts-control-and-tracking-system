import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';

// Filter options with non-empty values
const ALL_DEPARTMENTS = "all_depts";
const ALL_MUNICIPALITIES = "all_munis";
const ALL_STATUSES = "all_status";
const ALL_REPORTED = "all_reported";

export default function EmployeesFilters({ filters, setFilters, departments, municipalities }) {
  // Destructure filters for convenience
  const { search, department, municipality, status, reported } = filters;
  
  // Update a single filter value
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>بحث</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="بحث..."
            value={search}
            onChange={e => updateFilter('search', e.target.value)}
            className="w-full md:w-auto max-w-sm"
          />
           <div className='flex items-center justify-center gap-1'>
          <Label className="">الأقسام : </Label>
          <Select 
            value={department || ALL_DEPARTMENTS} 
            onValueChange={value => updateFilter('department', value === ALL_DEPARTMENTS ? '' : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_DEPARTMENTS}>All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.departmentId} value={dept.departmentId.toString()}>
                  {dept.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          <div className='flex items-center justify-center gap-1'>
          <Label className="">البلديات : </Label>
          <Select 
            value={municipality || ALL_MUNICIPALITIES} 
            onValueChange={value => updateFilter('municipality', value === ALL_MUNICIPALITIES ? '' : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Municipality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_MUNICIPALITIES}>All Municipalities</SelectItem>
              {municipalities.map(muni => (
                <SelectItem key={muni.municipalityId} value={muni.municipalityId.toString()}>
                  {muni.municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          <div className='flex items-center justify-center gap-1'>
          <Label className="">الحالة : </Label>
          <Select 
            value={status || ALL_STATUSES} 
            onValueChange={value => updateFilter('status', value === ALL_STATUSES ? '' : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
          </div>
          <div className='flex items-center justify-center gap-1'>
          <Label className="">تم الابلاغ : </Label>
          <Select 
            value={reported || ALL_REPORTED} 
            onValueChange={value => updateFilter('reported', value === ALL_REPORTED ? '' : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Reported" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_REPORTED}>All</SelectItem>
              <SelectItem value="true">Reported</SelectItem>
              <SelectItem value="false">Not Reported</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
      </CardContent>
    </Card>
  );
} 