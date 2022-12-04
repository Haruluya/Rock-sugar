
export default class VehicleController{
    yaw = 90;
    pitch = 0;
    speed = .03;
    sensitivity = .1;
    zoom = 45.0;
    front = null;
    right = null;
    up = null;
    worldUp = [0,1,0];
    canvas = null;
    camera = null;

    constructor(canvas,camera){
        this.canvas = canvas;
        this.camera = camera;
        if (!this.canvas || !this.camera){
            throw new Error("vehicle controller init failed!");
        }
        this.updateControllerVectors();
    }


    updateControllerVectors(){
        let front = [0,0,0];
        front[0] = Math.cos(HNWUEngine.degToRad(this.yaw)) * Math.cos(HNWUEngine.degToRad(0));
        front[1] = Math.sin(HNWUEngine.degToRad(0));
        front[2] = Math.sin(HNWUEngine.degToRad(this.yaw)) * Math.cos(HNWUEngine.degToRad(0));

        this.front = HNWUEngine.normalize(front);
        this.right = HNWUEngine.normalize(HNWUEngine.cross(this.front,this.worldUp));
        this.up = HNWUEngine.normalize(HNWUEngine.cross(this.right,this.front));
        this.camera.target =  HNWUEngine.subtractVectors(this.camera.position,HNWUEngine.scaleVector(
            [Math.cos(HNWUEngine.degToRad(this.yaw)) * Math.cos(HNWUEngine.degToRad(this.pitch)),
            Math.sin(HNWUEngine.degToRad(this.pitch)),
            Math.sin(HNWUEngine.degToRad(this.yaw)) * Math.cos(HNWUEngine.degToRad(this.pitch))
            ]
            ,-1));
        this.camera.target[1] -= .5
    }   
    load(component){
        this.transform = component.transform;
        this.canvas.onmouseenter = (ev)=>{
            //key event.
            document.addEventListener("keypress",this.keyHandle.bind(this),false);
            document.addEventListener("mousemove",this.mouseHandle.bind(this),false);  
        }
    }
    unload(){
        //key event.
        document.removeEventListener("keypress",this.keyHandle.bind(this),false);
        document.removeEventListener("mousemove",this.mouseHandle.bind(this),false);  
    }
    keyHandle(keyEvent){
        let velocity = this.speed * window.deltaTime;
        if(keyEvent.key === "w"){

            HNWUEngine.vec3add(this.transform.translation,HNWUEngine.vec3Multiply(this.front,velocity));
            HNWUEngine.vec3add(this.camera.position,HNWUEngine.vec3Multiply(this.front,velocity));
            
        }
        if(keyEvent.key === "s"){
            HNWUEngine.vec3sub(this.transform.translation,HNWUEngine.vec3Multiply(this.front,velocity));
            HNWUEngine.vec3sub(this.camera.position,HNWUEngine.vec3Multiply(this.front,velocity));
        } 
        if(keyEvent.key === "e"){
            this.transform.translation[1] += 2*velocity;
            this.camera.position[1] += 2*velocity;
        }
        if(keyEvent.key === "q"){
            this.transform.translation[1] -= 2*velocity;
            this.camera.position[1] -= 2*velocity;
        }
        this.updateControllerVectors();
    }
    mouseHandle(mouseEvent){
        this.yaw -= mouseEvent.movementX * this.sensitivity; 
        this.transform.rotation[1] += HNWUEngine.degToRad(mouseEvent.movementX * this.sensitivity);
        this.pitch += mouseEvent.movementY * this.sensitivity;
        
        // if ( this.yaw > 110.0){
        //     this.yaw = 110.0;
        // }else if (this.yaw < 60){
        //     this.yaw = 60.0;
        // }else{
           
        // }
        this.updateControllerVectors();
    }
    

}