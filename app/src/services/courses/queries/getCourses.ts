import { gql } from '../../../__generated__';

export const GET_COURSES = gql(
  `query getCourses {
    getCourses {
      id,
      name
    }
  }`
);
