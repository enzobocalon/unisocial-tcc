import { Resolver, Query } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { OnModuleInit } from '@nestjs/common';
import { Course } from './entity/course.entity';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@Resolver()
export class CoursesResolver implements OnModuleInit {
  constructor(private readonly coursesService: CoursesService) {}

  async onModuleInit() {
    await this.coursesService.init();
  }

  @IsPublic()
  @Query(() => [Course])
  async getCourses() {
    return this.coursesService.getAll();
  }
}
