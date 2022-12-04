export default class GeometryComponent{
    name = 'none';
    position = null;
    transform = {
        translation:[0, 0, -0],
        rotation:[HNWUEngine.degToRad(0), HNWUEngine.degToRad(0), HNWUEngine.degToRad(0)],
        scale:[1,1,1]
    };
    material = null;
    program = null;
    bufferData = {};
    uniformsData = {};
    components = {};

    constructor(gl,name,program){
        this.material = HNWUEngine.getDefaultMaterial(gl);
        this.name = name;
        this.program = program;
    }
    setPosition(position){
        this.position = position;
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
    
    setTransform(transform){
        this.transform = transform;
    }
    addComponent(name,component){
        this.components[name] = component;
        component.setTarget(this);
    }
    getTransform(){
        return this.transform;
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
