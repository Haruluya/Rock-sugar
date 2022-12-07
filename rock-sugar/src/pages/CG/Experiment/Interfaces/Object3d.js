import uiSetting from "../ui-setting";
export default class Object3d{
    nProjectionType = 0;// 投影类型, 0:透视投影 1:平行投影
    VRP = []; //视平面参考点(相对于世界坐标系)
    Theta = .0; //视图参考坐标系与z轴的偏角
    Phi = 0; //视图参考坐标系与y轴的偏角
    Delta = 0; //视图参考坐标系与x轴的偏角
    PRP = []; //投影参考点(相对于视图参考坐标系)
    CW = []; //窗口中心点(相对于视图参考坐标系)

    wcHouse = [];// 世界坐标系中的房屋坐标，原始数据
    vcHouse = []; //视图参考坐标系中的房屋坐标
    scHouse = []; //屏幕坐标系中的房屋坐标
    lPRP = []; //布局图所用的投影参考点
    lwcWC = []; //布局图中的世界坐标系(相对于世界坐标系)
    lscWC = []; //布局图中的世界坐标系(相对于屏幕坐标系)
    lwcVRC = []; //布局图中的视图参考坐标系(相对于世界坐标系)
    lvcVRC = [];
    lscVRC = []; //布局图中的视图参考坐标系(相对于世界坐标系)
    lwcPRP = []; //布局图中的投影参考点(相对于世界坐标系)
    lvcPRP = [];
    lscPRP = []; //布局图中的投影参考点(相对于世界坐标系)
    MT = []; //三维变换矩阵
    MP = []; //投影变换矩阵

    
    constructor(){
        let i = 0, j = 0;
        for(i = 0; i < 14; i++){
            this.wcHouse.push([]);
        }
        //初始化房屋数据
        this.wcHouse[0][0] = 20.0; this.wcHouse[0][1] = 0.0; this.wcHouse[0][2] = 0.0;
        this.wcHouse[1][0] = 20.0; this.wcHouse[1][1] = 0.0; this.wcHouse[1][2] = 8.0;
        this.wcHouse[2][0] = 20.0; this.wcHouse[2][1] = 6.0; this.wcHouse[2][2] = 8.0;
        this.wcHouse[3][0] = 20.0; this.wcHouse[3][1] = 9.0; this.wcHouse[3][2] = 4.0;
        this.wcHouse[4][0] = 20.0; this.wcHouse[4][1] = 6.0; this.wcHouse[4][2] = 0.0;
        this.wcHouse[5][0] = 28.0; this.wcHouse[5][1] = 4.0; this.wcHouse[5][2] = 8.0;
        this.wcHouse[6][0] = 28.0; this.wcHouse[6][1] = 0.0; this.wcHouse[6][2] = 8.0;
        for (i = 7; i<14; i++)
        {
            this.wcHouse[i][0] = this.wcHouse[i - 7][0] + 20;
            this.wcHouse[i][1] = this.wcHouse[i - 7][1];
            this.wcHouse[i][2] = this.wcHouse[i - 7][2];
            this.wcHouse[i][3] = 1.0;
        }
        this.wcHouse[12][0] = this.wcHouse[5][0] + 4;
        this.wcHouse[13][0] = this.wcHouse[6][0] + 4;
         //调整房屋大小
        let nScale = 5; //缩放比例
        for (i = 0; i<14; i++)
        {
            this.wcHouse[i][0] = nScale * this.wcHouse[i][0];
            this.wcHouse[i][1] = nScale * this.wcHouse[i][1];
            this.wcHouse[i][2] = nScale * this.wcHouse[i][2];
        }

        for(j = 0; j < 4; j++){
            this.lwcWC.push([]);
        }

        //初始化世界坐标系
        for (i = 0; i<4; i++)
            for (j = 0; j<3; j++)
                this.lwcWC[i][j] = 0.0;
        this.lwcWC[0][0] = 300;
        this.lwcWC[1][1] = 100;
        this.lwcWC[2][2] = 100;
        //初始化视图参考坐标系
        for (i = 0; i<4; i++)
            for (j = 0; j<3; j++)
                this.lwcVRC[i][j] = 0.0;
        this.lwcVRC[0][0] = 30;
        this.lwcVRC[1][1] = 30;
        this.lwcVRC[2][2] = 30;
        this.lPRP[0] = 3000.0;
        this.lPRP[1] = 1000.0;
        this.lPRP[2] = 6000.0;
        //初始化投影参数
        this.VRP[0] = 0;
        this.VRP[1] = 0;
        this.VRP[2] = 0;
        this.Theta = 0;
        this.Phi = 0;
        this.Delta = 0;
        this.PRP[0] = 250.0;
        this.PRP[1] = 100.0;
        this.PRP[2] = 250.0;
        this.CW[0] = 0.0;
        this.CW[1] = 0.0;
    }


