"use strict";(self["webpackChunkrock_sugar"]=self["webpackChunkrock_sugar"]||[]).push([[954],{4483:function(t,e){class s{constructor(t){this.points=t,this.points.forEach(((t,e)=>{this[e]=t}))}maxPointX(){let t=0;return this.points.forEach((e=>{t=t>e.x?t:e.x})),t}minPointX(){let t=this.maxPointX();return this.points.forEach((e=>{t=t<e.x?t:e.x})),t}maxPointY(){let t=0;return this.points.forEach((e=>{t=t>e.y?t:e.y})),t}minPointY(){let t=this.maxPointX();return this.points.forEach((e=>{t=t<e.y?t:e.y})),t}size(){return this.points.length}indexValue(t){return this.points[t]}isInPolygon(t){let e,s,n=!1;for(e=0,s=this.size()-1;e<this.size();s=e++)this.points[e].y>t.y!=this.points[s].y>t.y&&t.x<(this.points[s].x-this.points[e].x)*(t.y-this.points[e].y)/(this.points[s].y-this.points[e].y)+this.points[e].x&&(n=!n);return n}}e["Z"]=s},954:function(t,e,s){s.r(e),s.d(e,{default:function(){return d}});var n=s(3396);function i(t,e,s,i,o,r){const a=(0,n.up)("nano_cg_experiment_page");return(0,n.wg)(),(0,n.j4)(a,{prop_des_data:o.desData,prop_ui_setter:r.uiSetter,prop_section_params:o.sectionParams,ref:"page"},null,8,["prop_des_data","prop_ui_setter","prop_section_params"])}s(7658);var o=s(2812),r=s(2042),a=s(4483);class l{constructor(t,e){this.p1=new r.Z(t.x,t.y),this.p2=new r.Z(e.x,e.y)}P1(){return this.p1}P2(){return this.p2}}class h{constructor(t){this.point=new r.Z(t.x,t.y)}setPoint(t){this.point=new r.Z(t.x,t.y)}setJudge(t){this.jud=t}getPoint(){return this.point}getJudge(){return this.jud}copy(){let t=new h(this.point);return t.jud=this.jud,t}}const p={category:"Experiment",name:"WeilerAthenton",buttonContent:"查看源码",title:"WeilerAthenton算法",content:"WeilerAthenton."};var c={name:"WeilerAthenton",data(){return{canvas:null,ctx:null,desData:p,sectionParams:{pn:4,vn:5,pp:[new r.Z(100,100),new r.Z(300,200),new r.Z(100,300),new r.Z(200,200)],vp:[new r.Z(100,150),new r.Z(250,150),new r.Z(250,250),new r.Z(100,250),new r.Z(220,200)],pLine:[],vLine:[],ppoint:[],vpoint:[],innerColor:"#0bc6e3",outerColor:"#ffffff",clipColor:"#000000",debugContent:null,girdSize:2,screenTransform:{x:-20,y:-80,scale:100}}}},computed:{uiSetter(){let t=this.sectionParams,e=[{type:"slider",id:"girdSize",value:t.girdSize,min:1,max:100,callback:o.Z.globalUiCallbacks.updateValue(this,"girdSize")},{type:"color",id:"innerColor",default:t.innerColor,callback:o.Z.globalUiCallbacks.updateValue(this,"innerColor")},{type:"color",id:"outerColor",default:t.outerColor,callback:o.Z.globalUiCallbacks.updateValue(this,"outerColor")},{type:"color",id:"clipColor",default:t.clipColor,callback:o.Z.globalUiCallbacks.updateValue(this,"clipColor")}];for(let s=0;s<2;s++)e.push({type:"slider-vector",id:"pp"+s,value:t.pp[s],min:{x:-300,y:-300},max:{x:300,y:300},callback:o.Z.globalUiCallbacks.updatePointArray(this,"pp",s)});for(let s=0;s<2;s++)e.push({type:"slider-vector",id:"vp"+s,value:t.vp[s],min:{x:-300,y:-300},max:{x:300,y:300},callback:o.Z.globalUiCallbacks.updatePointArray(this,"vp",s)});return e}},methods:{Init(){this.$refs.page.Init(),this.canvas=this.$refs.page.getCanvas(),this.ctx=canvas.getContext("2d"),this.$refs.page.setViewer(this.sectionParams.screenTransform,this.Render),this.Render()},Render(){this.$refs.page.Render();const t=this.ctx,e=parseInt(this.canvas.width/this.sectionParams.girdSize)-1,s=parseInt(this.canvas.height/this.sectionParams.girdSize)-1;t.clearRect(0,0,this.canvas.width,this.canvas.height),this.sectionParams.girdSize+=this.$refs.page.girdSize,o.Z.drawGrid(this),this.sectionParams.girdSize<=0&&(this.sectionParams.girdSize=1),this.sectionParams.debugContent=[{title:"grid",content:"The number of cells in the x direction: "+e+"\nThe number of cells in the y direction: "+s}];const n=this.sectionParams.pp,i=this.sectionParams.vp,h=this.sectionParams.pn,p=this.sectionParams.vn;let c=[],u=[];for(let o=0;o<h;++o)c.push(n[o]);if(c.length<3)return;for(let o=0;o<p;++o)u.push(i[o]);if(u.length<3)return;let g=new a.Z(c),d=new a.Z(u);o.Z.drawPolygonInGrid(this,g,this.sectionParams.outerColor),o.Z.drawPolygonInGrid(this,d,this.sectionParams.clipColor);let P=this.sectionParams.pLine,f=this.sectionParams.vLine;P.length=0,f.length=0;let y=new r.Z(0,0),x=new r.Z(0,0);for(let o=0;o<h-1;++o)y.setX(n[o].x),y.setY(n[o].y),x.setX(n[o+1].x),x.setY(n[o+1].y),P.push(new l(y,x)),y.setX(x.x),y.setY(x.y);x.setX(n[0].x),x.setY(n[0].y),P.push(new l(y,x));for(let o=0;o<p-1;++o)y.setX(i[o].x),y.setY(i[o].y),x.setX(i[o+1].x),x.setY(i[o+1].y),f.push(new l(y,x)),y.setX(x.x),y.setY(x.y);x.setX(i[0].x),x.setY(i[0].y),f.push(new l(y,x)),this.SetPLane();let m=[],w=[];this.BoolIntersection(m,w);let Z=0,b=0,v=[];for(b=0;b<w.length;b++){v=[];for(let t=0;t<w[b];t++)v.push(m[Z]),Z++}o.Z.drawPolygonInGrid(this,new a.Z(v),this.sectionParams.innerColor)},SetPLane(){let t=this.sectionParams.ppoint,e=this.sectionParams.vpoint,s=this.sectionParams.pLine,n=this.sectionParams.vLine;t.length=0,e.length=0;let i=0,o=0,a=[];new r.Z(0,0);for(i=0;i<s.length;i++){for(o=0;o<n.length;o++){const{tag:t,insert:e,tt:r}=this.IsInsect(s[i].P1(),s[i].P2(),n[o].P1(),n[o].P2());t&&a.push(r)}a.sort();let e=new h(new r.Z(0,0)),l=0,p=0;for(let n=0;n<a.length;n++)if((0==n||a[n]!=a[n-1])&&(p++,a[n]<=1&&l++,a[n]>0&&a[n]<=1)){const o=s[i].P1().add(s[i].P2().sub(s[i].P1()).mut(a[n]));e.setPoint(new r.Z(Math.floor(o.x),Math.floor(o.y))),p%2==0?e.setJudge(2):e.setJudge(1),t.push(e.copy())}e.setPoint(s[i].P2()),l%2==0?e.setJudge(0):e.setJudge(1),t.push(e.copy()),a=[]}for(o=0;o<n.length;o++){for(i=0;i<s.length;i++){const{tag:t,insert:e,tt:r}=this.IsInsect(n[o].P1(),n[o].P2(),s[i].P1(),s[i].P2());t&&a.push(r)}a.sort();let t=new h(new r.Z(0,0)),l=0,p=0;for(let s=0;s<a.length;s++)if(p++,a[s]<=1&&l++,a[s]>0&&a[s]<=1){const i=n[o].P1().add(n[o].P2().sub(n[o].P1()).mut(a[s]));t.setPoint(new r.Z(Math.floor(i.x),Math.floor(i.y))),p%2==0?t.setJudge(2):t.setJudge(1),e.push(t.copy())}t.setPoint(n[o].P2()),l%2==0?t.setJudge(0):t.setJudge(1),e.push(t.copy()),a=[]}},BoolIntersection(t,e){let s,n,i,o=this.sectionParams.ppoint,a=this.sectionParams.vpoint,l=!0,h=0,p=0,c=0,u=0;s=o;while(1){if(1==s[p].getJudge()){let h=0;t.push(new r.Z(s[p].getPoint().x,s[p].getPoint().y)),h++;let g=s[p].getPoint().x,d=s[p].getPoint().y;n=s,c=p,p++,i=s,u=p,l=!l;while(g!=i[u].getPoint().x||d!=i[u].getPoint().y){if(1==i[u].getJudge())t.push(new r.Z(i[u].getPoint().x,i[u].getPoint().y)),i[u].setJudge(3),h++,n=i,c=u,u++;else if(2==i[u].getJudge()){t.push(new r.Z(i[u].getPoint().x,i[u].getPoint().y)),i[u].setJudge(3),h++,n=i,c=u,l?(i=o,u=0,l=!1):(i=a,u=0,l=!0);while(i[u].getPoint().x!=n[c].getPoint().x||i[u].getPoint().y!=n[c].getPoint().y)u++;if(i[u].setJudge(3),u++,0==i[u].getJudge())break}l?u==a.length&&i==a&&(i=a,u=0):u==o.length&&i==o&&(i=o,u=0)}e.push(h),h=0}if(p++,0==h)p==o.length&&s==o&&(s=a,p=0,l=!0,h=1);else if(p==a.length&&s==a)break}},IsInsect(t,e,s,n){let i,o=0;const a=(t,e)=>t.x*e.x+t.y*e.y;let l=e.sub(t),h=n.sub(s),p=s.sub(t),c=new r.Z(h.y,-h.x);if(0==a(l,c))return{tag:!1};{o=a(p,c)/a(l,c);let e=new r.Z(l.y,-l.x),s=a(p,e)/a(l,c);return s<0||s>1?{tag:!1}:(i=t.add(new r.Z(l.x*o,l.y*o)),{tag:!0,insect:i,tt:o})}},SetUI(){this.$refs.page.SetUI()}},mounted(){this.Init(),this.SetUI()}},u=s(89);const g=(0,u.Z)(c,[["render",i]]);var d=g}}]);
//# sourceMappingURL=954.8f911072.js.map