interface ClientError {
  response: {
    errors: {
      message: string;
      code: string;
    }[];
  };
}

export interface IGQLErrors {
  message: string;
  code: string | number;
}

export class GQLErrors {
  message: string;
  code: string | number;

  constructor(error: ClientError) {
    if (error.response.errors.length > 1) {
      this.code = 500;
      this.message = 'Erro interno no servidor. Tente novamente mais tarde.';
    }
    this.code = error.response.errors[0].code;
    this.message = error.response.errors[0].message;
  }
}
