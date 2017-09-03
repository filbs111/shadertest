# shadertest ( precalculated gradient lighting )

This project demonstrates lighting by a skylight with colour gradient, in reatime, using a pregenerated texture. This texture encodes the result of lighting by an isotropic skylight, and from 3 skylights with gradient aligned with the cartesian axes. I believe this is equivalent to "spherical harmonic" lighting, for the first 4 harmonics.

By superposing these results appropriately, the result for a general gradient light can be quickly calculated - simply sample the rgba texture, and calculate a weighted sum of the colour values, with weights having a uniform value (assuming lighting is constant across the object)

## coloured objects

To do this generally multicoloured objects, would need 3 rgba textures - one for each lighting colour. If some of the object colours are equal or zero, fewer textures are required. This demo, with one rgba texture, uses objects that are monochrome - ie shades of grey. Objects where one or more colour channels are zero can also use this method (ie red, green, blue, cyan, magenta, yellow). 

## generating textures in Blender

Textures are generated using Blender's Cycles radiosity renderer. Two textures are baked. One uses a skylight with a gradient or r,g,b along each of the 3 cartesian axes. The other simply uses a skylight of single colour. The skylights are simply large emmissive objects surrounding the object to be "baked".

An example Blender file is provided. See blenderExample/cross80pcCompensated.blend . Instructions are given to bake textures for this. For another object, can use Blender's File->Append, either in this project to insert another object for baking, or from another project, to add the OmniLightbox and GradLightSphere objects.

Generally, using gradient lights with maximum r,b,g values of 1.0, and isotropic skylight of value 1.0, ensures that a diffusive object never saturates the result, because the brightest possible colour on the texture is 1.0. If the object is known to have maximum albedo of, say, 0.5, the lights can be doubled in brightness, better using the range of values in the baked texture. The blender example file is set up for baking an object with albedo 0.8, so the lights are multiplied by 1/0.8 = 1.25, seen in the colour of the Emission node for OmniLightbox, and the Multiply node for GradLightSphere.

To generate textures, first switch off rendering for OmniLightbox and on for GradLightSphere. (Camera icon in Outliner window greyed out = off), to generate the gradient light texture. Then select the object to be baked, and click "Bake" in the Render tab of the Properties window. Increasing the sampling here is advisable to avoid graininess. Then save the image from the UV/Image Editor window, using type OpenEXR because this encodes brightness linearly. (ie gamma = 1). Save as TexGrad.exr for this example. Then switch off rendering for GradLightSphere and on for OmniLightbox and repeat, saving result as TexOmni.exr.

Once both textures are baked and exported, combine them using Imagemagick:

convert TexGrad.exr TexOmni.exr -channel a -fx 'v.r' -depth 8 TexCombo.png

## further work

sample lighting where the moving object currently is, and use to light object appropriately. 

This can be done in realtime by rendering a cube map, and calculating lighting from it, but this is likely slow.

It's likely better to sample ahead of time and do interpolated lookup. Simplest implementation would be a constant density 3d grid samples. 
