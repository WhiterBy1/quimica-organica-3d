Clazz.declarePackage("J.adapter.readers.molxyz");
Clazz.load(["J.adapter.readers.molxyz.MolReader"], "J.adapter.readers.molxyz.Mol3DReader", null, function(){
var c$ = Clazz.declareType(J.adapter.readers.molxyz, "Mol3DReader", J.adapter.readers.molxyz.MolReader);
Clazz.overrideMethod(c$, "initializeReader", 
function(){
this.allow2D = false;
});
});
;//5.0.1-v4 Wed Oct 09 10:23:43 CDT 2024
