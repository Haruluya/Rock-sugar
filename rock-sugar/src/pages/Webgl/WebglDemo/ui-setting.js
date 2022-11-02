/*
    Just to make source code shorter.
*/
import AnimEvent from "_plugins/anim-event/anim-event.min.js"
import LeaderLine from "_plugins/leader-line/leader-line.min.js";

// dragable.
let  dragPosition = {x:0,y:0,maxX:10000,maxY:400 };

// node line.
const nodeLines = {
                mainPanelLine:null,
                debugPanelLine:null
            }

// drag callback.
const panelDrag = (component,panelID,e)=>{
    dragPosition.x = e.clientX;
    dragPosition.y = e.clientY;
    nodeLines.mainPanelLine.show("draw");

    
    // scroll not support now.
    if(window.scrollY === 0  ){
        document.body.style.overflow='hidden'
        Object.values(nodeLines).forEach(element => {
            if (element){
                element.position();
            }
        });
        document.onmousemove =  AnimEvent.add((e) =>{
            const evt = e || event;
            const offsetX = evt.clientX - dragPosition.x;
            const offsetY = evt.clientY - dragPosition.y;
            if ( !(component.sidePanelPos[panelID].y > dragPosition.maxY && offsetY > 0)){
                component.sidePanelPos[panelID].x += offsetX;
                component.sidePanelPos[panelID].y += offsetY;
                dragPosition.x = evt.clientX;
                dragPosition.y = evt.clientY;
                Object.values(nodeLines).forEach(element => {
                    if (element){
                        element.position();
                    }
                });
            }
        });
        document.onmouseup = () => {
            document.onmousemove = null;
            document.body.style.overflow='visible'
        };
    
    }

            


};


// webgl panel default ui.
const setDefaultUI = (component)=>{
    let options = {
        startSocket: 'right', 
        endSocket: 'top',
        color:'rgba(255, 255, 0, 0.9)',
    }; 
    nodeLines.mainPanelLine= new LeaderLine(
        document.getElementById("nano-panel-slot-1"),
        document.getElementById("nano-slot-1"),
        options,
     );

    Object.values(nodeLines).forEach(element => {
        if (element){
            element.hide("none");
        }
    });

}


const setDebugPanelCon = (component)=>{
    let options = {
        startSocket: 'right', 
        endSocket: 'left',
        color:'rgba(0, 255, 0, 0.9)',
    }; 

    nodeLines.debugPanelLine= new LeaderLine(
        document.getElementById("nano-panel-slot-3"),
        document.getElementById("nano-panel-slot-2"),
        options,
     );
}

export default{
    panelDrag,
    setDefaultUI,
    setDebugPanelCon,
    nodeLines,
}


