
export default class FirstPersonCamera{
    yaw = 90.0;
    pitch = .0;
    speed = .01;
    sensitivity = .3;
    zoom = 45.0;
    cameraData = null;
    front = null;
    right = null;
    up = null;
    worldUp = null;
    canvas = null;
    render = null;

    target = null;

    constructor(canvas,cameraData,render){
        this.worldUp = cameraData.up;
        this.cameraData = cameraData;
        this.canvas = canvas;
        this.render = render;

        if (!this.canvas || !this.render){
            throw new Error("camera init failed!");
        }

        this.updateCameraVectors();
    }
    updateCameraVectors(){
        let front = [0,0,0];
        front[0] = Math.cos(HNWUEngine.degToRad(this.yaw)) * Math.cos(HNWUEngine.degToRad(this.pitch));
        front[1] = Math.sin(HNWUEngine.degToRad(this.pitch));
        front[2] = Math.sin(HNWUEngine.degToRad(this.yaw)) * Math.cos(HNWUEngine.degToRad(this.pitch));

        this.front = HNWUEngine.normalize(front);
        this.right = HNWUEngine.normalize(HNWUEngine.cross(this.front,this.worldUp));
        this.up = HNWUEngine.normalize(HNWUEngine.cross(this.right,this.front));
        this.cameraData.target =  HNWUEngine.subtractVectors(this.cameraData.position,this.front);
    }
    load(){
        this.canvas.onmouseenter = (ev)=>{
            //key event.
            document.addEventListener("keydown",this.keyHandle.bind(this),false);
            document.addEventListener("mousemove",this.mouseHandle.bind(this),false);  
            //scroll event.
            this.canvas.addEventListener("mousewheel",this.scrollHandle.bind(this),false);
        }
    }
    unload(){
        //key event.
        document.removeEventListener("keydown",this.keyHandle.bind(this),false);
        document.removeEventListener("mousemove",this.mouseHandle.bind(this),false);  
        //scroll event.
        this.canvas.removeEventListener("mousewheel",this.scrollHandle.bind(this),false);
    }
    keyHandle(keyEvent){
        let velocity = this.speed * window.deltaTime;
        if(keyEvent.key === "w"){
            HNWUEngine.vec3sub(this.cameraData.position,HNWUEngine.vec3Multiply(this.front,velocity));
        }
        if(keyEvent.key === "s"){
            HNWUEngine.vec3add(this.cameraData.position,HNWUEngine.vec3Multiply(this.front,velocity));
        }
        if(keyEvent.key === "a"){
            HNWUEngine.vec3add(this.cameraData.position,HNWUEngine.vec3Multiply(this.right,velocity));
        }
        if(keyEvent.key === "d"){
            HNWUEngine.vec3sub(this.cameraData.position,HNWUEngine.vec3Multiply(this.right,velocity)); 
        }
        if(keyEvent.key === "e"){
            this.cameraData.position[1] += 2*velocity;
        }
        if(keyEvent.key === "q"){
            this.cameraData.position[1] -= 2*velocity;
        }
        this.updateCameraVectors();
    }
    mouseHandle(mouseEvent){

        this.yaw += mouseEvent.movementX * this.sensitivity; 
        this.pitch += mouseEvent.movementY * this.sensitivity;
        if ( this.pitch > 89.0)
        this.pitch = 89.0;
        if ( this.pitch < -89.0)
        this.pitch = -89.0;
        this.updateCameraVectors();
    }
    scrollHandle(scrollEvent){
        scrollEvent.preventDefault();
        let yoffset = scrollEvent.deltaY;
        this.zoom -= yoffset;
        if (this.zoom < 1.0){this.zoom = 1.0;}
        if(this.zoom > 45.0){this.zoom = 45.0;}
    }

    setTarget(component){
        this.target = component;
    }
    update(){
        const translation = [this.cameraData.position[0]+10,this.cameraData.position[1]-10,this.cameraData.position[2]]
        this.target.setTransform({
            translation,
            rotation:[HNWUEngine.degToRad(this.pitch),HNWUEngine.degToRad(this.yaw),0],
            scale:[1,1,1]
        });
    }
}