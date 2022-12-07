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
                pn:4,
                vn:5,
                pp:[new Point(100,100),new Point(300,200),new Point(100,300),new Point(200,200)],
                vp:[new Point(100,150),new Point(250,150),new Point(250,250),new Point(100,250),new Point(220,200)],
                pLine:[],
                vLine:[],
                ppoint:[],
                vpoint:[],
                innerColor:'#0bc6e3',
                outerColor:'#ffffff',
                clipColor:'#000000',
                debugContent: null,
                girdSize: 2,
                screenTransform:{x:-20,y:-80,scale:100}
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
                { type: "color",id: "innerColor",default: sectionParams.innerColor, callback: 
                    uiSetting.globalUiCallbacks.updateValue(this, "innerColor")},
                { type: "color",id: "outerColor",default: sectionParams.outerColor, callback: 
                    uiSetting.globalUiCallbacks.updateValue(this, "outerColor")},
                { type: "color",id: "clipColor",default: sectionParams.clipColor, callback: 
                    uiSetting.globalUiCallbacks.updateValue(this, "clipColor")},
            ];
            for (let i= 0; i < 2; i++){
                setter.push(
                 { type: "slider-vector", id: "pp"+i , value: sectionParams.pp[i], min: { x: -300, y: -300 }, max: { x: 300, y: 300 }, callback: 
                    uiSetting.globalUiCallbacks.updatePointArray(this, "pp", i) },
                )
            }
            for (let i= 0; i < 2; i++){
                setter.push(
                 { type: "slider-vector", id: "vp"+i , value: sectionParams.vp[i], min: { x: -300, y: -300 }, max: { x: 300, y: 300 }, callback: 
                    uiSetting.globalUiCallbacks.updatePointArray(this, "vp", i) },
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
            this.$refs.page.setViewer(this.sectionParams.screenTransform,this.Render);
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
          

            // weilerAthenton.
            const pp = this.sectionParams.pp;
            const vp = this.sectionParams.vp;
            const pn = this.sectionParams.pn;
            const vn = this.sectionParams.vn;

            //将输入的点从存放到vector中
            let points_p = [],points_v = [];
            for(let i=0;i<pn;++i)points_p.push(pp[i]);
            if(points_p.length<3)
            return;
            for(let i=0;i<vn;++i)points_v.push(vp[i]);
            if(points_v.length<3)
            return;
            let polyp = new Polygon(points_p);
            let polyv = new Polygon(points_v);

            uiSetting.drawPolygonInGrid(this,polyp,this.sectionParams.outerColor);
            uiSetting.drawPolygonInGrid(this,polyv,this.sectionParams.clipColor);

            //清理之前的绘图数据
            let pLine = this.sectionParams.pLine;
            let vLine = this.sectionParams.vLine;
            pLine.length = 0;
            vLine.length = 0;

            let A = new Point(0,0),B = new Point(0,0);
            //对于被裁减多边形，从起点到终点的所有边顺时针插入多边形边链表
            for(let i=0;i<pn-1;++i){
                A.setX(pp[i].x);A.setY(pp[i].y);
                B.setX(pp[i+1].x);B.setY(pp[i+1].y);
                pLine.push(new Line(A,B));
                A.setX(B.x);A.setY(B.y)
            }
            B.setX(pp[0].x);B.setY(pp[0].y);
            pLine.push(new Line(A,B));

            //对于裁剪窗口，从起点到终点的所有边顺时针插入多边形边链表
            for(let i=0;i<vn-1;++i){
                A.setX(vp[i].x);A.setY(vp[i].y);
                B.setX(vp[i+1].x);B.setY(vp[i+1].y);
                vLine.push(new Line(A,B));
                A.setX(B.x);A.setY(B.y)
            }
            B.setX(vp[0].x);B.setY(vp[0].y);
            vLine.push(new Line(A,B));

            //根据线段表pLine、vLine得出交点表ppoint,vpoint
            this.SetPLane();
  
            let PointInter = [];//裁剪之后的多边形的坐标
            let Num = [];//每个裁剪后多边形的坐标个数，Num的size表示交集面的个数
            //根据插入好入点出点还有端点的序列ppoint、vpoint，找裁剪后的多边形
            this.BoolIntersection(PointInter, Num);

            let it = 0,itN = 0;
            let points_ans = [];
            for(itN = 0; itN < Num.length; itN++){
                points_ans = [];
                for(let i = 0; i < Num[itN]; i++){
                    points_ans.push(PointInter[it]);
                    it++;
                }
            }
            uiSetting.drawPolygonInGrid(this,new Polygon(points_ans),this.sectionParams.innerColor);

        },
        SetPLane(){
            //先清空之前的绘图数据
            let ppoint = this.sectionParams.ppoint;
            let vpoint = this.sectionParams.vpoint;
            let pLine = this.sectionParams.pLine;
            let vLine = this.sectionParams.vLine;
            ppoint.length = 0;
            vpoint.length = 0;


            let itp = 0,itv = 0;
            let t = [];//用于保存每条边与其他边相交时交点在线段上的位置
            let tp = new Point(0,0);
            let tt = .0;//对于线段A->B，tt<0代表交点在A左侧，tt==0代表在A，0<tt<1代表在AB中间，tt==1代表在B，tt>1代表在B右侧

            //对于多边形的每一条边，找到窗口的每一条边（看作线段）与那条边（看作直线）的交点
            for(itp = 0; itp < pLine.length; itp++){
                for(itv = 0; itv < vLine.length; itv++){

                    const {tag,insert,tt} = this.IsInsect(pLine[itp].P1(),pLine[itp].P2(),
                                vLine[itv].P1(),vLine[itv].P2())
                    if(tag){
                        t.push(tt);
                    }
                }
                t.sort();
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
                        const p = pLine[itp].P1().add((pLine[itp].P2().sub(pLine[itp].P1())).mut(t[i]));
                        tInp.setPoint(
                            new Point(Math.floor(p.x),Math.floor(p.y))
                        );
                        
                        if(nt_in % 2 == 0) tInp.setJudge(2); //交点，出点
                        else tInp.setJudge(1); // 交点，入点
                        ppoint.push(tInp.copy());
                    }
                }

                tInp.setPoint(pLine[itp].P2());
                if(nt % 2 == 0) tInp.setJudge(0);//端点
                else tInp.setJudge(1);//交点，入点
                ppoint.push(tInp.copy());
                t = [];
            }
            //对于VIEW的每一条边，找到POLYGON的每一条边与那条边的交点
            for (itv = 0; itv < vLine.length; itv++){
                for (itp = 0; itp < pLine.length; itp++){
                    const {tag,insert,tt} = this.IsInsect(vLine[itv].P1(), vLine[itv].P2(), 
                        pLine[itp].P1(), pLine[itp].P2())
                    if(tag){
                        t.push(tt);
                    }
                }
                t.sort();
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
                        const p = vLine[itv].P1().add((vLine[itv].P2().sub(vLine[itv].P1())).mut(t[i]));
                        tInp.setPoint(
                            new Point(Math.floor(p.x),Math.floor(p.y))
                        );

                        if (nt_in % 2 == 0) tInp.setJudge(2); // 交点，出点
                        else tInp.setJudge(1); // 交点，入点
                        vpoint.push(tInp.copy());
                    }
                }
                tInp.setPoint(vLine[itv].P2());
                if (nt % 2 == 0) tInp.setJudge(0);//端点在外部
                else tInp.setJudge(1);//端点在内部，当作入点标记
                vpoint.push(tInp.copy());
                t = [];
            }
        },
        BoolIntersection(PointInter,Num){
            let ppoint = this.sectionParams.ppoint;
            let vpoint = this.sectionParams.vpoint;

            let jumpP=true;//true代表跳转到被裁剪多边形，false代表跳转到窗口多边形
            let state=0;//0代表在遍历被裁剪多边形
            let itp,ittemp_back,ittemp;
            let itpi = 0, ittemp_backi = 0, ittempi = 0;
            //先遍历ppoint
            itp=ppoint;
            //P代表被裁剪多边形，V代表窗口多边形
            while(true)
            {   
                if(itp[itpi].getJudge()==1){//如果是入点
                    let Npoint=0;
                    PointInter.push(new Point(itp[itpi].getPoint().x,itp[itpi].getPoint().y));
                    Npoint++;
                    let a=itp[itpi].getPoint().x;
                    let b=itp[itpi].getPoint().y;
                    ittemp_back=itp; ittemp_backi = itpi;
                    itpi++;
                    ittemp=itp; ittempi = itpi;

                    //如果之前的跳转是跳转到P，那么现在跳转过来之后下次就跳转到V；反之亦然
                    if(!jumpP)jumpP=true;
                    else jumpP=false;

                    //找到一个入点，以这个入点为起点找这个裁剪区域的其他点
                    while(a!=ittemp[ittempi].getPoint().x||b!=ittemp[ittempi].getPoint().y)
                    {
                        if (ittemp[ittempi].getJudge() == 1)//入点
                        {
                            PointInter.push(new Point(ittemp[ittempi].getPoint().x,ittemp[ittempi].getPoint().y));
                            ittemp[ittempi].setJudge(3); // 标记已经pick的点
                            Npoint++;
                            ittemp_back = ittemp;
                            ittemp_backi = ittempi;
                            ittempi++;
                        }//end入点的情况
                        else if (ittemp[ittempi].getJudge() == 2)//出点，跳转
                        {
                            PointInter.push(new Point(ittemp[ittempi].getPoint().x,ittemp[ittempi].getPoint().y));

                            ittemp[ittempi].setJudge(3); // 标记已经pick的点

                            Npoint++;
                            ittemp_back = ittemp;
                            ittemp_backi = ittempi;

                            if (!jumpP) {//应该跳转到V
                                ittemp = vpoint;
                                ittempi = 0;
                                jumpP = true;//表明下一次应该跳转到P
                            }
                            else//应该跳转到P
                            {
                                ittemp = ppoint;
                                ittempi = 0;
                                jumpP = false;//下一次跳转到V
                            }
 
                            //在跳转到的数组中找到对应的点
                            while ( ((ittemp[ittempi].getPoint().x != ittemp_back[ittemp_backi].getPoint().x)||
                                    (ittemp[ittempi].getPoint().y != ittemp_back[ittemp_backi].getPoint().y)))
                            {
                                ittempi++;
                            }
      
                            ittemp[ittempi].setJudge(3); // 标记已经pick的点

                            ittempi++;

                            if (ittemp[ittempi].getJudge() == 0)
                                break; // 交点为一个的情况
                        }//end出点的情况

                        if (!jumpP)
                        {
                        if (ittempi == ppoint.length && ittemp == ppoint)
                        {
                            ittemp = ppoint;
                            ittempi = 0;
                        }
                        }
                        else
                        {
                        if (ittempi == vpoint.length && ittemp == vpoint)
                        {
                            ittemp = vpoint;
                            ittempi = 0;
                        }
                        }
 
                    }

                    Num.push(Npoint);
                    Npoint = 0; //重新计数
                }//找完一个裁剪后的区域了

                //继续找下一个点，作为裁剪区域的起点
                itpi++;
                if(state==0){//当前在遍历P数组
                    if(itpi==ppoint.length && itp == ppoint){//如果P数组遍历到结尾，那么下次从V开始，并且跳转标记为P
                        itp=vpoint;
                        itpi = 0;
                        jumpP=true;
                        state=1;
                    }
                }
                else{//当前在遍历V数组，V遍历结束，说明整个都结束了
                    if(itpi==vpoint.length && itp == vpoint)
                        break;
                }

            }//搜索完全部的顶点序列了
        },
        IsInsect(A,B,C,D){
            let t =0;
            let insect;
            const dot = (a,b)=>{
                return a.x*b.x+a.y*b.y;
            }
            let b=B.sub(A);//向量
            let d=D.sub(C);
            let c=C.sub(A);
            let d_V = new Point(d.y,-d.x);//d的垂线
            if(dot(b,d_V)==0)return {tag:false};//平行
            else{
                t=dot(c,d_V)/dot(b,d_V);
                let b_V = new Point(b.y,-b.x);
                let u=dot(c,b_V)/dot(b,d_V);
                if(u<0||u>1)return {tag:false};//线段不相交
                else{//线段相交
                    insect=A.add(new Point(b.x*t,b.y*t));
                    return {tag:true,insect,tt:t};
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
