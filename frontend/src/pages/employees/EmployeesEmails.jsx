import React, { useState, useMemo } from 'react';
import EmployeesTable from './components/EmployeesTable';
import EmployeesFilters from './components/EmployeesFilters';
import { mockEmployees, mockDepartments, mockMunicipalities } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function EmployeesEmails() {
  // Use mock data directly
  const [employees] = useState(mockEmployees);
  const [departments] = useState(mockDepartments);
  const [municipalities] = useState(mockMunicipalities);
  const [error] = useState('');
  
  // Filter states - simplified to a single object
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    municipality: '',
    status: '',
    reported: ''
  });

  // Expand employees data to have one row per department
  const expandedEmployees = useMemo(() => {
    return employees.flatMap(employee => {
      // If employee has no departments, return single row
      if (!employee.departments || employee.departments.length === 0) {
        return [{
          ...employee,
          singleDepartmentId: null,
          rowId: `${employee.employeeId}-null` // Unique row ID
        }];
      }
      
      // Create one row per department
      return employee.departments.map(deptId => ({
        ...employee,
        singleDepartmentId: deptId, // Store the single department ID
        rowId: `${employee.employeeId}-${deptId}` // Unique row ID
      }));
    });
  }, [employees]);

  // Filter data
  const filteredData = useMemo(() => {
    return expandedEmployees.filter(emp => {
      // Department filter
      const deptMatch = !filters.department || 
        emp.singleDepartmentId === Number(filters.department);
      
      // Municipality filter
      const muniMatch = !filters.municipality || 
        emp.municipalityId === Number(filters.municipality);
      
      // Status filter
      const statusMatch = !filters.status || 
        emp.status === filters.status;
      
      // Reported filter
      const reportedMatch = !filters.reported || 
        emp.reported === (filters.reported === 'true');
      
      // Search filter (case insensitive)
      const searchMatch = !filters.search || 
        Object.values(emp).some(value => 
          typeof value === 'string' && 
          value.toLowerCase().includes(filters.search.toLowerCase())
        );
      
      return deptMatch && muniMatch && statusMatch && reportedMatch && searchMatch;
    });
  }, [expandedEmployees, filters]);

  return (
    <div className="p-6 bg-pIsabelline w-full mt-12 border rounded">
      <h1 className="text-2xl font-bold mb-5">عنوين البريد الالكتروني لموظفي مكاتب و ادرات البلديات</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
     
      <EmployeesFilters 
        filters={filters}
        setFilters={setFilters}
        departments={departments}
        municipalities={municipalities}
      />
      
      <EmployeesTable 
        data={filteredData}
        departments={departments}
        municipalities={municipalities}
        searchTerm={filters.search}
      />
    </div>
  );
}
