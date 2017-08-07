function bytesToHex(bytes) {
    return bytes.map((b) => ("00" + b.toString(16).slice(-2))).join("");
}

function hexToBytes(hex) {
    let len = hex.length;
    let res = [];
    for(let i = 0; i < len; i += 2) {
        let byte = parseInt(hex.slice(i, i + 2), 16);
        res.push(byte);
    }
    return res;
}

function readU8(ptr, buffer, len) {
    const view = new DataView(buffer);
    const res = [];
    for(let i = 0; i < len; i++) {
        res.push(view.getUint8(ptr + i));
    }
    return res;
}

function writeU8(ptr, buffer, value) {
    const view = new DataView(buffer);
    for(let i = 0; i < value.len; i++) {
        view.setUint8(ptr + i, value[i]);
    }
}

export default class Storage {

    constructor(buffer) {
        this.size = 16 * 1024;
        this.buffer = buffer;
        this.store = Map();
    }
    
    write = (keyPtr, valPtr) => {
        const key = readU8(keyPtr, this.buffer, 32);
        const value = readU8(valPtr, this.buffer, 32);
        this.store.set(bytesToHex(key), value);
        return 0;
    }

    read = (keyPtr, destPtr) => {
        const key = readU8(keyPtr, this.buffer, 32);
        const value = this.store.get(bytesToHex(key));
        if (value) {
            return -1;
        }
        writeU8(destPtr, value);
        return len;
    }
}