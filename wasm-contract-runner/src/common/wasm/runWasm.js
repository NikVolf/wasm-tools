import Runtime from './Runtime';
import createEnv from './createEnv';
import Storage from './Storage';

export default async function runWasm (buffer, runtime, imports = {}) {
    imports = createEnv(runtime, imports);
    return window.WebAssembly.instantiate(buffer, imports)
}