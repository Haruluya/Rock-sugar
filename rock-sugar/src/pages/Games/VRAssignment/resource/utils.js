class ComponentSetters{
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
class GeometryComponent{
    name = 'none';
    transfrom = {
        translation:[0, 0, -0],
        rotation:[HNWUEngine.degToRad(0), HNWUEngine.degToRad(0), HNWUEngine.degToRad(0)],
        scale:[1,1,1]
    };
    material = HNWUEngine.getDefaultMaterial();
    program = null;
    bufferData = {};
    uniformsData = {};
    components = {};
    constructor(name,program){
        this.name = name;
        this.program = program;
    }
    update(){
        Object.values(this.components).forEach(c=>{
            c.update();
        })
    }
    addBuffer(name,data){
        this.bufferData[name] = data;
    }

    addUniform(name,data){
        this.uniformsData[name] = data;
    }

    setMaterial(data){
        this.material = data;
        Object.entries(this.material).forEach(([uniformName,uniformValue])=>{
            this.addUniform(uniformName,uniformValue);
        })
    }
    
    setTransform(transfrom){
        this.transfrom = transfrom;
    }
    addComponent(name,component){
        this.components[name] = component;
        component.setTarget(this);
    }
    getTransform(){
        return this.transfrom;
    }
    getMaterial(){
        return this.material;
    }
    getBufferData(){
        return this.bufferData;
    }
    getUnifromData(){
        return this.uniformsData;
    }
    getProgram(){
        return this.program;
    }


}

export {
    ComponentSetters,
    GeometryComponent,
}