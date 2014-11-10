require.config({
  paths: {
    // Shared game scripts
    "text": "/public/js/text",
    "ThreeJS": "/public/js/three.min",
    "Stats": "/public/js/stats",

    // The intro
    "Intro": "/public/js/intro",
    "UI": "/public/js/ui",
    "IntroVertex": "/public/glsl/IntroVertex.glsl",
    "IntroFragment": "/public/glsl/IntroFragment.glsl",

    // The game proper
    "Game": "/public/js/game",
    "PointerLock": "/public/js/pointerlockcontrols",
    "RaycastRifle": "/public/js/raycastrifle",
    "FractalFlora": "/public/js/fractalflora",
    "Tetrademon": "/public/js/tetrademon",
    "Terrain": "/public/js/terrain",
    "TerraVertex": "/public/glsl/terravertex.glsl",
    "TerraFragment": "/public/glsl/terrafragment.glsl"
  }
});

require(["ThreeJS", "Stats"], function() {

  require(
    ["text!IntroVertex", "text!IntroFragment", "Intro", "UI"],
    function(introVertex, introFragment, intro) {
      init(introVertex, introFragment);
      return;
    }
  );

  require(
    ["text!TerraVertex", "text!TerraFragment", "Game", "Terrain",
    "PointerLock", "RaycastRifle", "FractalFlora", "Tetrademon"],
    function(terraVertex, terraFragment, Game) {
      assignVertexes(terraVertex, terraFragment);
    }
  )
});