    setProjectionType(n){
        this.nProjectionType = n;

    }
    setVRP(vrp0, vrp1, vrp2){
        this.VRP[0] = vrp0;
        this.VRP[1] = vrp1;
        this.VRP[2] = vrp2;
    }
    setAngle( th,  ph,  dt){
        this.Theta = th;
        this.Phi = ph;
        this.Delta = dt;
    }
    setPRP( prp0,  prp1,  prp2){
        this.PRP[0] = prp0;
        this.PRP[1] = prp1;
        this.PRP[2] = prp2;
    }
    setCW( cw0,  cw1){
        this.CW[0] = cw0;
        this.CW[1] = cw1;
    }

    ShowLayout(pt){
        let i, j;
        //计算投影参考点的世界坐标
        for (i = 0; i<2; i++)
            for (j = 0; j<3; j++)
            {
                lwcPRP[i][j] = VRP[j] + PRP[j];
                lwcPRP[i][j] = VRP[j] + PRP[j];
            }
        lwcPRP[1][1] = 0.0;
    }// 显示布局图，供CLayoutView调用

    
    ShowProjection(pt){
        //三维变换
        this.GenerateMatricTransform(-VRP[0], -VRP[1], -VRP[2], -Theta, -Phi, -Delta, MT);
        this.Transform(wcHouse, vcHouse, 14, MT);
        //投影变换
        this.GenerateMatricProject(PRP, MP, nProjectionType);
        this.Project(vcHouse, scHouse, 14, MP);
        //屏幕变换
        this.ToScreen(scHouse, 14);
        //显示图形
        this.DrawHouse(pt);
    }// 显示投影图，供CProjectionView调用

    Transform( MS,  MO,  nRow,  MT){
        let i, j;
        for (i = 0; i<nRow; i++)
            for (j = 0; j<3; j++)
                MO[i][j] = MT[j][0] * MS[i][0] + MT[j][1] * MS[i][1] +MT[j][2] * MS[i][2] + MT[j][3] * 1.0;
    }//三维变换

    Project( MS,  MO,  nRow,  MT){
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
    }// 投影变换
    
    ToScreen( MS,  nRow){
        let i;
        for (i = 0; i<nRow; i++)
            MS[i][1] = -MS[i][1];
    }// 屏幕变换

    MatricMultiply( M1,  M2,  M3){
        for (let i = 0; i<4; i++)
            for (let j = 0; j<4; j++)
                M3[i][j] = M1[i][0] * M2[0][j] + M1[i][1] * M2[1][j] + M1[i][2] * M2[2][j] + M1[i][3] * M2[3][j];
    }// 矩阵乘法

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
        Rz[0][0] = cos(_theta);
        Rz[0][1] = -sin(_theta);
        Rz[1][0] = sin(_theta);
        Rz[1][1] = cos(_theta);
        Rz[2][2] = 1.0;
        Rz[3][3] = 1.0;
        //绕y轴旋转
        Ry[0][0] = cos(_phi);
        Ry[0][2] = sin(_phi);
        Ry[1][1] = 1.0;
        Ry[2][0] = -sin(_phi);
        Ry[2][2] = cos(_phi);
        Ry[3][3] = 1.0;
        //绕x轴旋转
        Rx[0][0] = 1.0;
        Rx[1][1] = cos(_delta);
        Rx[1][2] = -sin(_delta);
        Rx[2][1] = sin(_delta);
        Rx[2][2] = cos(_delta);
        Rx[3][3] = 1.0;
        //生成三维变换矩阵
        //MT = Rx * Ry * Rz * T
        this.MatricMultiply(T, Rz, MT);
        this.MatricMultiply(MT, Ry, temp);
        this.MatricMultiply(temp, Rx, MT)
    }// 构造三维变换矩阵

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
    }// 投影矩阵

    DrawHouse(pt){
        let i;
        //画左侧墙壁
        for (i = 0; i<5; i++)
            uiSetting.drawLineInGrid()
            pt->drawLine(QPoint(scHouse[i][0], scHouse[i][1]), QPoint(scHouse[(i + 1) % 5][0], scHouse[(i + 1) % 5][1]));
        //画右侧墙壁
        for (i = 7; i<11; i++)
            pt->drawLine(QPoint(scHouse[i][0], scHouse[i][1]), QPoint(scHouse[i + 1][0], scHouse[i + 1][1]));
        pt->drawLine(QPoint(scHouse[i][0], scHouse[i][1]), QPoint(scHouse[7][0], scHouse[7][1]));
        //画横梁
        for (i = 0; i<6; i++)
            pt->drawLine(QPoint(scHouse[i][0], scHouse[i][1]), QPoint(scHouse[i + 7][0], scHouse[i + 7][1]));
        //画门
        pt->drawLine(QPoint(scHouse[5][0], scHouse[5][1]), QPoint(scHouse[6][0], scHouse[6][1]));
        pt->drawLine(QPoint(scHouse[12][0], scHouse[12][1]), QPoint(scHouse[13][0], scHouse[13][1]));
    }// 绘制房子
}