#define MATCAP

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>

#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

varying vec3 vWorldNormal;
varying vec3 vModelPosition;

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vWorldNormal = worldNormal;

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>

	vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
	vModelPosition = modelPosition.xyz;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

	vViewPosition = - mvPosition.xyz;

}