import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Logger } from '@nestjs/common';

@Injectable()
export class CaptchaService {
  private readonly secretKey: string;
  private readonly verifyUrl: string;
  private readonly logger: Logger= new Logger();

  constructor(private configService: ConfigService) {
    try {
        this.secretKey = this.configService.get<string>('CAPTCHA_SECRET')!;
        this.verifyUrl = this.configService.get<string>('CAPTCHA_VERIFY_URL')!;
      } catch (error) {
        this.logger.error('Error retrieving CAPTCHA configuration:', error);
        throw error;
      }
  }

  async validateCaptcha(token: string): Promise<boolean> {
    
    /*this.logger.debug('Enviroment',process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }*/
    try {
      const response = await axios.post(
        this.verifyUrl,
        `secret=${this.secretKey}&response=${token}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.success;
    } catch (error) {
      console.error('CAPTCHA validation error:', error);
      return false;
    }
  }
}