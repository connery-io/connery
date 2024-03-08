import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PluginConfigService } from './services/plugin-config.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private pluginConfigService: PluginConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    // Allow access to public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Check API key for private routes
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) throw new UnauthorizedException('API key is not provided in the x-api-key request header.');

    const isAccessAllowed = this.pluginConfigService.apiKey === apiKey;
    if (isAccessAllowed) {
      return true;
    } else {
      throw new UnauthorizedException('API key is not valid.');
    }
  }
}

// This is a custom decorator that we will use to mark routes as public
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
