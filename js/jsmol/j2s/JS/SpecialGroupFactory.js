Clazz.declarePackage("JS");
Clazz.load(null, "JS.SpecialGroupFactory", ["JS.SpecialGroup", "$.Symmetry"], function(){
var c$ = Clazz.declareType(JS, "SpecialGroupFactory", null);
Clazz.makeConstructor(c$, 
function(){
System.out.println("created");
});
Clazz.defineMethod(c$, "createSpecialGroup", 
function(base, sym, info, type){
var spg;
switch (type) {
case 300:
spg =  new JS.SpecialGroup.PlaneGroup(sym, info);
break;
case 400:
spg =  new JS.SpecialGroup.LayerGroup(sym, info);
break;
case 500:
spg =  new JS.SpecialGroup.RodGroup(sym, info);
break;
case 600:
spg =  new JS.SpecialGroup.FriezeGroup(sym, info);
break;
default:
return null;
}
if (base != null) spg.embeddingSymmetry = base.embeddingSymmetry;
return spg;
}, "JS.SpecialGroup,JS.Symmetry,java.util.Map,~N");
Clazz.defineMethod(c$, "getSpecialGroup", 
function(sym, vwr, name, itno, itindex, isCleg, type){
var data = JS.Symmetry.getAllITAData(vwr, type, false);
var info = null;
if (itindex > 0) {
info = (data[itno - 1].get("its")).get(itindex - 1);
} else {
info = JS.Symmetry.getSpecialSettingJSON(data, name);
}return this.createSpecialGroup(null, sym, info, type);
}, "JS.Symmetry,JV.Viewer,~S,~N,~N,~B,~N");
});
;//5.0.1-v4 Thu Oct 10 12:56:35 CDT 2024
