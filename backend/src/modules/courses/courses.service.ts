import { Injectable } from '@nestjs/common';
import { CourseRepository } from 'src/shared/database/repositories/courses.repositories';

@Injectable()
export class CoursesService {
  constructor(private readonly courseRepo: CourseRepository) {}

  async init() {
    const hasCourses = await this.courseRepo.count();
    if (!hasCourses) {
      console.log('Seeding courses...');
      const coursesData = [
        { name: 'Administração' },
        { name: 'Administração EAD' },
        { name: 'Agronomia (Engenharia Agronômica)' },
        { name: 'Arquitetura e Urbanismo' },
        { name: 'Biomedicina' },
        { name: 'Ciências Contábeis' },
        { name: 'Ciências Contábeis EAD' },
        { name: 'Direito' },
        { name: 'Educação Física - Bacharelado' },
        { name: 'Educação Física - Licenciatura' },
        { name: 'Enfermagem' },
        { name: 'Engenharia Civil' },
        { name: 'Engenharia de Computação' },
        { name: 'Engenharia Elétrica' },
        { name: 'Engenharia Mecânica' },
        { name: 'Farmácia' },
        { name: 'Fisioterapia' },
        { name: 'Letras/Português e Inglês EAD' },
        { name: 'Medicina' },
        { name: 'Medicina Veterinária' },
        { name: 'Nutrição' },
        { name: 'Pedagogia' },
        { name: 'Pedagogia - Formação Pedagógica' },
        { name: 'Pedagogia - Segunda Licenciatura' },
        { name: 'Pedagogia EAD' },
        { name: 'Psicologia' },
        { name: 'Publicidade e Propaganda' },
        { name: 'Sistema de Informação EAD' },
      ];

      await this.courseRepo.createMany({
        data: coursesData,
      });
    }
  }

  async getAll() {
    const courses = await this.courseRepo.findMany();
    return courses;
  }

  async findById(id: string) {
    const course = await this.courseRepo.findFirst({
      where: {
        id,
      },
    });

    return course;
  }
}
