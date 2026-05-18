import { ApiProperty } from "@nestjs/swagger";
import { StringOptional, StringRequired } from "@quadra/shared";

export class AuthDto {
  @ApiProperty({ example: "email@gmail.com" })
  @StringOptional("login.email", 5, 100)
  email?: string;

  @ApiProperty({ example: "senha@1" })
  @StringRequired("login.senha", 8, 100)
  senha!: string;

  @ApiProperty({ example: "+5531999999999" })
  @StringOptional("login.telefone", 5, 100)
  telefone?: string;
}
