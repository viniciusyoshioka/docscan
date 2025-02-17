import { Repository } from "typeorm"

import { PictureEntity } from "./picture.entity"


export interface PictureRepository {}


type CustomPictureRepository = ThisType<Repository<PictureEntity>> & PictureRepository


export const customPictureRepository: CustomPictureRepository = {}
