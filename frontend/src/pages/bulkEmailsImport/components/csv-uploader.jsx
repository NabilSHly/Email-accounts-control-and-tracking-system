"use client"

import { useState, useRef, useCallback } from "react"
import Papa from "papaparse"
import Spreadsheet from "react-spreadsheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, FileType, AlertCircle, Download, X } from 'lucide-react'

const CsvUploader = ({ setJsonData, language = "ar" }) => {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [csvData, setCsvData] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const columnLabels = ["Name (English)", "Name (Arabic)","National ID", "Email", "Password", "Phone Number", "Municipality ID"]
  
  const expectedHeaders = columnLabels

  const data = csvData.map((row) => {
    return row.map((cell) => ({ value: cell }))
  })

  const validateCSVStructure = useCallback((headers) => {
    // Case insensitive match
    const normalizedHeaders = headers.map((h) => h.trim().toLowerCase())
    const normalizedExpected = expectedHeaders.map((h) => h.trim().toLowerCase())

    return (
      normalizedHeaders.length >= normalizedExpected.length &&
      normalizedExpected.every(
        (header, index) =>
          normalizedHeaders[index].includes(header) || normalizedHeaders[index].includes(header.replace(" ", "")),
      )
    )
  }, [expectedHeaders])

  const validateEmailFormat = useCallback((data) => {
    const invalidEmails = []

    data.forEach((row, index) => {
      const email = row[3] // Email is in the third column
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        invalidEmails.push({ row: index + 2, email }) // +2 because index is 0-based and we skip header row
      }
    })

    return invalidEmails
  }, [])

  const processFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError(language === "ar" ? "الرجاء اختيار ملف CSV فقط." : "Please select only CSV files.")
      setFile(null)
      setFileName("")
      return
    }

    setError("")
    setFile(selectedFile)
    setFileName(selectedFile.name)
    setIsProcessing(true)

    try {
      const results = await new Promise((resolve, reject) => {
        Papa.parse(selectedFile, {
          encoding: "UTF-8",
          skipEmptyLines: true,
          complete: resolve,
          error: reject,
        })
      })

      const headers = results.data[0]
      const rows = results.data.slice(1).filter(row => row.some(cell => cell.trim() !== "")) // Filter out empty rows

      // Validate CSV structure
      if (!validateCSVStructure(headers)) {
        const errorMsg = language === "ar" 
          ? `يجب أن يحتوي ملف CSV على الأعمدة التالية: ${expectedHeaders.join(", ")}`
          : `CSV file must contain the following columns: ${expectedHeaders.join(", ")}`
        
        setError(errorMsg)
        setFile(null)
        setFileName("")
        setCsvData([])
        setJsonData([])
        setIsProcessing(false)
        return
      }

      // Validate email format
      const invalidEmails = validateEmailFormat(rows)
      if (invalidEmails.length > 0) {
        const message = language === "ar"
          ? invalidEmails.length === 1
            ? `بريد إلكتروني غير صالح في الصف ${invalidEmails[0].row}: ${invalidEmails[0].email}`
            : `${invalidEmails.length} بريد إلكتروني غير صالح. الرجاء التحقق من الصفوف: ${invalidEmails
                .slice(0, 3)
                .map((e) => e.row)
                .join(", ")}${invalidEmails.length > 2 ? "..." : ""}`
          : invalidEmails.length === 1
            ? `Invalid email in row ${invalidEmails[0].row}: ${invalidEmails[0].email}`
            : `${invalidEmails.length} invalid emails. Please check rows: ${invalidEmails
                .slice(0, 3)
                .map((e) => e.row)
                .join(", ")}${invalidEmails.length > 2 ? "..." : ""}`

        setError(message)
        // We still load the data so they can see and fix the issues
      }

      setCsvData(rows)

      // Map data for json output
      const jsonData = rows.map((row) => {
        return {
          nameInEnglish: row[0] || "",
          nameInArabic: row[1] || "",
          nationalID: row[2] || "",
          email: row[3] || "",
          password: row[4] || "",
          phoneNumber: row[5] || "",
          municipalityID: row[6] || "",

          
        }
      })

      setJsonData(jsonData)
      toast.success(
        language === "ar" 
          ? `تم تحميل ${jsonData.length} سجل بنجاح` 
          : `Successfully loaded ${jsonData.length} records`
      )
    } catch (error) {
      console.error("Error parsing CSV:", error)
      setError(
        language === "ar" 
          ? "حدث خطأ أثناء تحليل ملف CSV." 
          : "An error occurred while parsing the CSV file."
      )
      setFile(null)
      setFileName("")
      setCsvData([])
      setJsonData([])
    } finally {
      setIsProcessing(false)
    }
  }, [language, setJsonData, validateCSVStructure, validateEmailFormat])

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearFile = (e) => {
    e.stopPropagation()
    setFile(null)
    setFileName("")
    setCsvData([])
    setJsonData([])
    setError("")
    
    // Reset file input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadTemplate = () => {
    // Create template content with headers
    const templateContent = columnLabels.join(",")
    
    // Create a blob from the CSV content
    const blob = new Blob([templateContent], { type: "text/csv;charset=utf-8;" })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "email_import_template.csv")

    // Append the link to the body
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(
      language === "ar" 
        ? "تم تنزيل القالب بنجاح" 
        : "Template downloaded successfully"
    )
  }

  const dropzoneText = {
    title: language === "ar" ? "اسحب وأفلت ملف CSV هنا" : "Drag and drop a CSV file here",
    subtitle: language === "ar" ? "أو انقر لاستعراض الملفات" : "or click to browse files",
    fileSelected: language === "ar" ? "انقر أو اسحب للاستبدال" : "Click or drag to replace",
  }

  return (
    <div className="flex flex-col w-full gap-6 animate-fade-in" dir={language === "ar" ? "rtl" : "ltr"}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-all duration-300 ease-in-out
          ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
          ${isProcessing ? "opacity-70 cursor-wait" : "cursor-pointer"}
          flex flex-col items-center justify-center relative`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        role="button"
        tabIndex={0}
        aria-label={language === "ar" ? "منطقة تحميل ملف CSV" : "CSV file upload area"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            triggerFileInput()
          }
        }}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="hidden" 
          aria-hidden="true"
          disabled={isProcessing}
        />

        {fileName && (
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
            aria-label={language === "ar" ? "مسح الملف" : "Clear file"}
            disabled={isProcessing}
          >
            <X size={16} />
          </button>
        )}

        <div className="flex flex-col items-center gap-4 py-4">
          {fileName ? (
            <>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse-subtle">
                {isProcessing ? (
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileType size={28} />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-1">{dropzoneText.fileSelected}</p>
              </div>
            </>
          ) : (
            <>
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground animate-float">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="font-medium">{dropzoneText.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{dropzoneText.subtitle}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start gap-3 animate-scale-in" role="alert">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={downloadTemplate} 
          className="text-sm" 
          type="button"
          disabled={isProcessing}
        >
          <Download className={language === "ar" ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
          {language === "ar" ? "تنزيل القالب" : "Download Template"}
        </Button>
      </div>

      {csvData.length > 0 && (
        <div className="animate-slide-up overflow-hidden rounded-md border">
          <div className="bg-muted/50 px-4 py-2 border-b flex justify-between items-center">
            <p className="text-sm font-medium">
              {language === "ar" 
                ? `معاينة البيانات (${csvData.length} سجل)` 
                : `Data Preview (${csvData.length} records)`}
            </p>
          </div>
          <ScrollArea className="h-[400px] w-full">
            <div className="p-2">
              <Spreadsheet 
                data={data} 
                columnLabels={columnLabels} 
                className="w-full"
              />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default CsvUploader
