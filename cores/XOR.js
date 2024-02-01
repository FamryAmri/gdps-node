/*
    Get from GDBrowser Script http://gdbrowser.com
*/
module.exports = class XOR {
    xor(str, key) { return String.fromCodePoint(...str.split('').map((char, i) => char.charCodeAt(0) ^ key.toString().charCodeAt(i % key.toString().length))) }
    encrypt(str, key = 37526) { return Buffer.from(this.xor(str, key)).toString('base64').replace(/./gs, c => ({'/': '_', '+': '-'}[c] || c)); }
    decrypt(str, key = 37526) { return this.xor(Buffer.from(str.replace(/./gs, c => ({'/': '_', '+': '-'}[c] || c)), 'base64').toString(), key) }
    keydecrypt (str) { var key='A:10:a:1:B:20:b:2:c:3:C:30:d:4:D:40:E:50:e:5:f:6:g:7:h:8:i:9'; var gkey=''; for (let i = 0; i < str.length; i++) {var s = key.split(str[i] + ":")[1].split(":")[0]; gkey+=s;}; return gkey; }
}
