import Storage from './Storage'

export default function Runtime() {
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
