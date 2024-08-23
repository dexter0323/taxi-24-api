import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class DriverWithinRadiusDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumberString()
  readonly longitude: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumberString()
  readonly latitude: string;

  @ApiProperty({ required: false, default: 3, description: 'Radius in kilometers' })
  @IsNumberString()
  readonly radius: string;
}
