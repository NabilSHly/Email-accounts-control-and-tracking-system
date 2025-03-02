/**
 * Formats department data for display
 * @param {Array|string} departmentsData - Department IDs (array or JSON string)
 * @param {Array} departmentsList - List of all departments
 * @returns {string} Formatted department names
 */
export const formatDepartments = (departmentsData, departmentsList) => {
  let departmentIds = [];
  
  try {
    departmentIds = Array.isArray(departmentsData) 
      ? departmentsData 
      : JSON.parse(departmentsData || '[]');
  } catch (error) {
    console.error("Failed to parse departments:", error);
  }
  
  const departmentNames = departmentIds
    .map(id => {
      const dept = departmentsList.find(d => d.departmentId === id);
      return dept ? dept.department : null;
    })
    .filter(Boolean)
    .join(", ");
  
  return departmentNames || "N/A";
};

/**
 * Formats municipality data for display
 * @param {number} municipalityId - Municipality ID
 * @param {Array} municipalitiesList - List of all municipalities
 * @returns {string} Formatted municipality name
 */
export const formatMunicipality = (municipalityId, municipalitiesList) => {
  const municipality = municipalitiesList.find(
    m => m.municipalityId === municipalityId
  );
  return municipality ? municipality.municipality : "N/A";
};

/**
 * Creates CSV export data from table data
 * @param {Object} table - Table instance
 * @param {Array} columns - Table columns configuration
 * @param {Array} departmentsList - List of all departments
 * @param {Array} municipalitiesList - List of all municipalities
 * @param {Object} columnVisibility - Column visibility state
 * @returns {string} CSV content
 */
export const createCSVExport = (table, columns, departmentsList, municipalitiesList, columnVisibility) => {
  // Get visible columns (except the select column)
  const visibleColumns = columns
    .filter(column => column.id !== 'select' && (columnVisibility[column.accessorKey] !== false))
    .map(column => column.accessorKey);
    
  // Create header row
  const headerRow = visibleColumns.map(key => {
    const column = columns.find(col => col.accessorKey === key);
    return column ? (column.header || key) : key;
  }).join(',');
  
  // Create data rows
  const dataRows = table.getFilteredRowModel().rows.map(row => {
    return visibleColumns.map(key => {
      let cellValue = row.original[key];
      
      // Handle special cases
      if (key === 'municipalityId') {
        cellValue = formatMunicipality(cellValue, municipalitiesList);
      } else if (key === 'departments') {
        cellValue = formatDepartments(cellValue, departmentsList);
      } else if (key === 'createdAt') {
        cellValue = new Date(cellValue).toLocaleDateString();
      }
      
      // Ensure proper CSV formatting
      if (typeof cellValue === 'string' && cellValue.includes(',')) {
        cellValue = `"${cellValue}"`;
      }
      
      return cellValue || '';
    }).join(',');
  }).join('\n');
  
  // Combine header and data rows
  return `${headerRow}\n${dataRows}`;
}; 