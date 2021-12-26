import { getDateTime } from "./date"


export function getDocumentName(): string {
    return `Documento ${getDateTime("-", "-", true)}`
}
