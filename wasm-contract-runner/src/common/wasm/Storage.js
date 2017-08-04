export default function Storage(memoryBuf) {
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
            result.push(dataView.getUint8(i));
        }
        return result;
    };
}