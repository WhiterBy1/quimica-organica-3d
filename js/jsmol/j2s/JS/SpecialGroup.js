Clazz.declarePackage("JS");
Clazz.load(["JS.SpaceGroup"], "JS.SpecialGroup", ["JU.PT", "JU.SimpleUnitCell"], function(){
var c$ = Clazz.decorateAsClass(function(){
this.embeddingSymmetry = null;
Clazz.instantialize(this, arguments);}, JS, "SpecialGroup", JS.SpaceGroup);
Clazz.makeConstructor(c$, 
function(sym, info, type){
Clazz.superConstructor(this, JS.SpecialGroup, [-1, null, true]);
this.embeddingSymmetry = sym;
this.groupType = type;
if (info == null) return;
this.initSpecial(info);
}, "JS.Symmetry,java.util.Map,~N");
Clazz.defineMethod(c$, "initSpecial", 
function(info){
var ops = info.get("gp");
for (var i = 0; i < ops.size(); i++) {
this.addOperation(ops.get(i), 0, false);
}
this.itaTransform = info.get("trm");
this.itaNumber = "" + info.get("sg");
this.itaIndex = "" + info.get("set");
this.specialPrefix = JS.SpaceGroup.getGroupTypePrefix(this.groupType);
this.setHMSymbol(info.get("hm"));
this.setITATableNames(null, this.itaNumber, this.itaIndex, this.itaTransform);
}, "java.util.Map");
/*if3*/;(function(){
var c$ = Clazz.declareType(JS.SpecialGroup, "PlaneGroup", JS.SpecialGroup);
Clazz.makeConstructor(c$, 
function(sym, info){
Clazz.superConstructor(this, JS.SpecialGroup.PlaneGroup, [sym, info, 300]);
this.nDim = 2;
this.periodicity = 3;
}, "JS.Symmetry,java.util.Map");
Clazz.overrideMethod(c$, "createCompatibleUnitCell", 
function(params, newParams, allowSame){
if (newParams == null) newParams = params;
var a = params[0];
var b = params[1];
var c = -1;
var alpha = 90;
var beta = 90;
var gamma = params[5];
var n = (this.itaNumber == null ? 0 : JU.PT.parseInt(this.itaNumber));
var toHex = false;
var isHex = false;
toHex = (n != 0 && this.isHexagonalSG(n, null));
isHex = (toHex && this.isHexagonalSG(-1, params));
if (toHex && isHex) {
allowSame = true;
}if (n > (allowSame ? 2 : 0)) {
var absame = JU.SimpleUnitCell.approx0(a - b);
if (!allowSame) {
if (a > b) {
var d = a;
a = b;
b = d;
}absame = JU.SimpleUnitCell.approx0(a - b);
if (absame) b = a * 1.2;
if (JU.SimpleUnitCell.approx0(gamma - 90)) {
gamma = 110;
}}if (toHex) {
b = a;
alpha = beta = 90;
gamma = 120;
} else if (n >= 10) {
b = a;
gamma = 90;
} else if (n >= 3) {
gamma = 90;
}}var isNew = !(a == params[0] && b == params[1] && c == params[2] && alpha == params[3] && beta == params[4] && gamma == params[5]);
newParams[0] = a;
newParams[1] = b;
newParams[2] = c;
newParams[3] = alpha;
newParams[4] = beta;
newParams[5] = gamma;
return isNew;
}, "~A,~A,~B");
Clazz.overrideMethod(c$, "isHexagonalSG", 
function(n, params){
return (n < 1 ? JU.SimpleUnitCell.isHexagonal(params) : n >= 13);
}, "~N,~A");
/*eoif3*/})();
/*if3*/;(function(){
var c$ = Clazz.declareType(JS.SpecialGroup, "LayerGroup", JS.SpecialGroup);
Clazz.makeConstructor(c$, 
function(sym, info){
Clazz.superConstructor(this, JS.SpecialGroup.LayerGroup, [sym, info, 400]);
this.nDim = 3;
this.periodicity = 3;
}, "JS.Symmetry,java.util.Map");
Clazz.overrideMethod(c$, "createCompatibleUnitCell", 
function(params, newParams, allowSame){
if (newParams == null) newParams = params;
var a = params[0];
var b = params[1];
var c = params[2];
var alpha = params[3];
var beta = params[4];
var gamma = params[5];
var n = (this.itaNumber == null ? 0 : JU.PT.parseInt(this.itaNumber));
var toHex = false;
var isHex = false;
toHex = (n != 0 && this.isHexagonalSG(n, null));
isHex = (toHex && this.isHexagonalSG(-1, params));
if (toHex && isHex) {
allowSame = true;
}if (n > (allowSame ? 2 : 0)) {
var absame = b > 0 && JU.SimpleUnitCell.approx0(a - b);
var bcsame = c > 0 && JU.SimpleUnitCell.approx0(b - c);
var acsame = c > 0 && JU.SimpleUnitCell.approx0(c - a);
var albesame = JU.SimpleUnitCell.approx0(alpha - beta);
var begasame = JU.SimpleUnitCell.approx0(beta - gamma);
var algasame = JU.SimpleUnitCell.approx0(gamma - alpha);
if (!allowSame) {
if (b > 0 && a > b) {
var d = a;
a = b;
b = d;
}bcsame = c > 0 && JU.SimpleUnitCell.approx0(b - c);
if (bcsame) c = b * 1.5;
absame = JU.SimpleUnitCell.approx0(a - b);
if (absame) b = a * 1.2;
acsame = JU.SimpleUnitCell.approx0(c - a);
if (acsame) c = a * 1.1;
if (JU.SimpleUnitCell.approx0(alpha - 90)) {
alpha = 80;
}if (JU.SimpleUnitCell.approx0(beta - 90)) {
beta = 100;
}if (JU.SimpleUnitCell.approx0(gamma - 90)) {
gamma = 110;
}if (alpha > beta) {
var d = alpha;
alpha = beta;
beta = d;
}albesame = JU.SimpleUnitCell.approx0(alpha - beta);
begasame = JU.SimpleUnitCell.approx0(beta - gamma);
algasame = JU.SimpleUnitCell.approx0(gamma - alpha);
if (albesame) {
beta = alpha * 1.2;
}if (begasame) {
gamma = beta * 1.3;
}if (algasame) {
gamma = alpha * 1.4;
}}if (toHex) {
b = a;
alpha = beta = 90;
gamma = 120;
} else if (n >= 49) {
b = a;
if (acsame && !allowSame) c = a * 1.5;
alpha = beta = gamma = 90;
} else if (n >= 19) {
alpha = beta = gamma = 90;
} else if (n >= 8) {
beta = gamma = 90;
} else if (n >= 3) {
alpha = beta = 90;
}}var isNew = !(a == params[0] && b == params[1] && c == params[2] && alpha == params[3] && beta == params[4] && gamma == params[5]);
newParams[0] = a;
newParams[1] = b;
newParams[2] = c;
newParams[3] = alpha;
newParams[4] = beta;
newParams[5] = gamma;
return isNew;
}, "~A,~A,~B");
Clazz.overrideMethod(c$, "isHexagonalSG", 
function(n, params){
return (n < 1 ? JU.SimpleUnitCell.isHexagonal(params) : n >= 65);
}, "~N,~A");
/*eoif3*/})();
/*if3*/;(function(){
var c$ = Clazz.declareType(JS.SpecialGroup, "RodGroup", JS.SpecialGroup);
Clazz.makeConstructor(c$, 
function(sym, info){
Clazz.superConstructor(this, JS.SpecialGroup.RodGroup, [sym, info, 500]);
this.nDim = 3;
this.periodicity = 0x4;
}, "JS.Symmetry,java.util.Map");
Clazz.overrideMethod(c$, "createCompatibleUnitCell", 
function(params, newParams, allowSame){
if (newParams == null) newParams = params;
var a = params[0];
var b = params[1];
var c = params[2];
var alpha = params[3];
var beta = params[4];
var gamma = params[5];
var n = (this.itaNumber == null ? 0 : JU.PT.parseInt(this.itaNumber));
var toHex = false;
var isHex = false;
toHex = (n != 0 && this.isHexagonalSG(n, null));
isHex = (toHex && this.isHexagonalSG(-1, params));
if (toHex && isHex) {
allowSame = true;
}if (n > (allowSame ? 2 : 0)) {
var absame = b > 0 && JU.SimpleUnitCell.approx0(a - b);
var bcsame = c > 0 && JU.SimpleUnitCell.approx0(b - c);
var acsame = c > 0 && JU.SimpleUnitCell.approx0(c - a);
var albesame = JU.SimpleUnitCell.approx0(alpha - beta);
var begasame = JU.SimpleUnitCell.approx0(beta - gamma);
var algasame = JU.SimpleUnitCell.approx0(gamma - alpha);
if (!allowSame) {
if (b > 0 && a > b) {
var d = a;
a = b;
b = d;
}bcsame = c > 0 && JU.SimpleUnitCell.approx0(b - c);
if (bcsame) c = b * 1.5;
absame = JU.SimpleUnitCell.approx0(a - b);
if (absame) b = a * 1.2;
acsame = JU.SimpleUnitCell.approx0(c - a);
if (acsame) c = a * 1.1;
if (JU.SimpleUnitCell.approx0(alpha - 90)) {
alpha = 80;
}if (JU.SimpleUnitCell.approx0(beta - 90)) {
beta = 100;
}if (JU.SimpleUnitCell.approx0(gamma - 90)) {
gamma = 110;
}if (alpha > beta) {
var d = alpha;
alpha = beta;
beta = d;
}albesame = JU.SimpleUnitCell.approx0(alpha - beta);
begasame = JU.SimpleUnitCell.approx0(beta - gamma);
algasame = JU.SimpleUnitCell.approx0(gamma - alpha);
if (albesame) {
beta = alpha * 1.2;
}if (begasame) {
gamma = beta * 1.3;
}if (algasame) {
gamma = alpha * 1.4;
}}if (toHex) {
b = a;
alpha = beta = 90;
gamma = 120;
} else if (n >= 23) {
b = a;
if (acsame && !allowSame) c = a * 1.5;
alpha = beta = gamma = 90;
} else if (n >= 13) {
alpha = beta = gamma = 90;
} else if (n >= 8) {
alpha = beta = 90;
} else if (n >= 3) {
beta = gamma = 90;
}}var isNew = !(a == params[0] && b == params[1] && c == params[2] && alpha == params[3] && beta == params[4] && gamma == params[5]);
newParams[0] = a;
newParams[1] = b;
newParams[2] = c;
newParams[3] = alpha;
newParams[4] = beta;
newParams[5] = gamma;
return isNew;
}, "~A,~A,~B");
Clazz.overrideMethod(c$, "isHexagonalSG", 
function(n, params){
return (n < 1 ? JU.SimpleUnitCell.isHexagonal(params) : n >= 42);
}, "~N,~A");
/*eoif3*/})();
/*if3*/;(function(){
var c$ = Clazz.declareType(JS.SpecialGroup, "FriezeGroup", JS.SpecialGroup);
Clazz.makeConstructor(c$, 
function(sym, info){
Clazz.superConstructor(this, JS.SpecialGroup.FriezeGroup, [sym, info, 600]);
this.nDim = 2;
this.periodicity = 0x1;
}, "JS.Symmetry,java.util.Map");
Clazz.overrideMethod(c$, "createCompatibleUnitCell", 
function(params, newParams, allowSame){
if (newParams == null) newParams = params;
var a = params[0];
var b = params[0];
var c = -1;
var alpha = 90;
var beta = 90;
var gamma = 90;
var isNew = !(a == params[0] && b == params[1] && c == params[2] && alpha == params[3] && beta == params[4] && gamma == params[5]);
newParams[0] = a;
newParams[1] = b;
newParams[2] = c;
newParams[3] = alpha;
newParams[4] = beta;
newParams[5] = gamma;
return isNew;
}, "~A,~A,~B");
/*eoif3*/})();
});
;//5.0.1-v4 Fri Oct 11 09:07:16 CDT 2024
