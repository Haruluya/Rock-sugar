<template lang="html">
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>
<script>

import uiSetting from "../ui-setting"
import { Point,Polygon,Rect,Line, InPoint} from "../Interfaces"

const desData = {
    category: "Experiment",
    name: "WeilerAthenton",
    buttonContent: "查看源码",
    title: "WeilerAthenton算法",
    content: "WeilerAthenton."
}



/*
    @author:haruluya
    @des: Ex12 WeilerAthenton.
*/

export default {
    name: "WeilerAthenton",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                mainPoints: [{ x: 100, y: 150 }, { x: 250, y: 150 }, { x: 250, y: 250 }, { x: 100, y: 250 },{x:220,y:200}],
                clipPoints: [{x:100,y:100},{x:300,y:200},{x:100,y:300},{x:200,y:200}],
                innerColor:'#0bc6e3',
                outerColor:'#ffffff',
                clipColor:'#000000',
                debugContent: null,
                girdSize: 3,
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
                { type: "color",id: "innerColor",default: sectionParams.innerColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "innerColor")},
                { type: "color",id: "outerColor",default: sectionParams.outerColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "outerColor")},
                { type: "color",id: "clipColor",default: sectionParams.clipColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "clipColor")},
            ];

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
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            uiSetting.drawGrid(this);

            this.sectionParams.debugContent = [{
                title: "grid", content: "The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];
          

            // weilerAthenton.
            //draw clip frame.
 

        },
        WeilerAthenton(){
            let A = new Point(0,0) 
            let B = new Point(0,0);
            let pLine = [], vLine = [];
            //对于被裁减多边形，从起点到终点的所有边顺时针插入多边形边链表
            for(let i=0;i<pn-1;++i){
                A.setX(pp[i].x());A.setY(pp[i].y());
                B.setX(pp[i+1].x());B.setY(pp[i+1].y());
                pLine.push(new Line(A,B));
                A=B;
            }
            B.setX(pp[0].x());B.setY(pp[0].y());
            pLine.push(new Line(A,B));

            //对于裁剪窗口，从起点到终点的所有边顺时针插入多边形边链表
            for(let i=0;i<vn-1;++i){
                A.setX(vp[i].x());A.setY(vp[i].y());
                B.setX(vp[i+1].x());B.setY(vp[i+1].y());
                vLine.push(new Line(A,B));
                A=B;
            }
            B.setX(vp[0].x());B.setY(vp[0].y());
            vLine.push(new Line(A,B));

            //根据线段表pLine、vLine得出交点表ppoint,vpoint
            this.SetPLane(pLine,vLine);

            let PointInter = [];//裁剪之后的多边形的坐标
            let Num = [];//每个裁剪后多边形的坐标个数，Num的size表示交集面的个数
            //根据插入好入点出点还有端点的序列ppoint、vpoint，找裁剪后的多边形
            this.BoolIntersection(PointInter, Num);

            let points_ans = [];//保留每个裁剪后多边形的顶点
            it = 0;
            Num.forEach((num)=>{
                points_ans = [];
                for (let j = 0; j < num; j++){
                    points_ans.push(PointInter[it])
                    it++;
                }
                uiSetting.drawPolygonInGrid(this,new Polygon(points_ans),this.sectionParams.innerColor)
            })
        },
        SetPLane(pLine,vLine){
            //先清空之前的绘图数据
            let ppoint = [];
            let vpoint = [];

            let itp = 0,itv = 0;
            let t = [];//用于保存每条边与其他边相交时交点在线段上的位置
            let tp = new Point(0,0);
            let tt;//对于线段A.B，tt<0代表交点在A左侧，tt==0代表在A，0<tt<1代表在AB中间，tt==1代表在B，tt>1代表在B右侧
    
            //对于多边形的每一条边，找到窗口的每一条边（看作线段）与那条边（看作直线）的交点
            pLine.forEach(pl=>{
                vLine.forEach(vl=>{
                    if(this.IsInsect(pl.p1(),pl.p2(),vl.p1(),vl.p2(),tp,tt)){
                        t.push(tt);
                    }
                })
                Array.sort(t);
                let tInp = new InPoint(new Point(0,0));
                let nt=0;
                let nt_in=0;
                for (let i = 0; i < t.length; i++)
                {
                    if(i!=0&&t[i]==t[i-1])//避免相交在两条线段的同一个点导致出点入点判断失误的。
                        continue;
                    nt_in++;// 判断交点是出去还是进入 被2整除出 余1进

                    if (t[i] <= 1) nt++; //统计小于1的个数 用于判断B点是否在内部 被2整除不在 余1在

                    if (t[i] > 0 && t[i] <= 1)
                    {
                        tInp.setPoint(itp.p1() +(itp.p2() - itp.p1()) * t[i]);

                        if(nt_in % 2 == 0) tInp.setJudge(2); //交点，出点
                        else tInp.setJudge(1); // 交点，入点

                        ppoint.push(tInp);
                    }
                }
                tInp.setPoint(itp.p2());
                if(nt % 2 == 0) tInp.setJudge(0);//端点
                else tInp.setJudge(1);//交点，入点
                ppoint.push(tInp);
                t = [];
    
            })

        


            //对于VIEW的每一条边，找到POLYGON的每一条边与那条边的交点

            vLine.forEach(vl=>{
                pLine.forEach(pl=>{
                    if (this.IsInsect(itv.p1(), itv.p2(), itp.p1(), itp.p2(), tp, tt)){
                        t.push(tt);
                    }
                })
                Array.sort(t);
                let tInp = new InPoint(new Point(0,0));
                let nt = 0;
                let nt_in = 0;
                for (let i = 0; i < t.length; i++)
                {
                // if(i!=0&&t[i]==t[i-1])//避免相交在两条线段的同一个点导致出点入点判断失误的
                //     continue;
                    nt_in++;
                    if (t[i] <= 1) nt++; //统计小于1的个数（也就是B点之前交点的个数）用于判断B点是否在内部 被2整除不在 余1在

                    if (t[i] > 0 && t[i] <= 1)
                    {
                        tInp.setPoint(itv.p1() + (itv.p2() - itv.p1()) * t[i]);
                        if (nt_in % 2 == 0) tInp.setJudge(2); // 交点，出点
                        else tInp.setJudge(1); // 交点，入点
                        vpoint.push(tInp);
                    }
                }
                tInp.setPoint(itv.p2());
                if (nt % 2 == 0) tInp.setJudge(0);//端点在外部
                else tInp.setJudge(1);//端点在内部，当作入点标记
                vpoint.push(tInp);
                t = [];
            })
            return {ppoint,vpoint}
        },
        BoolIntersection(){
            let jumpP=true;//true代表跳转到被裁剪多边形，false代表跳转到窗口多边形
            let state=0;//0代表在遍历被裁剪多边形
            let itpi = 0,ittemp_backi = 0,ittempi = 0;
            let itp = 0,ittemp_back = 0,ittemp = 0;

            //先遍历ppoint
            itp=ppoint[itpi];
            
            //P代表被裁剪多边形，V代表窗口多边形
            while(true)
            {
                if(itp.getJudge()==1){//如果是入点
                    let Npoint=0;
                    PointInter.push(new Point(itp.getPoint().x(),itp.getPoint().y()));
                    Npoint++;
                    let a=itp.getPoint().x();
                    let b=itp.getPoint().y();
                    ittemp_backi = itpi;
                    ittemp_back=itp;
                    itpi++;
                    itp = ppoint[itpi];
                    ittempi = itpi;
                    ittemp=itp;

                    //如果之前的跳转是跳转到P，那么现在跳转过来之后下次就跳转到V；反之亦然
                    if(!jumpP)jumpP=true;
                    else jumpP=false;
                    
                    //找到一个入点，以这个入点为起点找这个裁剪区域的其他点
                    while(a!=ittemp.getPoint().x()||b!=ittemp.getPoint().y())
                    {
                        if (ittemp.getJudge() == 1)//入点
                        {
                            PointInter.push(Math.floor(ittemp.getPoint().x(),ittemp.getPoint().y()));
                            ittemp.setJudge(3); // 标记已经pick的点
                            Npoint++;
                            ittemp_backi = ittempi;
                            ittemp_back = ittemp;
                            ittempi++;
                            ittemp = ppoint[ittempi];
                        }//end入点的情况
                        else if (ittemp.getJudge() == 2)//出点，跳转
                        {
                            PointInter.push(Math.floor(ittemp.getPoint().x(),ittemp.getPoint().y()));
                            ittemp.setJudge(3); // 标记已经pick的点
                            Npoint++;
                            ittemp_backi = ittempi;
                            ittemp_back = ittemp;

                            if (!jumpP) {//应该跳转到V
                                ittempi = 0;
                                ittemp = vpoint[ittempi];
                                jumpP = true;//表明下一次应该跳转到P
                            }
                            else//应该跳转到P
                            {
                                ittempi = 0;
                                ittemp = vpoint[ittempi];
                                jumpP = false;//下一次跳转到V
                            }
                            //在跳转到的数组中找到对应的点
                            while (ittemp.getPoint().x() != ittemp_back.getPoint().x()||ittemp.getPoint().y()!=ittemp_back.getPoint().y())
                            {
                                ittempi++;
                                ittemp = vpoint[ittempi];
                            }
                            ittemp.setJudge(3); // 标记已经pick的点
                            ittempi++;
                            ittemp = vpoint[ittempi];
                            if (ittemp.getJudge() == 0)
                                break; // 交点为一个的情况
                        }//end出点的情况

                        if (!jumpP)
                        {
                        if (ittempi == ppoint.length)
                            ittempi = 0;
                            ittemp = ppoint[ittempi];
                        }
                        else
                        {
                        if (ittempi == vpoint.length)
                            ittempi = 0;
                            ittemp = vpoint[ittempi];
                        }
                    }
                    Num.push(Npoint);
                    Npoint = 0; //重新计数
                }//找完一个裁剪后的区域了

                //继续找下一个点，作为裁剪区域的起点
                itpi++;
                itp = ppoint[itpi];
                if(state==0){//当前在遍历P数组
                    if(itpi==ppoint.length){//如果P数组遍历到结尾，那么下次从V开始，并且跳转标记为P
                        itpi = 0
                        itp=vpoint[itpi];
                        jumpP=true;
                        state=1;
                    }
                }
                else{//当前在遍历V数组，V遍历结束，说明整个都结束了
                    if(itpi==vpoint.length)
                        break;
                }
            }//搜索完全部的顶点序列了
        },
        IsInsect(A,B,C,D,insect,t){
            let b=B-A; //向量
            let d=D-C;
            let c=C-A;

            let d_V = new Point(d.y(),-d.x());//d的垂线
            if(this.dot(b,d_V)==0)return false;//平行
            else{
                t=this.dot(c,d_V)/this.dot(b,d_V);
                let b_V = new Point(b.y(),-b.x());
                let u=this.dot(c,b_V)/this.dot(b,d_V);
                if(u<0||u>1)return false;//线段不相交
                else{//线段相交
                    insect=A+b*t;
                    return true;
                }
            }
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
