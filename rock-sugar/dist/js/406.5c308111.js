"use strict";(self["webpackChunkrock_sugar"]=self["webpackChunkrock_sugar"]||[]).push([[406],{3406:function(t,e,n){n.r(e),n.d(e,{default:function(){return d}});var a=n(3396);function i(t,e,n,i,o,s){const r=(0,a.up)("nano_cg_experiment_page");return(0,a.wg)(),(0,a.j4)(r,{prop_des_data:o.desData,prop_ui_setter:s.uiSetter,prop_section_params:o.sectionParams,ref:"page"},null,8,["prop_des_data","prop_ui_setter","prop_section_params"])}var o=n(2812);const s={category:"Experiment",name:"DrawLine",buttonContent:"查看源码",title:"绘制直线",content:"Begin cg by draw a line."};var r={name:"DrawLine",data(){return{canvas:null,ctx:null,desData:s,sectionParams:{beginPoint:{x:130,y:130},endPoint:{x:300,y:300},color:"#0bc6e3",debugContent:null}}},computed:{uiSetter(){let t=this.sectionParams;return[{type:"slider-vector",id:"beginPoint",value:t.beginPoint,min:{x:0,y:0},max:{x:500,y:500},callback:o.Z.globalUiCallbacks.updatePoint(this,"beginPoint")},{type:"slider-vector",id:"endPoint",value:t.endPoint,min:{x:0,y:0},max:{x:500,y:500},callback:o.Z.globalUiCallbacks.updatePoint(this,"endPoint")},{type:"color",id:"color",default:t.color,callback:o.Z.globalUiCallbacks.updateValue(this,"color")}]}},methods:{Init(){this.$refs.page.Init(),this.canvas=this.$refs.page.getCanvas(),this.ctx=canvas.getContext("2d"),this.Render()},Render(){this.$refs.page.Render(),this.sectionParams.debugContent=[{title:"Debug",content:"Nothing to debug."}];const t=this.ctx,e=this.sectionParams;t.clearRect(0,0,this.canvas.width,this.canvas.height),t.beginPath(),t.moveTo(e.beginPoint.x,e.beginPoint.y),t.lineTo(e.endPoint.x,e.endPoint.y),t.strokeStyle=e.color,t.stroke(),t.closePath()},SetUI(){this.$refs.page.SetUI()}},mounted(){this.Init(),this.SetUI()}},c=n(89);const l=(0,c.Z)(r,[["render",i]]);var d=l}}]);
//# sourceMappingURL=406.5c308111.js.map