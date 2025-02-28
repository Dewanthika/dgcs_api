import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourierChargesService } from './courier-charges.service';
import { UpdateCourierChargeDto } from './dto/update-courier-charge.dto';
import { CreateCourierChargeDto } from './dto/create-courier-charge.dto';

@Controller('courier-charges')
export class CourierChargesController {
  constructor(private readonly courierChargesService: CourierChargesService) {}

  @Post()
  create(@Body() createCourierChargeDto: CreateCourierChargeDto) {
    return this.courierChargesService.create(createCourierChargeDto);
  }

  @Get()
  findAll() {
    return this.courierChargesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courierChargesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourierChargeDto: UpdateCourierChargeDto) {
    return this.courierChargesService.update(+id, updateCourierChargeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courierChargesService.remove(+id);
  }
}
