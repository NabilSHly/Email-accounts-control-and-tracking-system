import React, { useState, useMemo, useEffect,useContext } from 'react';
import EmployeesTable from './components/EmployeesTable';
import EmployeesFilters from './components/EmployeesFilters';
import { fetchEmployees, fetchDepartments, fetchMunicipalities } from '@/services/api';
import { Spinner } from '@/components/ui/spinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AuthContext from '@/context/AuthContext';
import PropTypes from 'prop-types';

export default function EmployeesEmailsWrapper() {
  return (
    <ErrorBoundary>
      <EmployeesEmails />
    </ErrorBoundary>
  );
}

function EmployeesEmails() {
   const { userData } = useContext(AuthContext);
  
  // State for data from API
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states - simplified to a single object
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    municipality: '',
    status: '',
    reported: ''
  });

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesData, departmentsData, municipalitiesData] = await Promise.all([
          fetchEmployees(),
          fetchDepartments(),
          fetchMunicipalities()
        ]);
console.log([employeesData, departmentsData, municipalitiesData]);

        setEmployees(employeesData);
        setDepartments(departmentsData);
        setMunicipalities(municipalitiesData);
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Expand employees data to have one row per department
  const expandedEmployees = useMemo(() => {
    return employees.flatMap(employee => {
      // Handle cases where employee.departments is an object with a "set" array
      const departments = Array.isArray(employee.departments?.set) ? employee.departments.set : [];
  
      // If no departments, return a single row with null for department ID
      if (departments.length === 0) {
        return [{
          ...employee,
          singleDepartmentId: null,
          rowId: `${employee.employeeId}-null` // Unique row ID
        }];
      }
  
      // Create one row per department
      return departments.map(deptId => ({
        ...employee,
        singleDepartmentId: deptId, // Store the single department ID
        rowId: `${employee.employeeId}-${deptId}` // Unique row ID
      }));
    });
  }, [employees]);
  
  // Add type checking for filter values
  const filteredData = useMemo(() => {
    return expandedEmployees.filter(emp => {
      const departmentId = Number(filters.department);
      const municipalityId = Number(filters.municipality);
      
      // Department filter
      const deptMatch = !filters.department || 
        (emp.singleDepartmentId === departmentId && !isNaN(departmentId));
      
      // Municipality filter
      const muniMatch = !filters.municipality || 
        (emp.municipalityId === municipalityId && !isNaN(municipalityId));
      
      // Other filters remain the same
      const statusMatch = !filters.status || emp.status === filters.status;
      const reportedMatch = !filters.reported || 
        emp.reported === (filters.reported === 'true');
      const searchMatch = !filters.search || 
        Object.values(emp).some(value => 
          typeof value === 'string' && 
          value.toLowerCase().includes(filters.search.toLowerCase())
        );
      
      return deptMatch && muniMatch && statusMatch && reportedMatch && searchMatch;
    });
  }, [expandedEmployees, filters]);

  // Memoize the error message component
  const ErrorMessage = useMemo(() => {
    if (!error) return null;
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }, [error]);

  return (
    <div className="p-6 bg-pIsabelline w-full mt-12 border rounded">
      <h1 className="text-2xl font-bold mb-5">عنوين البريد الالكتروني لموظفي مكاتب و ادرات البلديات</h1>
      {ErrorMessage}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
          <span className="ml-2">Loading data...</span>
        </div>
      ) : (
        <>
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
            userPermissions={userData.permissions}
          />
        </>
      )}
    </div>
  );
}

EmployeesEmails.propTypes = {
  // Add if needed based on your components
};

EmployeesFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    department: PropTypes.string,
    municipality: PropTypes.string,
    status: PropTypes.string,
    reported: PropTypes.string
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  departments: PropTypes.array.isRequired,
  municipalities: PropTypes.array.isRequired
};
