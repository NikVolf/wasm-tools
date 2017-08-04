export function runWebAssembly(buffer, imports) {
    imports = imports || {};
    imports.env = imports.env || {};
    var env = imports.env;
    imports.env.memoryBase = imports.env.memoryBase || 1024;
    imports.env.tableBase = imports.env.tableBase || 0;

    window.runtime = new Runtime();

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
    env._debug = function(arg) {
        console.log("DEBUG", arg);
    };

    env.memoryBase = env.memoryBase || 0;
    env.tableBase = env.tableBase || 0;

    env._storage_read = window.runtime.storage.read;
    env._storage_write = window.runtime.storage.write;
    env._storage_size = window.runtime.storage.size;
    env.gas = window.runtime.gas;
    env._malloc = window.runtime.malloc;
    env._free = window.runtime.free;

    if (!imports.env.memory) {
        imports.env.memory = window.runtime.memory;
    }
    if (!imports.env.table) {
        imports.env.table = new window.WebAssembly.Table({
            initial: 10,
            maximum: 10,
            element: "anyfunc"
        });
    }
    return window.WebAssembly.instantiate(buffer, imports);
}


export function Runtime() {
    var self = this;

    self.memory = new window.WebAssembly.Memory({ initial: 256, maximum: 256 });
    self.storage = new Storage(self.memory.buffer);

    // todo: figure out how to do counter with multiple executables
    self.gasCounter = 0;

    self.dynamicTopPtr = 1024;

    self.malloc = function(size) {
        let result = self.dynamicTopPtr;
        self.dynamicTopPtr += size;
        return result;
    };

    self.free = function() {};

    self.resolveAlloc = function(instance) {
        return self.malloc;
    };

    self.resolveFree = function(instance) {
        return self.free;
    };

    self.gas = function(val) {
        self.gasCounter += val;
    };

    self.call = function(instance, args) {
        let alloc = self.resolveAlloc(instance);

        // call descriptor size
        let ptr = alloc(16);
        let dataView = new DataView(self.memory.buffer);

        var arg_ptr = false;
        if (args.length > 0) {
            arg_ptr = alloc(args.length);
            dataView.setInt32(ptr, arg_ptr, true);
            dataView.setInt32(ptr + 4, args.length, true);

            for (var i = 0; i < args.length; i++) {
                dataView.setInt8(arg_ptr + i, args[i], false);
            }
        } else {
            dataView.setInt32(ptr, 0, true);
            dataView.setInt32(ptr + 4, 0, true);
        }

        // zero result
        dataView.setInt32(ptr + 8, 0, true);
        dataView.setInt32(ptr + 12, 0, true);

        self.gasCounter = 0;
        instance.exports._call(ptr);

        let result_ptr = dataView.getInt32(ptr + 8, true);
        let result_length = dataView.getInt32(ptr + 12, true);

        let free = self.resolveFree(instance);

        let result = [];
        if (result_ptr != 0) {
            for (var i = 0; i < result_length; i++) {
                result.push(dataView.getUint8(result_ptr + i));
            }
        }

        arg_ptr && free(arg_ptr);
        result_ptr && free(result_ptr);
        free(ptr);

        return result;
    };
}

function strToArray(str) {
    var src = str.trim().substr(1, str.length - 2);
    if (src.length == 0) {
        return [];
    } else {
        return src.split(",").map(p => Number(p.trim()));
    }
}

function arrayToStr(arr) {
    return "[" + arr.join(", ") + "]";
}

function Storage(memoryBuf) {
    var self = this;
    self.size = 16 * 1024;
    self.buffer = new ArrayBuffer(self.size);
    self.memory = memoryBuf;
    self.total = 0;

    self.write = function(offset, len, ptr) {
        var oldSize = false;
        while (offset + len > self.size) {
            oldSize || (oldSize = self.size);
            self.size = self.size * 2;
        }
        if (oldSize) {
            self.buffer = ArrayBuffer.transfer(self.buffer, self.size);
        }

        if (offset + len > self.total) {
            self.total = offset + len;
        }

        let memView = new DataView(self.memory);
        let storageView = new DataView(self.buffer);
        for (let i = 0; i < len; i++) {
            storageView.setInt8(offset + i, memView.getInt8(ptr + i));
        }
        return len;
    };

    self.read = function(offset, len, ptr) {
        if (offset + len > self.total) {
            return -1;
        }

        let memView = new DataView(self.memory);
        let storageView = new DataView(self.buffer);

        for (var i = 0; i < len; i++) {
            memView.setInt8(ptr + i, storageView.getInt8(offset + i));
        }
        return len;
    };

    self.size = function() {
        return self.total;
    };

    self.toArr = function() {
        let result = [];
        let dataView = new DataView(self.buffer);
        for (var i = 0; i < self.total; i++) {
            result.push(dataView.getInt8(i));
        }
        return result;
    };
}