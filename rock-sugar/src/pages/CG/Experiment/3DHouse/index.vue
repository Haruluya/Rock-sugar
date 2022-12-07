<template lang="html">
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>
<script>

import uiSetting from "../ui-setting"
import { Point,Polygon,Rect,Line, InPoint} from "../Interfaces"

const desData = {
    category: "Experiment",
    name: "3DHouse",
    buttonContent: "查看源码",
    title: "3DHouse",
    content: "3DHouse."
}

/*
    @author:haruluya
    @des: Ex14 3DHouse.
*/

export default {
    name: "3DHouse",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                nProjectionType : 0,// 投影类型, 0:透视投影 1:平行投影
                VRP : [0,0,0], //视平面参考点(相对于世界坐标系)
                Theta : .0, //视图参考坐标系与z轴的偏角
                Phi : 0, //视图参考坐标系与y轴的偏角
                Delta : 0, //视图参考坐标系与x轴的偏角
                PRP : [250,100,250], //投影参考点(相对于视图参考坐标系)
                CW : [0,0], //窗口中心点(相对于视图参考坐标系)

                wcHouse : [],// 世界坐标系中的房屋坐标，原始数据
                vcHouse : [], //视图参考坐标系中的房屋坐标
                scHouse : [], //屏幕坐标系中的房屋坐标
                lPRP : [], //布局图所用的投影参考点
                lwcWC : [], //布局图中的世界坐标系(相对于世界坐标系)
                lscWC : [], //布局图中的世界坐标系(相对于屏幕坐标系)
                lwcVRC : [], //布局图中的视图参考坐标系(相对于世界坐标系)
                lvcVRC : [],
                lscVRC : [], //布局图中的视图参考坐标系(相对于世界坐标系)
                lwcPRP : [], //布局图中的投影参考点(相对于世界坐标系)
                lvcPRP : [],
                lscPRP : [], //布局图中的投影参考点(相对于世界坐标系)
                MT : [], //三维变换矩阵
                MP : [], //投影变换矩阵
                debugContent: null,
                girdSize: 2,
                color:"#000000",
                screenTransform:{x:50,y:120,scale:100},
                showModel:0,
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
                {
                    type: "slider", id: "showProjectionView", value: sectionParams.showModel, min: 0, max: 1,
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "showModel")
                },
                {
                    type: "slider", id: "Theta", value: sectionParams.Theta, min: 0, max: 360,
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "Theta")
                },
                {
                    type: "slider", id: "Phi", value: sectionParams.Phi, min: 0, max: 360,
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "Phi")
                },
                {
                    type: "slider", id: "Delta", value: sectionParams.Delta, min: 0, max: 360,
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "Delta")
                },
                { type: "color",id: "color",default: sectionParams.color, 
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "color")},
                { type: "slider-vector", id: "PRP" , value: sectionParams.PRP, min: { 0: 0, 1: 0,2:0 }, max: { 0: 500, 1: 500 ,2:500}, 
                callback: uiSetting.globalUiCallbacks.updatePoint(this, "PRP") },
                { type: "slider-vector", id: "VRP" , value: sectionParams.VRP, min: { 0: 0, 1: 0,2:0 }, max: { 0: 500, 1: 500 ,2:500}, 
                callback: uiSetting.globalUiCallbacks.updatePoint(this, "VRP") },
               
            ];

            return setter;
        },
    },
    mounted() {
        this.Init();
        this.SetUI();
    },
    methods: {
        Init() {
            this.$refs.page.Init();
            
            this.canvas = this.$refs.page.getCanvas();
            this.ctx = canvas.getContext('2d');
            this.$refs.page.setViewer(this.sectionParams.screenTransform,this.Render);

            //init data;
            let i = 0, j = 0;
            //push array.
            for(let t = 0; t < 14; t++){
                this.sectionParams.wcHouse.push([]);
                this.sectionParams.vcHouse.push([]);
                this.sectionParams.scHouse.push([]);
            }
            for(let t = 0; t < 4; t++){
                this.sectionParams.lwcWC.push([]);
                this.sectionParams.lscWC.push([]);
                this.sectionParams.lwcVRC.push([]);
                this.sectionParams.lvcVRC.push([]);
                this.sectionParams.lscVRC.push([]);
                this.sectionParams.MT.push([]);
                this.sectionParams.MP.push([]);
            }
            for(let t = 0; t < 2; t++){
                this.sectionParams.lwcPRP.push([]);
                this.sectionParams.lvcPRP.push([]);
                this.sectionParams.lscPRP.push([]);
            }

            //初始化房屋数据
            this.sectionParams.wcHouse[0][0] = 20.0; this.sectionParams.wcHouse[0][1] = 0.0; this.sectionParams.wcHouse[0][2] = 0.0;
            this.sectionParams.wcHouse[1][0] = 20.0; this.sectionParams.wcHouse[1][1] = 0.0; this.sectionParams.wcHouse[1][2] = 8.0;
            this.sectionParams.wcHouse[2][0] = 20.0; this.sectionParams.wcHouse[2][1] = 6.0; this.sectionParams.wcHouse[2][2] = 8.0;
            this.sectionParams.wcHouse[3][0] = 20.0; this.sectionParams.wcHouse[3][1] = 9.0; this.sectionParams.wcHouse[3][2] = 4.0;
            this.sectionParams.wcHouse[4][0] = 20.0; this.sectionParams.wcHouse[4][1] = 6.0; this.sectionParams.wcHouse[4][2] = 0.0;
            this.sectionParams.wcHouse[5][0] = 28.0; this.sectionParams.wcHouse[5][1] = 4.0; this.sectionParams.wcHouse[5][2] = 8.0;
            this.sectionParams.wcHouse[6][0] = 28.0; this.sectionParams.wcHouse[6][1] = 0.0; this.sectionParams.wcHouse[6][2] = 8.0;
            for (i = 7; i<14; i++)
            {
                this.sectionParams.wcHouse[i][0] = this.sectionParams.wcHouse[i - 7][0] + 20;
                this.sectionParams.wcHouse[i][1] = this.sectionParams.wcHouse[i - 7][1];
                this.sectionParams.wcHouse[i][2] = this.sectionParams.wcHouse[i - 7][2];
                this.sectionParams.wcHouse[i][3] = 1.0;
            }
            this.sectionParams.wcHouse[12][0] = this.sectionParams.wcHouse[5][0] + 4;
            this.sectionParams.wcHouse[13][0] = this.sectionParams.wcHouse[6][0] + 4;
            //调整房屋大小
            let nScale = 5; //缩放比例
            for (i = 0; i<14; i++)
            {
                this.sectionParams.wcHouse[i][0] = nScale * this.sectionParams.wcHouse[i][0];
                this.sectionParams.wcHouse[i][1] = nScale * this.sectionParams.wcHouse[i][1];
                this.sectionParams.wcHouse[i][2] = nScale * this.sectionParams.wcHouse[i][2];
            }
            //初始化世界坐标系
            for (i = 0; i<4; i++)
                for (j = 0; j<3; j++)
                    this.sectionParams.lwcWC[i][j] = 0.0;
            this.sectionParams.lwcWC[0][0] = 300;
            this.sectionParams.lwcWC[1][1] = 100;
            this.sectionParams.lwcWC[2][2] = 100;

            //初始化视图参考坐标系
            for (i = 0; i<4; i++)
                for (j = 0; j<3; j++)
                    this.sectionParams.lwcVRC[i][j] = 0.0;
            this.sectionParams.lwcVRC[0][0] = 30;
            this.sectionParams.lwcVRC[1][1] = 30;
            this.sectionParams.lwcVRC[2][2] = 30;
            this.sectionParams.lPRP[0] = 3000.0;
            this.sectionParams.lPRP[1] = 1000.0;
            this.sectionParams.lPRP[2] = 6000.0;




            this.Render();
        },
        Render() {
            this.$refs.page.Render();
           
            const ctx = this.ctx;
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.sectionParams.girdSize += this.$refs.page.girdSize;
            uiSetting.drawGrid(this);

            if(this.sectionParams.girdSize  <= 0) {
                    this.sectionParams.girdSize = 1
            }
            this.sectionParams.debugContent = [{
                title: "grid", content: "The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];
            uiSetting.setScreenTransform(this.sectionParams.screenTransform);
            //3DHouse.
            if(this.sectionParams.showModel == 0){
                this.ShowLayout();
            }else if(this.sectionParams.showModel == 1){
                this.ShowProjection();
            }

        },
        setProjectionType(n){
            this.sectionParams.nProjectionType = n;
        },
        setVRP(vrp0, vrp1, vrp2){
            this.sectionParams.VRP[0] = vrp0;
            this.sectionParams.VRP[1] = vrp1;
            this.sectionParams.VRP[2] = vrp2;
        },
        setAngle( th,  ph,  dt){
            this.sectionParams.Theta = th;
            this.sectionParams.Phi = ph;
            this.sectionParams.Delta = dt;
        },
        setPRP( prp0,  prp1,  prp2){
            this.sectionParams.PRP[0] = prp0;
            this.sectionParams.PRP[1] = prp1;
            this.sectionParams.PRP[2] = prp2;
        },
        setCW( cw0,  cw1){
            this.sectionParams.CW[0] = cw0;
            this.sectionParams.CW[1] = cw1;
        },

        ShowLayout(){
            let i, j;
            //计算投影参考点的世界坐标
            for (i = 0; i<2; i++)
                for (j = 0; j<3; j++)
                {
                    this.sectionParams.lwcPRP[i][j] = this.sectionParams.VRP[j] + this.sectionParams.PRP[j];
                    this.sectionParams.lwcPRP[i][j] = this.sectionParams.VRP[j] + this.sectionParams.PRP[j];
                }
            this.sectionParams.lwcPRP[1][1] = 0.0;

            this.GenerateMatricTransform(this.sectionParams.VRP[0],this.sectionParams. VRP[1], this.sectionParams.VRP[2], this.sectionParams.Theta,this.sectionParams. Phi, this.sectionParams.Delta, this.sectionParams.MT);
            //生成三维变换矩阵
            this.Transform(this.sectionParams.lwcVRC, this.sectionParams.lvcVRC, 4, this.sectionParams.MT); //视图参考坐标系
            this.Transform(this.sectionParams.lwcPRP, this.sectionParams.lvcPRP, 2, this.sectionParams.MT); //投影参考点
                                            //////////////////////////////////////////////////////////////////////////////////
                                            //投影变换
            this.GenerateMatricProject(this.sectionParams.lPRP, this.sectionParams.MP, 0);//生成布局图所用的投影矩阵
            this.Project(this.sectionParams.wcHouse, this.sectionParams.scHouse, 14, this.sectionParams.MP); //房屋
            this.Project(this.sectionParams.lwcWC, this.sectionParams.lscWC, 4, this.sectionParams.MP); //世界坐标系
            this.Project(this.sectionParams.lvcVRC, this.sectionParams.lscVRC, 4, this.sectionParams.MP); //视图参考坐标系
            this.Project(this.sectionParams.lvcPRP, this.sectionParams.lscPRP, 2, this.sectionParams.MP); //投影参考点
                                            //////////////////////////////////////////////////////////////////////////////////
                                            //屏幕变换
            this.ToScreen(this.sectionParams.scHouse, 14); //房屋
            this.ToScreen(this.sectionParams.lscWC, 4); //世界坐标系
            this.ToScreen(this.sectionParams.lscVRC, 4); //视图参考坐标系
            this.ToScreen(this.sectionParams.lscPRP, 2); //投影参考点
                                //////////////////////////////////////////////////////////////////////////////////
                                //显示图形
            this.DrawHouse();//画房屋
                        //画世界坐标系
            for (i = 0; i<3; i++)
                uiSetting.drawLineInGrid(this,new Point(this.sectionParams.lscWC[3][0], this.sectionParams.lscWC[3][1]), new Point(this.sectionParams.lscWC[i][0], this.sectionParams.lscWC[i][1]),this.sectionParams.color);

            for (i = 0; i<3; i++)
                uiSetting.drawLineInGrid(this,new Point(this.sectionParams.lscVRC[i][0], this.sectionParams.lscVRC[i][1]), new Point(this.sectionParams.lscVRC[3][0], this.sectionParams.lscVRC[3][1]),this.sectionParams.color);

            //画投影参考点
            uiSetting.drawEllipseInGrid(this,this.sectionParams.lscPRP[0][0] - 3, this.sectionParams.lscPRP[0][1] - 3, 6, 6);
            uiSetting.drawLineInGrid(this,new Point(this.sectionParams.lscPRP[0][0], this.sectionParams.lscPRP[0][1]), new Point(this.sectionParams.lscPRP[1][0], this.sectionParams.lscPRP[1][1]),this.sectionParams.color);
        },// 显示布局图，供CLayoutView调用

        
        ShowProjection(){
            //三维变换
            this.GenerateMatricTransform(-this.sectionParams.VRP[0], -this.sectionParams.VRP[1], -this.sectionParams.VRP[2], -this.sectionParams.Theta, -this.sectionParams.Phi, -this.sectionParams.Delta, this.sectionParams.MT);
            this.Transform(this.sectionParams.wcHouse, this.sectionParams.vcHouse, 14, this.sectionParams.MT);
            //投影变换
            this.GenerateMatricProject(this.sectionParams.PRP, this.sectionParams.MP, this.sectionParams.nProjectionType);
            this.Project(this.sectionParams.vcHouse, this.sectionParams.scHouse, 14, this.sectionParams.MP);
            //屏幕变换
            this.ToScreen(this.sectionParams.scHouse, 14);
            //显示图形
            this.DrawHouse();
        },// 显示投影图，供CProjectionView调用

        Transform( MS,  MO,  nRow,  MT){
            let i, j;
            for (i = 0; i<nRow; i++)
                for (j = 0; j<3; j++)
                    MO[i][j] = MT[j][0] * MS[i][0] + MT[j][1] * MS[i][1] +MT[j][2] * MS[i][2] + MT[j][3] * 1.0;
        },//三维变换

        Project( MS,  MO,  nRow,  MP){
            let i;
            let xObs, yObs, zObs, wObs;
            for (i = 0; i<nRow; i++)
            {
                xObs = MS[i][0] * MP[0][0] + MS[i][2] * MP[0][2];
                yObs = MS[i][1] * MP[1][1] + MS[i][2] * MP[1][2];
                zObs = 0.0;
                wObs = MS[i][2] * MP[3][2] + 1.0;
                MO[i][0] = (Math.floor)(xObs / wObs);
                MO[i][1] = (Math.floor)(yObs / wObs);
            }
        },// 投影变换
        
        ToScreen( MS,  nRow){
            let i;
            for (i = 0; i<nRow; i++)
                MS[i][1] = -MS[i][1];
        },// 屏幕变换

        MatricMultiply( M1,  M2,  M3){
            for (let i = 0; i<4; i++)
                for (let j = 0; j<4; j++)
                    M3[i][j] = M1[i][0] * M2[0][j] + M1[i][1] * M2[1][j] + M1[i][2] * M2[2][j] + M1[i][3] * M2[3][j];
        },// 矩阵乘法

        GenerateMatricTransform( dx,  dy,  dz,
            theta,  phi,  delta,  MT){
            const PI = Math.PI;
            //将角度转换成弧度
            let _theta = theta*PI / 180;
            let _phi = phi*PI / 180;
            let _delta = delta*PI / 180;
            let T = [], Rz = [], Ry = [], Rx = [], temp = [];
            for(let t = 0; t < 4;t++){
                T.push([]);Rz.push([]);Ry.push([]);Rx.push([]);temp.push([]);
            }
            //初始化矩阵
            let i, j;
            for (i = 0; i<4; i++)
                for (j = 0; j<4; j++)
                {
                    T[i][j] = 0.0;
                    Ry[i][j] = 0.0;
                    Rx[i][j] = 0.0;
                    Rz[i][j] = 0.0;
                    temp[i][j] = 0.0;
                    MT[i][j] = 0.0;
                }
            //平移变换
            T[0][0] = 1.0;
            T[0][3] = dx;
            T[1][1] = 1.0;
            T[1][3] = dy;
            T[2][2] = 1.0;
            T[2][3] = dz;
            T[3][3] = 1.0;
            //绕z轴旋转
            Rz[0][0] = Math.cos(_theta);
            Rz[0][1] = -Math.sin(_theta);
            Rz[1][0] = Math.sin(_theta);
            Rz[1][1] = Math.cos(_theta);
            Rz[2][2] = 1.0;
            Rz[3][3] = 1.0;
            //绕y轴旋转
            Ry[0][0] = Math.cos(_phi);
            Ry[0][2] = Math.sin(_phi);
            Ry[1][1] = 1.0;
            Ry[2][0] = -Math.sin(_phi);
            Ry[2][2] = Math.cos(_phi);
            Ry[3][3] = 1.0;
            //绕x轴旋转
            Rx[0][0] = 1.0;
            Rx[1][1] = Math.cos(_delta);
            Rx[1][2] = -Math.sin(_delta);
            Rx[2][1] = Math.sin(_delta);
            Rx[2][2] = Math.cos(_delta);
            Rx[3][3] = 1.0;
            //生成三维变换矩阵
            //MT = Rx * Ry * Rz * T
            this.MatricMultiply(T, Rz, MT);
            this.MatricMultiply(MT, Ry, temp);
            this.MatricMultiply(temp, Rx, MT)
        },// 构造三维变换矩阵

        GenerateMatricProject( PRP,  MP,  nType){
            //透视投影
            if (nType == 0)
            {
                MP[0][0] = 1.0;
                MP[0][1] = 0.0;
                MP[0][2] = -PRP[0] / PRP[2];
                MP[0][3] = 0.0;
                MP[1][0] = 0.0;
                MP[1][1] = 1.0;
                MP[1][2] = -PRP[1] / PRP[2];
                MP[1][3] = 0.0;
                MP[2][0] = 0.0;
                MP[2][1] = 0.0;
                MP[2][2] = 0.0;
                MP[2][3] = 0.0;
                MP[3][0] = 0.0;
                MP[3][1] = 0.0;
                MP[3][2] = -1.0 / PRP[2];
                MP[3][3] = 1.0;
            }
            //平行投影
            else if (nType == 1)
            {
                MP[0][0] = 1.0;
                MP[0][1] = 0.0;
                MP[0][2] = -(PRP[0] - CW[0]) / PRP[2];
                MP[0][3] = 0.0;
                MP[1][0] = 0.0;
                MP[1][1] = 1.0;
                MP[1][2] = -(PRP[1] - CW[1]) / PRP[2];
                MP[1][3] = 0.0;
                MP[2][0] = 0.0;
                MP[2][1] = 0.0;
                MP[2][2] = 0.0;
                MP[2][3] = 0.0;
                MP[3][0] = 0.0;
                MP[3][1] = 0.0;
                MP[3][2] = 0.0;
                MP[3][3] = 1.0;
            }
        },// 投影矩阵,

        DrawHouse(){
            let i;
            //画左侧墙壁
            for (i = 0; i<5; i++)
                uiSetting.drawLineInGrid(this,new Point(this.sectionParams.scHouse[i][0], this.sectionParams.scHouse[i][1]),
                 new Point(this.sectionParams.scHouse[(i + 1) % 5][0], this.sectionParams.scHouse[(i + 1) % 5][1]),this.sectionParams.color);
            //画右侧墙壁
            for (i = 7; i<11; i++)
                uiSetting.drawLineInGrid(this,new Point(this.sectionParams.scHouse[i][0], this.sectionParams.scHouse[i][1]), new Point(this.sectionParams.scHouse[i + 1][0], this.sectionParams.scHouse[i + 1][1]));
            uiSetting.drawLineInGrid(this,new Point(this.sectionParams.scHouse[i][0], 
                this.sectionParams.scHouse[i][1]), new Point(this.sectionParams.scHouse[7][0], this.sectionParams.scHouse[7][1]),this.sectionParams.color);
            //画横梁
            for (i = 0; i<6; i++)
                uiSetting.drawLineInGrid(this,new Point(this.sectionParams.scHouse[i][0], this.sectionParams.scHouse[i][1]), new Point(this.sectionParams.scHouse[i + 7][0], this.sectionParams.scHouse[i + 7][1]));
            //画门
            uiSetting.drawLineInGrid(this,new Point(this.sectionParams.scHouse[5][0], this.sectionParams.scHouse[5][1]), new Point(this.sectionParams.scHouse[6][0], this.sectionParams.scHouse[6][1]));
            uiSetting.drawLineInGrid(this,new Point(this.sectionParams.scHouse[12][0], this.sectionParams.scHouse[12][1]), new Point(this.sectionParams.scHouse[13][0], this.sectionParams.scHouse[13][1]));
        },// 绘制房子
        SetUI() {
            this.$refs.page.SetUI();
        },
    }
}

</script>