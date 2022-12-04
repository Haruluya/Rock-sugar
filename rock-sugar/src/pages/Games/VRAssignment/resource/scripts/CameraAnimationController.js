export default class CameraAnimationController{
    anims = null;
    camera = null;
    currentStatus = 0;
    constructor(anims,camera){
        if(!anims || !camera){
            throw Error("AnimationController init failed!");
        }
        this.anims = anims;
        this.camera = camera;
    }
    play(name){
        const anim = this.anims[name];
        if(!anim){
            throw Error("anim not found!");
        }
        const target = anim.target;
        if(this.currentStatus >= anim.status.length){
            this.currentStatus = 0;
            return true;
        }
        if(this.playStatus(target,anim.status)){
            this.currentStatus++;
        }
        return false;
    }
    playStatus(target,status){
        const statu = status[this.currentStatus];
        const constValue = statu.const;
        const currentValue = this.camera[target][statu.value];
        const offset = currentValue - constValue;
        if(Math.abs(offset) < .1){
            return true;
        }else {
            if(offset < 0){
                this.camera[target][statu.value] += statu.movement;
            }else{
                this.camera[target][statu.value] -= statu.movement;
            }
        }
        return false;
    }
}
