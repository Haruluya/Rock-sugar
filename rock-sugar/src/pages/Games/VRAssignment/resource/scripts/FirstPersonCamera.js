
export default class FirstPersonCamera{
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
    lockView = false;

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
        if(keyEvent.key === "x"){
            this.lockView = !this.lockView;
            console.log("camera locked!")
        }
        this.updateCameraVectors();
    }
    mouseHandle(mouseEvent){
        if(this.lockView){
            this.yaw += mouseEvent.movementX * this.sensitivity; 
            this.pitch += mouseEvent.movementY * this.sensitivity;
            if ( this.pitch > 89.0)
            this.pitch = 89.0;
            if ( this.pitch < -89.0)
            this.pitch = -89.0;
        }
        this.updateCameraVectors();
    }
    scrollHandle(scrollEvent){
        scrollEvent.preventDefault();
        let yoffset = scrollEvent.deltaY * .0005;
        HNWUEngine.vec3add(this.cameraData.position,HNWUEngine.scaleVector(this.front,yoffset));
    }


}