let str = 'abcabcabc';
let searchvalue = 'ab';
let pos = 0;
while (true) {
let foundPos = str.indexOf(searchvalue, pos);
if (foundPos == -1) break;
document.writeln( foundPos );
pos = foundPos + 1;
}