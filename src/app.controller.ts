import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';
import db from './db';
import { ScooterDto } from './scooter.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('list')
  async listScooters() {
    const [rows] = await db.execute('SELECT * FROM scooters');
    return {
      scooters: rows,
    };
  }

  @Get('scooters/new')
  @Render('form')
  newPaintingForm() { 
    return {};
  }

  @Post('scooters/new')
  @Redirect()
  async newScooter(@Body() scooter: ScooterDto)  {
    scooter.available = scooter.available == 1
    const [result]: any = await db.execute(
      'INSERT INTO scooters (brand, model, color, max_speed, available) VALUES (?, ?, ?, ?, ?)',
      [scooter.brand, scooter.model, scooter.color, scooter.max_speed, scooter.available],
    );
    return {
      url: '/scooters/' + result.insertId,
    };
  }



  
  @Get('scooters/:id')
  @Render('show')
  async showScooter(@Param('id') id: number) {
    const [rows] = await db.execute(
      'SELECT brand, model, color, max_speed, available FROM scooters WHERE id = ?',
      [id],
    );
    return { scooter: rows[0] };
  }



  @Post('scooters/delete/:id')
  @Redirect()
  async deleteScooter(@Param('id') id: number) {
    const [result]: any = await db.execute(
      'DELETE FROM scooters WHERE id = ?', [id],
    );
    return {
      url: '/',
    };
  }





  @Get('scooters/modifyForm/:id')
  @Render('edit')
  async modifyFormScooter(@Param('id') id: number) {
    const [rows] = await db.execute(
      'SELECT id, brand, model, color, max_speed, available FROM scooters WHERE id = ?',
      [id],
    );
    return { scooter: rows[0] };
  }


  @Post('scooters/modifyForm/:id')
  @Redirect()
  async modifyScooter(@Body() scooter: ScooterDto, @Param('id') id: number) {
    scooter.available = scooter.available == 1;
      const [rows] = await db.execute('UPDATE scooters SET brand = ?, model = ?, color = ?, max_speed = ?, available = ? WHERE id = ?',
      [scooter.brand, scooter.model, scooter.color, scooter.max_speed, scooter.available, id])
    return {
      url: '/scooters/' + id,
    };
  }
}
