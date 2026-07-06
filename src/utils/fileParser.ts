import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export interface ColumnInfo {
  name: string
  dataType: 'text' | 'numeric' | 'date'
}

function inferDataType(value: string): 'text' | 'numeric' | 'date' {
  const trimmed = value.trim()
  if (!trimmed) return 'text'

  // Check if numeric first
  const num = Number(trimmed)
  if (!isNaN(num) && !isNaN(parseFloat(trimmed)) && trimmed === String(num)) {
    return 'numeric'
  }

  // Check if date (simple checks for common formats)
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY or DD/MM/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY or DD-MM-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
  ]
  if (datePatterns.some(pattern => pattern.test(trimmed))) {
    return 'date'
  }

  // Try parsing with Date more carefully
  try {
    const date = new Date(trimmed)
    if (!isNaN(date.getTime()) && date.toString() !== 'Invalid Date') {
      return 'date'
    }
  } catch {
    // Do nothing
  }

  return 'text'
}

export async function parseFile(file: File): Promise<ColumnInfo[]> {
  return new Promise((resolve, reject) => {
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        preview: 10, // Only parse first 10 rows for inference
        complete: (results) => {
          if (results.data.length === 0) {
            reject(new Error('Empty CSV file'))
            return
          }
          const headers = results.meta.fields || []
          const columnInfos: ColumnInfo[] = headers.map(header => {
            // Get first non-empty value for this column
            let dataType: 'text' | 'numeric' | 'date' = 'text'
            for (const row of results.data) {
              const value = (row as Record<string, unknown>)[header]
              if (value !== undefined && value !== null && value !== '') {
                dataType = inferDataType(String(value))
                break
              }
            }
            return { name: header, dataType }
          })
          resolve(columnInfos)
        },
        error: (error) => reject(error)
      })
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
          if (jsonData.length === 0) {
            reject(new Error('Empty Excel file'))
            return
          }
          const headers = jsonData[0] as string[]
          const columnInfos: ColumnInfo[] = headers.map((header, index) => {
            let dataType: 'text' | 'numeric' | 'date' = 'text'
            // Check first few rows for data type
            for (let i = 1; i < Math.min(jsonData.length, 11); i++) {
              const row = jsonData[i]
              const value = (row as unknown[])[index]
              if (value !== undefined && value !== null && value !== '') {
                dataType = inferDataType(String(value))
                break
              }
            }
            return { name: header, dataType }
          })
          resolve(columnInfos)
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      reject(new Error('Unsupported file type'))
    }
  })
}
