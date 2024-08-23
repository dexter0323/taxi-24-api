import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';

export class DriverWithinRadiusDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumberString()
  @IsString()
  readonly latitude: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumberString()
  @IsString()
  readonly longitude: string;

  @ApiProperty({ required: false, default: 3, description: 'Radius in kilometers' })
  @IsNumberString()
  @IsString()
  readonly radius: string;
}
