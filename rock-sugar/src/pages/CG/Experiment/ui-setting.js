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
     nodeLines.debugPanelLine.hide('none');
}



const globalUiCallbacks = {
    updatePoint:(component,pointName,index)=>{
        let sectionParams = component.sectionParams;
        let Render = component.Render;
        return function(event, ui){
            sectionParams[pointName][index] = ui.value;
            Render();
        }
    },
    updateGridSize:(component)=>{
        let Render = component.Render;
        return function(event,ui){
            component.sectionParams.girdSize = ui.value;
            Render();
        }
    }

}

const updateSlot = ()=>{
    Object.values(nodeLines).forEach(element => {
        if (element){
            element.position();
        }
    });
}

const destroy = ()=>{
    Object.values(nodeLines).forEach(element => {
        if (element){
            element.remove();
        }
    });
}

// draw grid as canvas`s background.
const drawGrid = (component)=>{
    const CanvasWidth = component.canvas.width;
    const CanvasHeight = component.canvas.height;
    const girdSize = component.sectionParams.girdSize;
    const ctx = component.ctx;
    var xLineTotals = Math.floor(CanvasHeight / girdSize); 
    var yLineTotals = Math.floor(CanvasWidth / girdSize); 
    for (var i = 0; i < xLineTotals; i++) {
        ctx.beginPath(); 
        ctx.moveTo(0, girdSize * i); 
        ctx.lineTo((yLineTotals-1)*girdSize, girdSize * i);
        ctx.strokeStyle = "#ccc"; 
        ctx.stroke();
    }
    for (var j = 0; j < yLineTotals; j++) {
        ctx.beginPath(); 
        ctx.moveTo(girdSize * j, 0);
        ctx.lineTo(girdSize * j, (xLineTotals-1)*girdSize);
        ctx.strokeStyle = "#ccc"; 
        ctx.stroke();
    }

}

const drawPointInGrid = (component, gridx,gridy)=>{

    const girdSize = component.sectionParams.girdSize;
    // cant overflow.
    if (gridx > parseInt(component.canvas.width / girdSize) - 2 
            || gridy > parseInt(component.canvas.height) / girdSize - 2)    
        return;

    const rectx = gridx * girdSize;
    const recty = gridy * girdSize;
    component.ctx.fillStyle = '#ffd700';
    component.ctx.fillRect(rectx, recty,girdSize,girdSize);

}

export default{
    panelDrag,
    setDefaultUI,
    setDebugPanelCon,
    nodeLines,
    globalUiCallbacks,
    updateSlot,
    destroy,
    drawGrid,
    drawPointInGrid
}


