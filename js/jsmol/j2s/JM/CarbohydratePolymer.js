Clazz.declarePackage("JM");
Clazz.load(["JM.BioPolymer"], "JM.CarbohydratePolymer", null, function(){
var c$ = Clazz.declareType(JM, "CarbohydratePolymer", JM.BioPolymer);
Clazz.makeConstructor(c$, 
function(monomers){
Clazz.superConstructor(this, JM.CarbohydratePolymer, [monomers, false]);
this.type = 3;
}, "~A");
});
;//5.0.1-v4 Wed Oct 09 10:23:43 CDT 2024
