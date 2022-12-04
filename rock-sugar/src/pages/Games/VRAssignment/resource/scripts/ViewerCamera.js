
export default class ViewerCamera{
    yaw = 90;
    pitch = 0;
    speed = .01;
    sensitivity = .3;
    zoom = 45.0;
    cameraData = null;
    front = null;
    right = null;
    up = null;
    worldUp = null;
    canvas = null;

    constructor(canvas,cameraData){
        this.worldUp = cameraData.up;
        this.cameraData = cameraData;
        this.canvas = canvas;

        if (!this.canvas){
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
    }

    load(){
        this.canvas.onmouseenter = (ev)=>{
            document.addEventListener("keydown",this.keyHandle.bind(this),false);  
            //scroll event.
            this.canvas.addEventListener("mousewheel",this.scrollHandle.bind(this),false);
        }
        this.canvas.onmouseout = (ev)=>{
            document.removeEventListener("keydown",this.keyHandle.bind(this),false);
            this.canvas.removeEventListener("mousewheel",this.scrollHandle.bind(this),false);
        }
    }
    unload(){
        this.canvas.onmouseenter = null;
        this.canvas.onmouseout = null;
    }
    keyHandle(keyEvent){
        let velocity = this.speed * window.deltaTime;
        if(keyEvent.key === "w"){
            HNWUEngine.vec3add(this.cameraData.position,HNWUEngine.vec3Multiply(this.front,velocity));
        }
        if(keyEvent.key === "s"){
            HNWUEngine.vec3sub(this.cameraData.position,HNWUEngine.vec3Multiply(this.front,velocity));
        }
        if(keyEvent.key === "a"){
            HNWUEngine.vec3sub(this.cameraData.position,HNWUEngine.vec3Multiply(this.right,velocity));
        }
        if(keyEvent.key === "d"){
            HNWUEngine.vec3add(this.cameraData.position,HNWUEngine.vec3Multiply(this.right,velocity)); 
        }
        if(keyEvent.key === "e"){
            this.cameraData.position[1] += 2*velocity;
        }
        if(keyEvent.key === "q"){
            this.cameraData.position[1] -= 2*velocity;
        }
        this.updateCameraVectors();
    }
    scrollHandle(scrollEvent){
        scrollEvent.preventDefault();
        let yoffset = scrollEvent.deltaY * .0005;
        HNWUEngine.vec3add(this.cameraData.position,HNWUEngine.scaleVector(this.front,yoffset));
    }
}