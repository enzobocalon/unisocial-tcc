import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { Token } from './entities/token.entity';
import { SigninDTO } from './dto/signin.dto';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { ResponseEntity } from 'src/entities/response.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Mutation(() => ResponseEntity, {
    name: 'signup',
    description: 'Create a new user and returns a JWT',
  })
  async signup(@Args('data') data: SignupDTO) {
    return this.authService.signup(data);
  }

  @IsPublic()
  @Mutation(() => Token, {
    name: 'signin',
    description: 'Returns a JWT Token',
  })
  async signin(@Args('data') data: SigninDTO) {
    return this.authService.signin(data);
  }

  @IsPublic()
  @Query(() => Token, {
    name: 'refreshToken',
    description: 'Returns a new JWT Token',
  })
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
