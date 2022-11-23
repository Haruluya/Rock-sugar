export default class MeshRenderer {
    constructor(mesh) {
      this.mesh = mesh;
    }
    render(node, projection, view, sharedUniforms) {
      const {mesh} = this;
      gl.useProgram(meshProgramInfo.program);
      for (const primitive of mesh.primitives) {
        HNWUEngine.setBuffersAndAttributes(gl, meshProgramInfo, primitive.bufferInfo);
        HNWUEngine.setUniforms(meshProgramInfo, {
          u_projection: projection,
          u_view: view,
          u_world: node.worldMatrix,
        });
        HNWUEngine.setUniforms(meshProgramInfo, primitive.material.uniforms);
        HNWUEngine.setUniforms(meshProgramInfo, sharedUniforms);
        HNWUEngine.drawBufferInfo(gl, primitive.bufferInfo);
      }
    }
}