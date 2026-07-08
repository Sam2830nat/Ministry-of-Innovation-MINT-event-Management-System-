import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guard';
import { Public } from '../auth/decorator';
import { GraduationService } from './graduation.service';
import { AddGuestDto, ClaimSubmissionDto, SaveGraduationConfigDto } from './dto/graduation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Graduation')
@Controller('graduation')
export class GraduationController {
  constructor(private readonly graduationService: GraduationService) {}

  // ── Organizer: Tier Config ────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':eventId/config')
  getConfig(@Param('eventId') eventId: string) {
    return this.graduationService.getConfig(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':eventId/config')
  saveConfig(
    @Param('eventId') eventId: string,
    @Body() dto: SaveGraduationConfigDto,
    @Req() req: any,
  ) {
    return this.graduationService.saveConfig(eventId, req.user.id, dto);
  }

  // ── Organizer: Import CSV ─────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post(':eventId/import-csv')
  @UseInterceptors(FileInterceptor('file'))
  importCsv(
    @Param('eventId') eventId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.graduationService.importFromCsv(eventId, req.user.id, file.buffer);
  }

  // ── Organizer: Add Single Guest ─────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post(':eventId/add-guest')
  addGuest(
    @Param('eventId') eventId: string,
    @Body() dto: AddGuestDto,
    @Req() req: any,
  ) {
    return this.graduationService.addGuest(eventId, req.user.id, dto);
  }

  // ── Organizer: Get Guest List ───────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get(':eventId/guests')
  getGuests(@Param('eventId') eventId: string, @Req() req: any) {
    return this.graduationService.getGuestsForEvent(eventId, req.user.id);
  }

  // ── Organizer: Resend Guest Pass ──────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post('guest-pass/:guestPassId/resend')
  resend(@Param('guestPassId') guestPassId: string, @Req() req: any) {
    return this.graduationService.resendDelivery(guestPassId, req.user.id);
  }

  // ── PUBLIC: Get Claim Status ──────────────────────────────────────────────
  @Public()
  @Get('claim/:token')
  getClaimStatus(@Param('token') token: string) {
    return this.graduationService.getClaimStatus(token);
  }

  // ── PUBLIC: Submit Claim ──────────────────────────────────────────────────
  @Public()
  @Post('claim/:token')
  submitClaim(@Param('token') token: string, @Body() dto: ClaimSubmissionDto) {
    return this.graduationService.submitClaim(token, dto);
  }
}
