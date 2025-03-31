// src/auth/guards/captcha.guard.ts
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CaptchaService } from '../captcha.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../shared/decorators/public.decorator';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private readonly captchaService: CaptchaService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { captchaToken } = request.body;
    
    if (!captchaToken) {
      throw new BadRequestException('CAPTCHA token is required');
    }

    return this.captchaService.validateCaptcha(captchaToken);
  }
}