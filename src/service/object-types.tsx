
// Document
export type Document = {
    id: number,
    name: string,
    pictureList: Array<string>,
    lastModificationDate: string,
}


// Debug Home
export type debugHome = "show" | "hide"
export const debugHomeDefault: debugHome = "show"
