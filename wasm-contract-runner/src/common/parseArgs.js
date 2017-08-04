export default function parseArgs({ address, sender, origin, gas, value }) {

    const target = new Uint8Array(92);
    target.set(address ? toHexAddress(address) : new Uint8Array(20), 0);
    target.set(sender ? toHexAddress(sender) : new Uint8Array(20), 20);
    target.set(origin ? toHexAddress(origin) : new Uint8Array(20), 40);
    return target;
}

function toHexAddress(hex) {
    hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
    return hexToArrayBuffer(hex);
}

function hexToArrayBuffer(hex) {
    var view = new Uint8Array(hex.length / 2)
    for (var i = 0; i < hex.length; i += 2) {
        view[i / 2] = parseInt(hex.substring(i, i + 2), 16)
    }
    return view;
}