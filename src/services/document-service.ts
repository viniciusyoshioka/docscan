import { NativeModules } from "react-native"


const { DocumentService } = NativeModules


/**
 * Invokes a service to delete files
 * 
 * @param pictures array of file paths to be deleted
 */
export function deletePicturesService(pictures: string[]) {
    DocumentService.deletePictures(pictures, "Apagando imagens")
}


/**
 * Invokes a service to copy files
 * 
 * @param pictures array of file paths to be copied.
 * 
 * Obs.: The from and to paths are followed in the array.
 * I.e. ["/path/from/1", "/path/to/1", "/path/from/2", "/path/to/2"]
 */
export function copyPicturesService(pictures: string[]) {
    DocumentService.copyPictures(pictures, "Copiando imagens")
}


/**
 * Invokes a service to move files
 * 
 * @param pictures array of file paths to be moved.
 * 
 * Obs.: The from and to paths are followed in the array.
 * I.e. ["/path/from/1", "/path/to/1", "/path/from/2", "/path/to/2"]
 */
export function movePicturesService(pictures: string[]) {
    DocumentService.movePictures(pictures, "Movendo imagens")
}
