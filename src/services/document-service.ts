import { NativeModules } from "react-native"


const { DocumentService } = NativeModules


export function deletePicturesService(pictures: string[]) {
    DocumentService.deletePictures(pictures, "Apagando imagens")
}


export function copyPicturesService(pictures: string[]) {
    DocumentService.copyPictures(pictures, "Copiando imagens")
}


export function movePicturesService(pictures: string[]) {
    DocumentService.movePictures(pictures, "Movendo imagens")
}
