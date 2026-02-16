import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

type BuildingParams = {
  latitude: number;
  longitude: number;
};

@Injectable()
export class TrackingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getBuilding({ latitude, longitude }: BuildingParams) {
    const data = (await this.prismaService.$queryRaw`
      SELECT name FROM buildings
      WHERE ST_Contains(geom, ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326));
    `) as { name: string }[];
    return data;
  }
}
