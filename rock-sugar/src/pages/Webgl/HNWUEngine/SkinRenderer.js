export default class SkinRenderer {
    constructor(mesh, skin) {
      this.mesh = mesh;
      this.skin = skin;
    }
    render(gl,skinProgramInfo,node, projection, view, sharedUniforms) {
      const {skin, mesh} = this;
      skin.update(gl,node);
      gl.useProgram(skinProgramInfo.program);
      for (const primitive of mesh.primitives) {
        HNWUEngine.setBuffersAndAttributes(gl, skinProgramInfo, primitive.bufferInfo);
        HNWUEngine.setUniforms(skinProgramInfo, {
          u_projection: projection,
          u_view: view,
          u_world: node.worldMatrix,
          u_jointTexture: skin.jointTexture,
          u_numJoints: skin.joints.length,
        });
        if(primitive.material.uniforms){
          HNWUEngine.setUniforms(skinProgramInfo, primitive.material.uniforms);
        }
        HNWUEngine.setUniforms(skinProgramInfo, sharedUniforms);
        HNWUEngine.drawBufferInfo(gl, primitive.bufferInfo);
      }
    }
}