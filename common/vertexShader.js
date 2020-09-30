//create the vertex shading on the cube




(function () {
    
    uniform mat4 u_modelViewProjMatrix;
    uniform mat4 u_normalMatrix;
    uniform vec3 lightDir;
 
    attribute vec3 vNormal;
    attribute vec4 vTexCoord;
    attribute vec4 vPosition;
 
    varying float v_Dot;
    varying vec2 v_texCoord;
 
    void main()
    {
        gl_Position = u_modelViewProjMatrix * vPosition;
        v_texCoord = vTexCoord.st;
        vec4 transNormal = u_normalMatrix * vec4(vNormal, 1);
        v_Dot = max(dot(transNormal.xyz, lightDir), 0.0);
    }
   /*/ vertex shader 
    varying vPosition;
    varying vec3 vNormal;
    
    // output values that will be interpolatated per-fragment
    varying vec3 fN;
    varying vec3 fE;
    varying vec3 fL;

    uniform mat4 ModelView;
    uniform vec4 LightPosition;
    uniform mat4 Projection;

    void main()
    {   
        fN = vNormal;
        fE = vPosition.xyz;
        fL = LightPosition.xyz;
       // fL = highp vec4 gl_Position;
    
        if( LightPosition.w != 0.0 ) {
        //	fL = LightPosition.xyz - vPosition.xyz;
        fL = LightPosition.xyz - vPosition.xyz;
         }

        gl.Position = Projection*ModelView*vPosition;
    }  


   /* // fragment shader
    // per-fragment interpolated values from the vertex shader
    vec3 fN;
    vec3 fL;
    vec3 fE;

    uniform vec4 AmbientProduct, DiffuseProduct, SpecularProduct;
    uniform mat4 ModelView;
    uniform vec4 LightPosition;
    uniform float Shininess;

    void main() 
    { 
        // Normalize the input lighting vectors
    
         vec3 N = normalize(fN);
         vec3 E = normalize(fE);
         vec3 L = normalize(fL);
    
         vec3 H = normalize( L + E );   
         vec4 ambient = AmbientProduct;

    
         float Kd = max(dot(L, N), 0.0);
         vec4 diffuse = Kd*DiffuseProduct;
    
         float Ks = pow(max(dot(N, H), 0.0), Shininess);
          vec4 specular = Ks*SpecularProduct;

       // discard the specular highlight if the light's behind the vertex
        if( dot(L, N) < 0.0 ) 
        	specular = vec4(0.0, 0.0, 0.0, 1.0);
      
            gl_FragColor = ambient + diffuse + specular;
            gl_FragColor.a = 1.0;
    } */
})();