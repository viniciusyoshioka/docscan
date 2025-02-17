import { PictureRepository } from "./picture.repository"


export class PictureModel {
  constructor(private readonly pictureRepository: PictureRepository) {}
}
