<template lang="html">
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>
<script>



import uiSetting from "../ui-setting"
import { Edge, Polygon } from "../Interfaces"


const desData = {
    category: "Experiment",
    name: "EdgeTablePolygon",
    buttonContent: "查看源码",
    title: "多边形有序边表",
    content: "Edge table polygon."
}


/*
    @author:haruluya
    @des: Ex07 EdgeTablePolygon.
*/

export default {
    name: "EdgeTablePolygon",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                points: [{ x: 20, y: 20 }, { x: 20, y: 70 }, { x: 50, y: 50 }, { x: 110, y: 60 }, { x: 110, y: 30 }, { x: 50, y: 10 }],
                // points:[{x:125,y:125},{x:250,y:43},{x:0,y:43}],
                color:'#0bc6e3',
                debugContent: null,
                girdSize: 5,
            }
        };
    },

    computed: {
        //uiSetter.
        uiSetter() {
            let sectionParams = this.sectionParams;
            let setter = [
                {
                    type: "slider", id: "girdSize", value: sectionParams.girdSize, min: 1, max: 100,
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "girdSize")
                },
                { type: "color",id: "color",default: sectionParams.color, callback: uiSetting.globalUiCallbacks.updateValue(this, "color")}
            ];
            for (let i= 0; i < this.sectionParams.points.length; i++){
                setter.push(
                 { type: "slider-vector", id: "point"+i , value: sectionParams.points[i], min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePointArray(this, "points", i) },
                )
            }
            return setter;
        },

    },
    methods: {
        Init() {
            this.$refs.page.Init();

            this.canvas = this.$refs.page.getCanvas();
            this.ctx = canvas.getContext('2d');

            this.Render();
        },
        Render() {
            this.$refs.page.Render();

            const ctx = this.ctx;
            const sectionParams = this.sectionParams;
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            uiSetting.drawGrid(this);

            this.sectionParams.debugContent = [{
                title: "grid", content: "The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];

            ctx.fillStyle = sectionParams.color;


            // EdgeTablePolygon.
            // check amount of point.
            const points = new Polygon(this.sectionParams.points);
            if (points.size() < 3)
                return;

            let i, j, x0, x1, y, tx, temp;
            // amount of scanline.
            let scanLines, min, max;

            //edge table.
            let ET = {};
            //active edge table.
            let AET = [];
            //table of intersection point.
            let arr = [];
            //begin point.
            let p0;
            //end point.
            let p1;
            // ptr of node.
            let pNode;

            min = points.minPointY();
            max = points.maxPointY();
            scanLines = max - min;

            //Processing side by side, inserting the information of each edge into the ET.
            for (let i = 0; i < points.size(); i++) {
                if (i < points.size() - 1) {
                    p0 = points.indexValue(i);
                    p1 = points.indexValue(i + 1);
                }
                else {
                    p0 = points.indexValue(i);
                    p1 = points.indexValue(0);
                }

                if (p0.y > p1.y) {
                    temp = p0;
                    p0 = p1;
                    p1 = temp;
                }

                if (p0.y != p1.y) {
                    pNode = new Edge(p0.x, (p1.x - p0.x) / (p1.y - p0.y), (p1.y - 1));
                    if (!ET[p0.y - min]) {
                        ET[p0.y - min] = [];
                    }

                    ET[p0.y - min].push(pNode);
                }

            }

            for (let i = 0; i < scanLines; i++) {

                y = i + min;
                if (ET[i]) {
                    ET[i].forEach(element => {
                        AET.push(element);
                    });

                }
                ET[i] = null;

                //Dealing with active edge table AET.
                if (AET) {
                    for (let i = 0; i < AET.length;) {
                        if (AET[i].getYmax() < y) {
                            AET.splice(i, 1);

                        } else {
                            i++;
                        }
                    }
                }
                //Activate the edge table is not empty, find the intersection, sort, draw a line.
                if (AET) {

                    AET.forEach(element => {
                        arr.push(element.getX());
                        element.setX(element.getX() + element.getDx());
                    });

                    arr.sort();

                    for (j = 0; j < arr.length; j++) {
                        if (j % 2 == 0) {
                            tx = arr[j];
                            if (arr[j] - tx)
                                x0 = tx + 1;
                            else
                                x0 = tx;
                            x1 = arr[j + 1];
                        }

                        uiSetting.drawLineInGrid(this, { x: x0, y: y }, { x: x1, y: y }, this.sectionParams.color);
                    }
                    arr = [];
                }
            }
            ET = [];
        },
        SetUI() {
            this.$refs.page.SetUI();
        },


    },
    mounted() {
        this.Init();
        this.SetUI();
    },


};

</script>
