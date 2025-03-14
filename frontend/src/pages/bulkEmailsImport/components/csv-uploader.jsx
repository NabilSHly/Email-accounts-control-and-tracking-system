"use client"

import { useState, useRef } from "react"
import Papa from "papaparse"
import Spreadsheet from "react-spreadsheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, FileType, AlertCircle, Download, X } from "lucide-react"

const CsvUploader = ({ setJsonData }) => {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [csvData, setCsvData] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const columnLabels = ["Name (English)", "Name (Arabic)", "Email", "Password", "Phone Number", "Municipality ID"]

  const data = csvData.map((row) => {
    return row.map((cell) => ({ value: cell }))
  })

  const validateCSVStructure = (headers) => {
    const expectedHeaders =  ["Name (English)", "Name (Arabic)", "Email", "Password", "Phone Number", "Municipality ID"]

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
  }

  const validateEmailFormat = (data) => {
    const invalidEmails = []

    data.forEach((row, index) => {
      const email = row[2] // Email is in the third column
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        invalidEmails.push({ row: index + 2, email }) // +2 because index is 0-based and we skip header row
      }
    })

    return invalidEmails
  }

  const processFile = (selectedFile) => {
    if (!selectedFile) return

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("الرجاء اختيار ملف CSV فقط.")
      setFile(null)
      setFileName("")
      return
    }

    setError("")
    setFile(selectedFile)
    setFileName(selectedFile.name)

    Papa.parse(selectedFile, {
      encoding: "UTF-8",
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.data[0]
        const rows = results.data.slice(1)

        // Validate CSV structure
        if (!validateCSVStructure(headers)) {
          setError(
            'يجب أن يحتوي ملف CSV على الأعمدة التالية: "name in english", "name in arabic", "email", "password", "phoneNumber", "municipality ID".',
          )
          setFile(null)
          setFileName("")
          setCsvData([])
          setJsonData([])
          return
        }

        // Validate email format
        const invalidEmails = validateEmailFormat(rows)
        if (invalidEmails.length > 0) {
          const message =
            invalidEmails.length === 1
              ? `بريد إلكتروني غير صالح في الصف ${invalidEmails[0].row}: ${invalidEmails[0].email}`
              : `${invalidEmails.length} بريد إلكتروني غير صالح. الرجاء التحقق من الصفوف: ${invalidEmails
                  .slice(0, 3)
                  .map((e) => e.row)
                  .join(", ")}${invalidEmails.length > 3 ? "..." : ""}`

          setError(message)
          // We still load the data so they can see and fix the issues
        }

        setCsvData(rows)

        // Map data for json output
        const jsonData = rows.map((row) => {
          return {
            nameInEnglish: row[0] || "",
            nameInArabic: row[1] || "",
            email: row[2] || "",
            password: row[3] || "",
            phoneNumber: row[4] || "",
            municipalityID: row[5] || "",
          }
        })

        setJsonData(jsonData)
        toast.success(`تم تحميل ${jsonData.length} سجل بنجاح`)
      },
      error: (error) => {
        console.error("Error parsing CSV:", error)
        setError("حدث خطأ أثناء تحليل ملف CSV.")
        setFile(null)
        setFileName("")
        setCsvData([])
        setJsonData([])
      },
    })
  }

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
  }

  const downloadTemplate = () => {
    // Create template content with headers
    const templateContent =
      "Name (English),Name (Arabic),Email,Password,Phone Number,Municipality ID"
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

    toast.success("تم تنزيل القالب بنجاح")
  }

  return (
    <div className="flex flex-col w-full gap-6 animate-fade-in">
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-all duration-300 ease-in-out
          ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
          flex flex-col items-center justify-center cursor-pointer relative`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />

        {fileName && (
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
            aria-label="Clear file"
          >
            <X size={16} />
          </button>
        )}

        <div className="flex flex-col items-center gap-4 py-4">
          {fileName ? (
            <>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse-subtle">
                <FileType size={28} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-1">انقر أو اسحب للاستبدال</p>
              </div>
            </>
          ) : (
            <>
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground animate-float">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="font-medium">اسحب وأفلت ملف CSV هنا</p>
                <p className="text-sm text-muted-foreground mt-1">أو انقر لاستعراض الملفات</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start gap-3 animate-scale-in">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={downloadTemplate} className="text-sm" type="button">
          <Download className="ml-2 h-4 w-4" />
          تنزيل القالب
        </Button>
      </div>

      {csvData.length > 0 && (
        <div className="animate-slide-up overflow-hidden rounded-md border">
          <div className="bg-muted/50 px-4 py-2 border-b flex justify-between items-center">
            <p className="text-sm font-medium">معاينة البيانات ({csvData.length} سجل)</p>
          </div>
          <ScrollArea className="h-[400px] w-full">
            <div className="p-2">
              <Spreadsheet data={data} columnLabels={columnLabels} />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default CsvUploader

