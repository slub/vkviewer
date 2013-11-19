/**
 * methode: Class
 * 
 * @param {type} methods
 * @returns {Class.classObj}
 * 
 * Creates a class for a given javascript object
 */
VK2.Class = function(methods){
    classObj = function(){
        this.initialize.apply(this, arguments);
    };
    
    for (var property in methods){
        classObj.prototype[property] = methods[property];
    }
    
    if (!classObj.prototype.initialize) classObj.prototype.initialize = function(){};
    
    return classObj;
}