// Format department names
export const formatDepartments = (departmentsData, departmentsList) => {
  let departmentIds = [];
  
  try {
    departmentIds = Array.isArray(departmentsData) 
      ? departmentsData 
      : JSON.parse(departmentsData || '[]');
  } catch (error) {
    console.error("Failed to parse departments");
  }
  
  return departmentIds
    .map(id => {
      const dept = departmentsList.find(d => d.departmentId === id);
      return dept?.department;
    })
    .filter(Boolean)
    .join(", ") || "N/A";
};

// Format municipality name
export const formatMunicipality = (id, list) => {
  const item = list.find(m => m.municipalityId === id);
  return item ? item.municipality : "N/A";
};

// Create CSV data
export const createCSV = (data, columns) => {
  const header = columns.map(col => col.header || col.id).join(',');
  const rows = data.map(row => 
    columns.map(col => {
      let value = row[col.id];
      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      return value || '';
    }).join(',')
  ).join('\n');
  
  return `${header}\n${rows}`;
};

// Download CSV file
export const downloadCSV = (content, filename = 'data.csv') => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 