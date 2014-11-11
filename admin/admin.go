/*
 * Package for the admin panel, where the owner of the game instance can keep
 * track of number of monsters, restart the terrain, restart the flora, etc
 * * * * */

package admin

import (
  "fmt"
  "html/template"
  "net/http"
)

// TODO: Add regex url parsing
var templates *template.Template

const TERRAIN_VERTICE_COUNT = 76 * 76
const HEIGHT_RANGE = 10

func InitTemplates() {
  templates = template.Must(template.ParseFiles(
    "templates/admin/admin.html",
    "templates/admin/terra.html",
    "templates/admin/terra_success.html",
    "templates/partials/header.html",
    "templates/partials/navbar.html",
    "templates/partials/footer.html" ))
}

// Load up the dashboard
// TODO: Check to see that user is actually authenticated first
func DashboardHandler(w http.ResponseWriter, r *http.Request) {
  templates.ExecuteTemplate(w, "admin.html", nil)
}

// Renders the terrain template, and creates new terrain on certain params
func TerraHandler(w http.ResponseWriter, r *http.Request) {

  if r.Method == "GET" {
    templates.ExecuteTemplate(w, "terra.html", nil)
    return
  } else if r.Method != "POST" {
    // Permission error
    return
  }

  // Now then, if it's a post request and init == true, create a new set of
  // vertices and put them in the database, which are then used by the front
  if r.FormValue("init") == "true" {

    // Generate vertice height values, store in array
    terraHeights := make([]float32, TERRAIN_VERTICE_COUNT)
    genHeight(75, 75, HEIGHT_RANGE, terraHeights)

    fmt.Println(terraHeights[1])

    // Store this array of height values into the database, under the
    // terrain_height model

    // Operation was a success, template execution below will handle the rest
  }

  templates.ExecuteTemplate(w, "terra_success.html", nil)
}

// Generates height data for the terrain
func genHeight(widthVerts int, lengthVerts int, heightRange int, verts []float32) {
  for i := 0; i < len(verts); i ++ {
    // For now, for the sake of testing, alternate between 0 and 5
    if i % 2 == 0 {
      verts[i] = 0
    } else {
      verts[i] = 5
    }
  }
}
