import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTripDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly passengerId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly latitud: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly longitude: number;
}

export class CompleteTripDto extends OmitType(CreateTripDto, ['passengerId']) {}
