import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const BYPASS_KEY = "bypass";
export declare const BypassAuth: () => import("@nestjs/common").CustomDecorator<string>;
export declare const shouldBypassAuth: (context: ExecutionContext, reflector: Reflector) => boolean;
