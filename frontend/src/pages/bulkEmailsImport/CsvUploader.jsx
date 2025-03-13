import React, { useState } from 'react';
import Papa from 'papaparse';
import Spreadsheet from 'react-spreadsheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CsvUploader({ setjsonData }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [csvData, setCsvData] = useState([]);
  const columnLabels = ["name in english", "name in arabic", "email", "password", "phoneNumber", "municipality ID"];

  const data = csvData.map((e) => {
    return [
      { value: e[0] }, // name in English
      { value: e[1] }, // name in Arabic
      { value: e[2] }, // email
      { value: e[3] }, // password
      { value: e[4] }, // phoneNumber
      { value: e[5] }, // municipality ID
    ];
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type !== 'text/csv') {
      setError('يرجى تحديد ملف CSV فقط.');
    } else {
      setError('');
      setFile(selectedFile);

      Papa.parse(selectedFile, {
        encoding: 'UTF-8',
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.data[0];

          // Validate CSV structure
          if (!validateCSVStructure(headers)) {
            setError('يجب أن يحتوي الملف CSV على الأعمدة "name in english", "name in arabic", "email", "password", "phoneNumber", "municipality ID".');
            setFile(null);
            setCsvData([]);
            return; // stop further execution
          }

          setCsvData(results.data.slice(1)); // Exclude headers
          
          // Map data for json output
          const jsonData = results.data.slice(1).map((e) => {
            return {
              nameInEnglish: e[0],
              nameInArabic: e[1],
              email: e[2],
              password: e[3],
              phoneNumber: e[4],
              municipalityID: e[5],
            };
          });

          setjsonData(jsonData);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setError('حدث خطأ أثناء تحليل الملف CSV.');
          setFile(null);
          setCsvData([]);
        },
      });
    }
  };

  // Helper function to validate CSV header structure
  const validateCSVStructure = (headers) => {
    const expectedHeaders = [
      "name in english", 
      "name in arabic", 
      "email", 
      "password", 
      "phoneNumber", 
      "municipality ID"
    ];
    return headers.length >= expectedHeaders.length && 
           expectedHeaders.every((header, index) => header === headers[index]);
  };

  return (
    <main className='self-center'>
      <div className='flex flex-col items-center mb-4 justify-center'>
        <label className="cursor-pointer bg-blue-900 text-white rounded py-2 px-4 inline-flex items-center">
          <span>ارفق ملف</span>
          <input
            name="csv"
            className="opacity-0"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </label>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <div className='flex  justify-center '>
        <ScrollArea className="h-4/6  rounded-md border p-2">
          <Spreadsheet data={data} columnLabels={columnLabels} />
        </ScrollArea>
      </div>
    </main>
  );
}
