export interface IDateFormatter {
  formatDate(date?: Date | number): string
  formatTime(date?: Date | number): string
  formatDateTime(date?: Date | number): string

  getLocaleDate(date?: Date | number): string
  getLocaleTime(date?: Date | number): string
  getLocaleDateTime(date?: Date | number): string
}
