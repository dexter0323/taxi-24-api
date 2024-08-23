import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { DriverWithinRadiusDto } from 'src/infrastructure/controllers/driver/driver-dto.class';

export class RequestTripDto extends DriverWithinRadiusDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
