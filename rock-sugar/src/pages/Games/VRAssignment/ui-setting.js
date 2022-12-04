/*
    Just to make source code shorter.
*/
import AnimEvent from "_plugins/anim-event/anim-event.min.js"
import LeaderLine from "_plugins/leader-line/leader-line.min.js";


// dragable.
let dragPosition = {
    x: 0,
    y: 0,
    maxX: 10000,
    maxY: 400
};

// node line.
const nodeLines = {
    mainPanelLine: null,
    debugPanelLine: null
}

// drag callback.
const panelDrag = (sidePanelPos, panelID, e) => {
    dragPosition.x = e.clientX;
    dragPosition.y = e.clientY;
    nodeLines.mainPanelLine.show("draw");
    // scroll not support now.
    if (window.scrollY === 0) {
        document.body.style.overflow = 'hidden'
        Object.values(nodeLines).forEach(element => {
            if (element) {
                element.position();
            }
        });
        document.onmousemove = AnimEvent.add((e) => {
            const evt = e || event;
            const offsetX = evt.clientX - dragPosition.x;
            const offsetY = evt.clientY - dragPosition.y;
            if (!(sidePanelPos[panelID].y > dragPosition.maxY && offsetY > 0)) {
                sidePanelPos[panelID].x += offsetX;
                sidePanelPos[panelID].y += offsetY;
                dragPosition.x = evt.clientX;
                dragPosition.y = evt.clientY;
                Object.values(nodeLines).forEach(element => {
                    if (element) {
                        element.position();
                    }
                });
            }
        });
        document.onmouseup = () => {
            document.onmousemove = null;
            document.body.style.overflow = 'visible'
        };

    }




};


// page default ui.
const setDefaultUI = (slotID) => {
    let options = {
        startSocket: 'right',
        endSocket: 'top',
        color: 'rgba(255, 255, 0, 0.9)',
    };

    nodeLines.mainPanelLine = new LeaderLine(
        document.getElementById(slotID.MAIN_PANEL_SLOT_ID),
        document.getElementById(slotID.CORE_SLOT_TOP_ID),
        options,
    );

    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.hide("none");
        }
    });

}

const setDebugPanelCon = (slotID) => {
    let options = {
        startSocket: 'right',
        endSocket: 'left',
        color: 'rgba(0, 255, 0, 0.9)',
    };

    nodeLines.debugPanelLine = new LeaderLine(
        document.getElementById(slotID.DEBUG_OUT_SLOT_ID),
        document.getElementById(slotID.DEBUG_IN_SLOT_ID),
        options,
    );
    nodeLines.debugPanelLine.hide('none');
}

// some normal callbacks for param.
const globalUiCallbacks = {
    updatePoint: (sectionParams, Render,pointName) => {
        return function (event,ui) {
            sectionParams[pointName] = ui.value;
            Render()
        }
    },
    updateValue: (sectionParams, Render,valueName) => {
        return function (event,ui) {
            sectionParams[valueName] = ui.value;
            console.log(ui)
            Render()
        }
    },
    updateVector3:(sectionParams, Render,vector3Name)=>{
        return function(event, ui){
            sectionParams[vector3Name] = ui.value;
            Render()
        }
    },
    updateArray3:(sectionParams, Render,array3Name)=>{
        return function(event, ui){
            sectionParams[array3Name][0] = ui.value[0];
            sectionParams[array3Name][1] = ui.value[1];
            sectionParams[array3Name][2] = ui.value[2];
            Render()
        }
    },
    updateChildVector3:(sectionParams, Render,childName,vector3Name,)=>{
        return function(event, ui){
            sectionParams[childName][vector3Name] = ui.value;
            Render()
        }
    },
    updatePointArray:(sectionParams, Render,valueName,index) =>{
        return function (event, ui){
            sectionParams[valueName][index] = ui.value;
            Render()
        }
    }

}

const updateSlot = () => {
    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.position();
        }
    });
}

const destroy = () => {
    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.remove();
        }
    });
}

export default {
    panelDrag,
    setDefaultUI,
    setDebugPanelCon,
    nodeLines,
    globalUiCallbacks,
    updateSlot,
    destroy,
}