import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar rotas como públicas, ignorando autenticação.
 * Exemplo de uso:
 *
 * @Public()
 * @Get('rota-publica')
 * async rotaPublica() { ... }
 */
export const Public = () => SetMetadata('isPublic', true);
