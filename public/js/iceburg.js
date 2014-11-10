require.config({
  paths: {
    "text": "/public/js/text",
    "ThreeJS": "/public/js/three.min",
    "Stats": "/public/js/stats",
    "Intro": "/public/js/intro",
    "IntroVertex": "/public/glsl/IntroVertex.glsl",
    "IntroFragment": "/public/glsl/IntroFragment.glsl"
  }
});

require(["ThreeJS", "Stats"], function() {
  require(
    ["text!IntroVertex", "text!IntroFragment", "Intro"],
    function(introVertex, introFragment, intro) {
      init(introVertex, introFragment);
      return;
    }
  );
});
