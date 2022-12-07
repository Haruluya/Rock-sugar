"use strict";(self["webpackChunkrock_sugar"]=self["webpackChunkrock_sugar"]||[]).push([[975],{8975:function(e,t,a){a.r(t),a.d(t,{default:function(){return g}});var n=a(3396);function r(e,t,a,r,i,o){const s=(0,n.up)("webgl_basic_render_panel");return(0,n.wg)(),(0,n.j4)(s,{prop_des_data:i.desData,prop_ui_setter:o.uiSetter,prop_vertex_shader:i.vertexShaderSource,prop_fragment_shader:i.fragmentShaderSource,prop_section_params:i.sectionParams,ref:"page",onInit:o.Init,onRender:o.Render},null,8,["prop_des_data","prop_ui_setter","prop_vertex_shader","prop_fragment_shader","prop_section_params","onInit","onRender"])}a(8675),a(3408),a(4590);var i="\nattribute vec4 a_position;\nattribute vec3 a_normal;\nattribute vec3 a_tangent;\nattribute vec2 a_texcoord;\nattribute vec4 a_color;\n\nuniform mat4 u_projection;\nuniform mat4 u_view;\nuniform mat4 u_world;\nuniform vec3 u_viewWorldPosition;\n\nvarying vec3 v_normal;\nvarying vec3 v_tangent;\nvarying vec3 v_surfaceToView;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\n\nvoid main() {\n  vec4 worldPosition = u_world * a_position;\n  gl_Position = u_projection * u_view * worldPosition;\n  v_surfaceToView = u_viewWorldPosition - worldPosition.xyz;\n  mat3 normalMat = mat3(u_world);\n  v_normal = normalize(normalMat * a_normal);\n  v_tangent = normalize(normalMat * a_tangent);\n\n  v_texcoord = a_texcoord;\n  v_color = a_color;\n}\n",o="\nprecision highp float;\n\nvarying vec3 v_normal;\nvarying vec3 v_tangent;\nvarying vec3 v_surfaceToView;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\n\nuniform vec3 diffuse;\nuniform sampler2D diffuseMap;\nuniform vec3 ambient;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform sampler2D specularMap;\nuniform float shininess;\nuniform sampler2D normalMap;\nuniform float opacity;\nuniform vec3 u_lightDirection;\nuniform vec3 u_ambientLight;\n\nvoid main () {\n  vec3 normal = normalize(v_normal) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n  vec3 tangent = normalize(v_tangent) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n  vec3 bitangent = normalize(cross(normal, tangent));\n\n  mat3 tbn = mat3(tangent, bitangent, normal);\n  normal = texture2D(normalMap, v_texcoord).rgb * 2. - 1.;\n  normal = normalize(tbn * normal);\n\n  vec3 surfaceToViewDirection = normalize(v_surfaceToView);\n  vec3 halfVector = normalize(u_lightDirection + surfaceToViewDirection);\n\n  float fakeLight = dot(u_lightDirection, normal) * .5 + .5;\n  float specularLight = clamp(dot(normal, halfVector), 0.0, 1.0);\n  vec4 specularMapColor = texture2D(specularMap, v_texcoord);\n  vec3 effectiveSpecular = specular * specularMapColor.rgb;\n\n  vec4 diffuseMapColor = texture2D(diffuseMap, v_texcoord);\n  vec3 effectiveDiffuse = diffuse * diffuseMapColor.rgb * v_color.rgb;\n  float effectiveOpacity = opacity * diffuseMapColor.a * v_color.a;\n\n  gl_FragColor = vec4(\n      emissive +\n      ambient * u_ambientLight +\n      effectiveDiffuse * fakeLight +\n      effectiveSpecular * pow(specularLight, shininess),\n      1);\n}\n\n",s=a(311),c=a(2812);const l={category:"Pyramid",name:"ClipPolygon",buttonContent:"查看源码",title:"金字塔",content:"Pyramid."};var u={name:"Pyramid",data(){return{gl:null,canvas:null,program:null,vertexShaderSource:i,fragmentShaderSource:o,desData:l,perspective:{aspect:0,fieldOfViewRadians:HNWUEngine.degToRad(60),zNear:1,zFar:1e4},transform:{translation:[0,0,15],rotation:[HNWUEngine.degToRad(0),HNWUEngine.degToRad(270),HNWUEngine.degToRad(0)],scale:[.7,.7,.7]},camera:{target:[0,0,0],position:[0,0,1],up:[0,1,0]},sectionParams:{lightDirection:{x:-1,y:3,z:5},texture:null},page:null,uiSetter:[],objectData:null,objComponentsInfo:null,objOffset:null}},computed:{defaultMaterial(){return{diffuse:[1,1,1],diffuseMap:s.Z.create1PixelTexture(this.gl,[255,255,255,0]),normalMap:s.Z.create1PixelTexture(this.gl,[255,255,255,0]),ambient:[0,0,0],specular:[0,0,0],specularMap:s.Z.create1PixelTexture(this.gl,[255,255,255,255]),shininess:400,opacity:1}},uiSetter(){let e=this.sectionParams,t=[{type:"slider-vector",id:"lightDirection",value:e.lightDirection,min:{x:0,y:0,z:0},max:{x:100,y:100,z:100},callback:c.Z.globalUiCallbacks.updatePoint(this,"lightDirection")}];return t}},mounted(){this.getObjectData()},methods:{Init(){if(this.page=this.$refs.page,this.gl=this.page.getGL(),!this.objectData)return;this.page.addProgram("obj",i,o),this.perspective.aspect=this.gl.canvas.clientWidth/this.gl.canvas.clientHeight,this.$refs.page.set3DViewer(this.perspective,this.camera,this.transform);const e=this.objectData.obj;this.objOffset=this.page.setObjectToSceenCenter(e.geometries),this.objComponentsInfo=e.geometries.map((({material:e,data:t,object:a})=>{const n=a+e;return this.page.addComponent("obj",n),t.texcoord&&t.normal?(t.tangent=s.Z.generateTangents(t.position,t.texcoord),this.page.addBuffer("tangent",t.tangent,n)):this.page.addBuffer("tangent",{value:[1,0,0]},n),t.texcoord||(t.texcoord={value:[0,0]}),t.normal||(t.normal={value:[0,0,1]}),t.color?t.position.length===t.color.length&&(t.color={numComponents:3,data:t.color},this.page.addBuffer("color",t.color,n)):this.page.addBuffer("color",{value:[1,1,1,1]},n),this.page.addBuffer("position",{data:t.position},n),this.page.addBuffer("texcoord",{numComponents:2,data:t.texcoord},n),this.page.addBuffer("normal",{data:t.normal},n),{name:n,component:this.page.getComponents()[n],material:{...this.defaultMaterial,...this.objectData.materials[e]}}}));{const e=this.gl;this.sectionParams.texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.sectionParams.texture);const t=0,a=e.LUMINANCE,n=3,r=2,i=0,o=e.LUMINANCE,s=e.UNSIGNED_BYTE,c=new Uint8Array([126,153,126,0,0,0]),l=1;e.pixelStorei(e.UNPACK_ALIGNMENT,l),e.texImage2D(e.TEXTURE_2D,t,a,n,r,i,o,s,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}},Render(){if(!this.objectData)return;const e=this.gl;e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.enable(e.MULTISAMPLE);let t=HNWUEngine.perspective(this.perspective.fieldOfViewRadians,this.perspective.aspect,this.perspective.zNear,this.perspective.zFar),a=HNWUEngine.lookAt(this.camera.position,this.camera.target,this.camera.up),n=HNWUEngine.inverse(a),r=HNWUEngine.getTransformMatrix(HNWUEngine.yRotation(0),this.transform);r=HNWUEngine.translate3d(r,...this.objOffset),this.objComponentsInfo.forEach((({name:e,component:a,material:i})=>{this.page.useProgram(a.program),"defaultphong1SG"!=e&&(i.diffuseMap=this.sectionParams.texture);const o=[this.sectionParams.lightDirection.x,this.sectionParams.lightDirection.y,this.sectionParams.lightDirection.z],s={u_world:r,u_view:n,u_lightDirection:HNWUEngine.normalize(o),u_projection:t,u_viewWorldPosition:this.camera.position},c=Object.assign(s,i);Object.entries(c).forEach((([t,a])=>{this.page.addUniform(t,a,e)})),this.page.setSetters(e),this.page.drawComponent(e)}))},async getObjectData(){let e="./models/pyramid/pyramid.obj";const t=await fetch(e),a=await t.text(),n=s.Z.objectParse(a),r=new URL(e,window.location.href),i=await Promise.all(n.materialLibs.map((async e=>{const t=new URL(e,r).href,a=await fetch(t);return await a.text()}))),o=s.Z.parseMTL(i.join("\n")),c={defaultWhite:s.Z.create1PixelTexture(this.gl,[255,255,255,255])};for(const s of Object.values(o))Object.entries(s).filter((([e])=>e.endsWith("Map"))).forEach((([e,t])=>{let a=c[t];s[e]=a}));this.objectData={obj:n,materials:o},this.$refs.page.Init()}}},p=a(89);const m=(0,p.Z)(u,[["render",r]]);var g=m}}]);
//# sourceMappingURL=975.b62cca3b.js.map