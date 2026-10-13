import { env } from '$env/dynamic/private';
import { createEnvReader } from '@victoralaba/muscar-core/server';

/** Per-request env reader: `readEnv(platform)('KEY')`. */
export const readEnv = createEnvReader(() => env);
