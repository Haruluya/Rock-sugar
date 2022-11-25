import AnimEvent from "_plugins/anim-event/anim-event.min.js"

export default class FirstPersonCamera{
    yaw = 90.0;
    pitch = .0;
    speed = 20;
    sensitivity = .005;
    zoom = 45.0;
    cameraMatrix = null;
    front = null;
    right = null;
    up = null;
    worldUp = null;
    deltaTime = 0.;
    canvas = null;
    mousePosition = {x:0,y:0};
    render = null;

    constructor(canvas,cameraMatrix,render,deltaTime){
        this.worldUp = cameraMatrix.up;
        this.cameraMatrix = cameraMatrix;
        this.canvas = canvas;
        this.render = render;
        this.deltaTime = deltaTime;

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
        
        this.cameraMatrix.target =  HNWUEngine.subtractVectors(this.cameraMatrix.position,this.front);
        console.log(this.front,"targettttttttt")
    }
    load(){
        this.canvas.onmouseenter = (ev)=>{
            //key event.
            document.onkeydown = AnimEvent.add((e)=>{this.keyHandle(e)});
            //mouse event.
            this.mousePosition = {x:ev.clientX,y:ev.clientY};
            document.onmousemove = AnimEvent.add((e)=>{this.mouseHandle(e)});  
            //scroll event.
            this.canvas.onmousewheel = AnimEvent.add((e)=>{e.preventDefault();this.scrollHandle(e)});
        }
        this.canvas.onmouseout = (ev)=>{
            //key event.
            // document.onkeydown = null;
            //mouse event.
            // document.onmousemove = null;
            //scroll event.
            // this.canvas.onmousewheel = null;
        }
    }
    unload(){
        this.canvas.onmouseenter = null;
        this.canvas.onmouseout = null;
    }
    keyHandle(keyEvent){
        let velocity = this.speed * this.deltaTime;
        console.log(this.front,"frontssss");
        if(keyEvent.key === "w"){
            HNWUEngine.vec3sub(this.cameraMatrix.position,HNWUEngine.vec3Multiply(this.front,velocity));
            this.deltaTime = this.render();
        }
        if(keyEvent.key === "s"){
            HNWUEngine.vec3add(this.cameraMatrix.position,HNWUEngine.vec3Multiply(this.front,velocity));
            this.deltaTime = this.render();
        }
        if(keyEvent.key === "a"){
            HNWUEngine.vec3add(this.cameraMatrix.position,HNWUEngine.vec3Multiply(this.right,velocity));
            this.deltaTime = this.render();
        }
        if(keyEvent.key === "d"){
            HNWUEngine.vec3sub(this.cameraMatrix.position,HNWUEngine.vec3Multiply(this.right,velocity)); 
            this.deltaTime = this.render();
        }
        this.updateCameraVectors();
    }
    mouseHandle(mouseEvent){
        console.log(this,'this')
        const offsetX = (mouseEvent.clientX - this.mousePosition.x) * this.sensitivity ;
        const offsetY = (mouseEvent.clientY - this.mousePosition.y) * this.sensitivity;
        console.log(offsetX,"ssss")
        this.yaw += offsetX; this.pitch += offsetY;
        this.deltaTime = this.render();
        this.updateCameraVectors();
    }
    scrollHandle(scrollEvent){
        let yoffset = scrollEvent.deltaY;
        this.zoom -= yoffset;
        if (this.zoom < 1.0){this.zoom = 1.0;}
        if(this.zoom > 45.0){this.zoom = 45.0;}
        this.deltaTime = this.render();
    }

}