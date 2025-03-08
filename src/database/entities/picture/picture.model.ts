import { EntityManager } from "typeorm"

import { EntityId } from "../../types"
import { CreatePictureDTO, GetPicturesByDocumentIdPaginatedDTO, PictureDTO } from "./dto"
import { PictureEntity } from "./picture.entity"
import { PictureMapper } from "./picture.mapper"
import { customPictureRepository, PictureRepository } from "./picture.repository"


export class PictureModel {
  constructor(private readonly pictureRepository: PictureRepository) {}


  async transaction<T = unknown>(tx: (tx: EntityManager) => Promise<T>): Promise<T> {
    return await this.pictureRepository.transaction(tx)
  }


  async findByDocumentIdPaginated(
    params: GetPicturesByDocumentIdPaginatedDTO,
  ): Promise<PictureDTO[]> {
    const paramsBo = PictureMapper.fromGetPicturesByDocumentIdPaginatedDtoToBo(params)

    // TODO: Add validation

    const pictures = await this.pictureRepository.findByDocumentIdPaginated(paramsBo)
    return pictures.map(PictureMapper.fromEntityToDto)
  }

  async create(params: {
    createDto: CreatePictureDTO
    transaction: EntityManager
  }): Promise<PictureDTO> {
    const { createDto, transaction } = params

    const pictureRepo = transaction.getRepository(PictureEntity).extend(customPictureRepository)
    const createBo = PictureMapper.fromCreateDtoToCreateBo(createDto)

    // TODO: Add validation

    const createdPicture = await pictureRepo.createPicture(createBo)
    return PictureMapper.fromEntityToDto(createdPicture)
  }

  async updateFileName(
    id: EntityId,
    fileName: string,
    transaction: EntityManager,
  ): Promise<PictureDTO> {
    const pictureRepo = transaction.getRepository(PictureEntity).extend(customPictureRepository)

    const updatedPicture = await pictureRepo.updateFileName(id, fileName)
    return PictureMapper.fromEntityToDto(updatedPicture)
  }
}
