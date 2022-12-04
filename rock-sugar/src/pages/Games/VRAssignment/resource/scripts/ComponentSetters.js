export default class ComponentSetters{
    bufferInfo=null;
    attribSetters=null;
    uniformSetters=null;
    componentName="none";
    constructor(componentName,bufferInfo,attribSetters,uniformSetters){
        this.componentName =componentName;
        this.bufferInfo = bufferInfo;
        this.attribSetters = attribSetters;
        this.uniformSetters = uniformSetters;
    }
    getBufferInfo(){
        return this.bufferInfo;
    }
    getAttribSetters(){
        return this.attribSetters;
    }
    getUniformSetters(){
        return this.uniformSetters;
    }
}