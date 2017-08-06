export default function createEnv(runtime, imports) {
    imports = imports || {};
    imports.env = imports.env || {};
    let env = imports.env;
    imports.env.memoryBase = imports.env.memoryBase || 1024;
    imports.env.tableBase = imports.env.tableBase || 0;

    env.STACKTOP = env.STACKTOP || 0;
    env.STACK_MAX = env.STACK_MAX || 5 * 1024 * 1024;
    env.DYNAMICTOP_PTR = env.STACK_MAX;
    env.enlargeMemory =
        env.enlargeMemory ||
        function() {
            return 1;
        };
    env.getTotalMemory =
        env.getTotalMemory ||
        function() {
            return 16 * 1024 * 1024;
        };
    env.abortOnCannotGrowMemory =
        env.abortOnCannotGrowMemory ||
        function() {
            throw "abort growing memory";
        };
    env._abort =
        env._abort ||
        function() {
            throw "_abort";
        };
    env.abort =
        env.abort ||
        function() {
            throw "abort";
        };
    env.___setErrNo =
        env.___setErrNo ||
        function() {
            throw "setting error no";
        };

    // dead symbols in rust wasm32-unknown-emscripten target
    // todo: strip/raise issue in rust compiler
    env.invoke_vi = function() {
        throw "invoke_vi: unreachable!";
    };
    env.invoke_v = function() {
        throw "invoke_v: unreachable!";
    };
    env.alignfault = function() {
        throw "alignfault!";
    };
    env.abortStackOverflow = function() {
        throw "abortStackOverflow!";
    };
    env.segfault = function() {
        throw "segfault!";
    };
    env.ftfault = function() {
        throw "ftfault!";
    };

    // todo: also test unwind about those two
    env._rust_begin_unwind = function() {
        throw "_rust_begin_unwind: unreachable!";
    };
    env._llvm_trap = function() {
        throw "_llvm_trap: unreachable!";
    };

    env._emscripten_memcpy_big = function() {
        throw "_emscripten_memcpy_big: unreachable!";
    };
    env.___gxx_personality_v0 = function() {
        throw "___gxx_personality_v0: unreachable!";
    };
    env.___resumeException = function() {
        throw "___resumeException: unreachable!";
    };
    env.___cxa_find_matching_catch_2 = function() {
        throw "___cxa_find_matching_catch_2: unreachable!";
    };
    env.___syscall6 = function() {
        throw "___syscall6: unreachable!";
    };
    env.___syscall140 = function() {
        throw "___syscall140: unreachable!";
    };
    env.___syscall54 = function() {
        throw "___syscall54: unreachable!";
    };
    env._llvm_trap = function() {
        throw "_llvm_trap: unreachable!";
    };
    env.___syscall146 = function() {
        throw "___syscall146: unreachable!";
    };

    env._debug = function(ptr, len) {
        let arr = new Uint8Array(runtime.memory.buffer);
        let str = "";
        for (let i = 0; i < len; i++) {
            str += String.fromCharCode(arr[ptr + i]);
        }
        console.log("DEBUG", str);
    };

    env.memoryBase = env.memoryBase || 0;
    env.tableBase = env.tableBase || 0;

    env._storage_read = runtime.storage.read;
    env._storage_write = runtime.storage.write;
    env._storage_size = runtime.storage.size;
    env.gas = runtime.gas;
    env._malloc = runtime.malloc;
    env._free = runtime.free;

    if (!imports.env.memory) {
        imports.env.memory = runtime.memory;
    }
    if (!imports.env.table) {
        imports.env.table = new window.WebAssembly.Table({
            initial: 8,
            maximum: 8,
            element: "anyfunc"
        });
    }
    return imports;
}