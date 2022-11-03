<template lang="html">
    <nano_cg_experiment_page
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_section_params="sectionParams"
        ref="page"
    />
</template>
<script>



import uiSetting from "../ui-setting"

const desData = {
    category:"Experiment",
    name:"Bresenham",
    buttonContent:"查看源码",
    title:"Bresenham画线",
    content:"Bresenham's line algorithm."
}



/*
    @author:haruluya
    @des: Ex04 Bresenham.
*/

export default {
    name: "Bresenham",
    data() {
        return {
            canvas:null,
            ctx:null,
            // component data.
            desData,
   
            // params of page.
            sectionParams:{
                beginPoint:{x:1,y:1},
                endPoint:{x:100, y:20},
                color:'#ffffff',
                girdSize:10,
                debugContent:null,
            }
        };
    },

    computed:{
        //uiSetter.
        uiSetter(){
            let sectionParams = this.sectionParams;
            return [
                {type:"slider", id:"beginX", value: sectionParams.beginPoint.x, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"beginPoint",'x')
                },
                {type:"slider", id:"beginY", value: sectionParams.beginPoint.y, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"beginPoint",'y')
                },
                {type:"slider", id:"endX", value: sectionParams.endPoint.x, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"endPoint",'x')
                },
                {type:"slider", id:"endY", value: sectionParams.endPoint.y, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"endPoint",'y')
                },
                {type:"slider", id:"girdSize",value:sectionParams.girdSize,min:1,max:100,
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"girdSize")
                }
            ]
        },
    },
    methods: {
        Init() {
            this.$refs.page.Init();

            this.canvas = this.$refs.nanoCanvas.$refs.canvas;
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
                title:"grid",content:"The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];

            ctx.fillStyle = sectionParams.color;

            let beginPoint = sectionParams.beginPoint;
            let endPoint = sectionParams.endPoint;

            let temp = null;
            let m, x, y = 0;
            let e = -0.5;

            //Horizontal line.
            if(beginPoint.y == endPoint.y)
            {
                if(beginPoint.x>endPoint.x)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                for(x=beginPoint.x; x<endPoint.x; x++)
                    uiSetting.drawPointInGrid(this,x, beginPoint.y);
                return;
            }
            //Vertical line.
            if(beginPoint.x == endPoint.x)
            {
                if(beginPoint.y>endPoint.y)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                for(y=beginPoint.y; y<endPoint.y; y++)
                    uiSetting.drawPointInGrid(this,beginPoint.x, y);
                return;
            }

            m = (endPoint.y-beginPoint.y)/(endPoint.x-beginPoint.x);
            if(m>0 && m<=1)
            {
                if(beginPoint.x>endPoint.x)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                e=-0.5;
                x = beginPoint.x;
                y = beginPoint.y;
                while(x<endPoint.x)
                {
                    uiSetting.drawPointInGrid(this,x,y);
                    e=e+m;
                    if(e>0)
                    {
                        y++;
                        e=e-1;
                    }
                    x++;
                }
            }
            else if(m>=-1 && m<0)
            {
                if(beginPoint.x>endPoint.x)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                e=0.5;
                x = beginPoint.x;
                y = beginPoint.y;
                while(x<endPoint.x)
                {
                    uiSetting.drawPointInGrid(this,x,y);
                    e=e+m;
                    if(e<0)
                    {
                        y--;
                        e=e+1;
                    }
                    x++;
                }
            }
            else if(m>1)
            {
                if(beginPoint.y>endPoint.y)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                e=-0.5;
                x = beginPoint.x;
                y = beginPoint.y;
                while(y<endPoint.y)
                {
                    uiSetting.drawPointInGrid(this,x,y);
                    e=e+1/m;
                    if(e>0)
                    {
                        x=x+1;
                        e=e-1;
                    }
                    y++;
                }
            }
            else
            {
                if(beginPoint.y>endPoint.y)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                e=0.5;
                x = beginPoint.x;
                y = beginPoint.y;
                while(y<endPoint.y)
                {
                    uiSetting.drawPointInGrid(this,x,y);
                    e=e+1/m;
                    if(e<0)
                    {
                        x--;
                        e=e+1;
                    }
                    y++;
                }
            }
        

        },
        SetUI(){
            this.$refs.page.SetUI();
            uiSetting.drawGrid(this);
        },

    },
    mounted() {
        this.Init();
        this.SetUI();
    },
    destroyed() {
        this.Destory();
    },
  
};




</script>
