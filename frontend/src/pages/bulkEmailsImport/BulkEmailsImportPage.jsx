import React , { useState } from 'react'

  import { Button } from "@/components/ui/button"
import CsvUploader from './CsvUploader';
  
export default function BulkEmailsImport() {
  const [jsonData, setjsonData] = useState({});

      const handleSubmit = async (event) => {
        event.preventDefault();
        setOpen(false);
    
        if (Object.keys(jsonData).length === 0) {
          toast({ title: "خطأ", description: "لا يوجد بيانات للرفع" });
          return;
        }
    
        try {
        //   await addAssetsFromCSV(jsonData);
          toast({ title: "تمت الإضافة بنجاح", description: "تم رفع الأصول بنجاح" });
        } catch (error) {
          toast({ title: "خطأ", description: "حدث خطأ أثناء إضافة الأصول" });
        }
      };
    
  return (
    <form onSubmit={handleSubmit} className='border mt-4'>

     <CsvUploader setjsonData={setjsonData} />    
     <Button type="submit">Upload</Button>

    </form>
  )
}
