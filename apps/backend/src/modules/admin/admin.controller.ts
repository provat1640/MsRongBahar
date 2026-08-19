import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Manager Control Panel')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get live business revenue, order volume, and low stock metrics' })
  async getMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  @Put('stock')
  @ApiOperation({ summary: 'Adjust stock inventory count directly from manager control panel' })
  async updateStock(
    @Body() body: { id: string; isVariant: boolean; stock: number },
  ) {
    return this.adminService.updateStock(body.id, body.isVariant, body.stock);
  }
}
