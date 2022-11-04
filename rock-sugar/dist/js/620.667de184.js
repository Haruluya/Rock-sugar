"use strict";(self["webpackChunkrock_sugar"]=self["webpackChunkrock_sugar"]||[]).push([[620],{620:function(e,a,t){t.r(a),t.d(a,{default:function(){return w}});var i=t(3396);const r={class:"pageContainer"},l={class:"webglContainer"},o={id:"uiContainer"},n={id:"ui"};function s(e,a,t,s,u,_){const c=(0,i.up)("nano_canvas"),h=(0,i.up)("ui"),g=(0,i.up)("nano_webgl_des_panel");return(0,i.wg)(),(0,i.iD)("div",r,[(0,i._)("div",l,[(0,i.Wm)(c,{prop_vertex_shader_source:u.vertexShaderSource,prop_fragment_shader_source:u.fragmentShaderSource},null,8,["prop_vertex_shader_source","prop_fragment_shader_source"]),(0,i._)("div",o,[(0,i._)("div",n,[(0,i.Wm)(h,{id:"x"}),(0,i.Wm)(h,{id:"y"}),(0,i.Wm)(h,{id:"z"}),(0,i.Wm)(h,{id:"angleX"}),(0,i.Wm)(h,{id:"angleY"}),(0,i.Wm)(h,{id:"angleZ"}),(0,i.Wm)(h,{id:"scaleX"}),(0,i.Wm)(h,{id:"scaleY"}),(0,i.Wm)(h,{id:"scaleZ"}),(0,i.Wm)(h,{id:"shininess"}),(0,i.Wm)(h,{id:"lightColor"})])])]),(0,i.Wm)(g,{prop_category:u.desData.category,prop_name:u.desData.name,prop_button_content:u.desData.buttonContent,prop_title:u.desData.title,prop_content:u.desData.content,onHandleClick:_.handleClick},null,8,["prop_category","prop_name","prop_button_content","prop_title","prop_content","onHandleClick"])])}var u="\nattribute vec4 a_position;\nattribute vec3 a_normal;\nattribute vec4 a_color;\n//点光源位置。\nuniform vec3 u_lightWorldPosition;\n//\nuniform vec3 u_viewWorldPosition;\n//变换矩阵.\nuniform mat4 u_world;\nuniform mat4 u_worldViewProjection;\nuniform mat4 u_worldInverseTranspose;\nvarying vec3 v_normal;\nvarying vec3 v_surfaceToLight;\nvarying vec3 v_surfaceToView;\nvarying vec4 v_color;\nvoid main() {\n    gl_Position = u_worldViewProjection * a_position;\n    v_normal = mat3(u_worldInverseTranspose) * a_normal;\n    vec3 surfaceWorldPosition = (u_world * a_position).xyz;\n    v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;\n    v_surfaceToView = normalize(u_viewWorldPosition - surfaceWorldPosition);\n    v_color = a_color;\n}\n",_="\nprecision mediump float;\nvarying vec3 v_normal;\nvarying vec3 v_surfaceToLight;\nvarying vec3 v_surfaceToView;\nvarying vec4 v_color;\nuniform float u_shininess;\nuniform vec3 u_lightColor;\nuniform vec3 u_specularColor;\n\nvoid main() {\n    vec3 normal = normalize(v_normal);\n    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);\n    vec3 surfaceToViewDirection = normalize(v_surfaceToView);\n    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);\n    float light = dot(normal, surfaceToLightDirection);\n    float specular = 0.0;\n    \n    if (light > 0.0) {\n    specular = pow(dot(normal, halfVector), u_shininess);\n    }\n    \n    gl_FragColor = v_color;\n    gl_FragColor.rgb *= light * u_lightColor;\n    gl_FragColor.rgb += specular * u_specularColor;\n}\n",c=(t(8675),t(3408),t(4590),{position:new Float32Array([200,50,0,0,50,0,0,150,0,0,150,0,200,150,0,200,50,0,200,50,100,0,50,100,0,50,0,0,50,0,200,50,0,200,50,100,200,50,0,200,150,0,200,150,100,200,150,100,200,50,100,200,50,0,0,50,0,0,50,100,0,150,100,0,150,100,0,150,0,0,50,0,0,150,0,0,150,100,200,150,100,200,150,100,200,150,0,0,150,0,200,50,100,200,150,100,0,150,100,0,150,100,0,50,100,200,50,100]),color:new Uint8Array([0,59,252,0,80,252,0,218,252,0,218,252,0,80,252,0,59,252,252,0,0,150,0,0,0,0,0,0,0,0,150,0,0,252,0,0,252,227,103,150,227,103,0,227,103,0,227,103,150,227,103,252,227,103,252,227,103,150,227,103,0,227,103,0,227,103,150,227,103,252,227,103,252,0,0,150,0,0,0,0,0,0,0,0,150,0,0,252,0,0,0,59,252,0,80,252,0,218,252,0,218,252,0,80,252,0,59,252]),normal:new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1])});const h={category:"Webgl",name:"LightingPoint",buttonContent:"查看源码",title:"点光源",content:"Point light source illuminates the world and causes shadows."},g=c.position,d=c.color,m=c.normal;var v={name:"LightingPoint",data(){return{gl:null,canvas:null,program:null,vertexShaderSource:u,fragmentShaderSource:_,desData:h,bufferData:{position:{data:[]},color:{data:d},normal:{data:m}},uniformsData:{u_lightWorldPosition:null,u_viewWorldPosition:null,u_world:null,u_worldViewProjection:null,u_worldInverseTranspose:null,u_shininess:null,u_lightColor:null,u_specularColor:null},bufferInfo:null,uniformSetters:null,attribSetters:null,transfrom:{translation:[0,0,0],rotation:[haruluya_webgl_utils.degToRad(180),haruluya_webgl_utils.degToRad(185),haruluya_webgl_utils.degToRad(360)],scale:[1,.8,1]},perspective:{aspect:0,fieldOfViewRadians:haruluya_webgl_utils.degToRad(60),zNear:1,zFar:2e3},camera:{target:[0,35,0],position:[100,150,200],up:[0,1,0]},sectionParams:{lightColor:[1,1,1],shininess:150,lightPosition:[0,0,120]}}},mounted(){this.Init(),this.SetUI()},methods:{Init(){const{gl:e,canvas:a}=haruluya_webgl_utils.initWebglContext("canvas");this.gl=e,this.canvas=a,this.program=haruluya_webgl_utils.createProgramFromScripts(e,["vertex-shader","fragment-shader"]),this.perspective.aspect=e.canvas.clientWidth/e.canvas.clientHeight,this.setPosition(),this.bufferInfo=haruluya_webgl_utils.createBufferInfoFromArrays(e,this.bufferData),this.uniformSetters=haruluya_webgl_utils.createUniformSetters(e,this.program),this.attribSetters=haruluya_webgl_utils.createAttributeSetters(e,this.program),this.Render()},Render(){const e=this.gl,a=this.program;haruluya_webgl_utils.resizeCanvasToDisplaySize(e.canvas),e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.enable(e.CULL_FACE),e.enable(e.DEPTH_TEST),e.useProgram(a),haruluya_webgl_utils.setBuffersAndAttributes(e,this.attribSetters,this.bufferInfo);let t=haruluya_webgl_utils.perspective(this.perspective.fieldOfViewRadians,this.perspective.aspect,this.perspective.zNear,this.perspective.zFar),i=haruluya_webgl_utils.lookAt(this.camera.position,this.camera.target,this.camera.up),r=haruluya_webgl_utils.inverse(i);var l=haruluya_webgl_utils.multiply3d(t,r);let o=haruluya_webgl_utils.getTransformMatrix(haruluya_webgl_utils.xRotation(0),this.transfrom);var n=haruluya_webgl_utils.multiply3d(l,o),s=haruluya_webgl_utils.inverse(o),u=haruluya_webgl_utils.transpose(s);this.uniformsData.u_worldViewProjection=n,this.uniformsData.u_worldInverseTranspose=u,this.uniformsData.u_world=o,this.uniformsData.u_lightWorldPosition=this.sectionParams.lightPosition,this.uniformsData.u_viewWorldPosition=this.camera.position,this.uniformsData.u_shininess=this.sectionParams.shininess,this.uniformsData.u_lightColor=haruluya_webgl_utils.normalize(this.sectionParams.lightColor),this.uniformsData.u_specularColor=haruluya_webgl_utils.normalize(this.sectionParams.lightColor),e.uniform3fv(e.getUniformLocation(a,"u_lightColor"),haruluya_webgl_utils.normalize(lightColor)),haruluya_webgl_utils.setUniforms(this.uniformSetters,this.uniformsData),e.drawArrays(e.TRIANGLES,0,36)},SetUI(){const e=this.gl;let a=this.Render,t=this.transfrom,i=this.sectionParams;const r=function(e){return function(i,r){t.translation[e]=r.value,a()}},l=function(e){return function(i,r){const l=r.value,o=l*Math.PI/180;t.rotation[e]=o,a()}},o=function(e){return function(i,r){t.scale[e]=r.value,a()}},n=function(e,t){i.shininess=t.value,a()},s=function(e){i.lightColor=haruluya_webgl_utils.colorToRGB(e.target.value),a()};haruluya_webgl_utils.setupSlider("shininess",{value:i.shininess,slide:n,min:1,max:300}),haruluya_webgl_utils.setupSlider("x",{value:t.translation[0],slide:r(0),max:e.canvas.width}),haruluya_webgl_utils.setupSlider("y",{value:t.translation[1],slide:r(1),max:e.canvas.height}),haruluya_webgl_utils.setupSlider("z",{value:t.translation[2],slide:r(2),max:e.canvas.height}),haruluya_webgl_utils.setupSlider("angleX",{value:haruluya_webgl_utils.radToDeg(t.rotation[0]),slide:l(0),max:360}),haruluya_webgl_utils.setupSlider("angleY",{value:haruluya_webgl_utils.radToDeg(t.rotation[1]),slide:l(1),max:360}),haruluya_webgl_utils.setupSlider("angleZ",{value:haruluya_webgl_utils.radToDeg(t.rotation[2]),slide:l(2),max:360}),haruluya_webgl_utils.setupSlider("scaleX",{value:t.scale[0],slide:o(0),min:-5,max:5,step:.01,precision:2}),haruluya_webgl_utils.setupSlider("scaleY",{value:t.scale[1],slide:o(1),min:-5,max:5,step:.01,precision:2}),haruluya_webgl_utils.setupSlider("scaleZ",{value:t.scale[2],slide:o(2),min:-5,max:5,step:.01,precision:2}),haruluya_webgl_utils.setupColorInput("lightColor",s)},Destory(){},handleClick(){window.location.href="https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/LightPoint/index.vue"},setPosition(){var e=haruluya_webgl_utils.xRotation(Math.PI);e=haruluya_webgl_utils.translate3d(e,-50,-75,-15);for(var a=0;a<g.length;a+=3){var t=haruluya_webgl_utils.transformPoint(e,[g[a+0],g[a+1],g[a+2],1]);g[a+0]=t[0],g[a+1]=t[1],g[a+2]=t[2]}this.bufferData.position.data=g}},beforeDestory(){this.Destory()}},p=t(89);const f=(0,p.Z)(v,[["render",s],["__scopeId","data-v-09f60b53"]]);var w=f}}]);
//# sourceMappingURL=620.667de184.js.map