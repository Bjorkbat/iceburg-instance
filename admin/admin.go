/*
 * Package for the admin panel, where the owner of the game instance can keep
 * track of number of monsters, restart the terrain, restart the flora, etc
 * * * * */

package admin

import (
  "fmt"
  "html/template"
  "math/rand"
  "net/http"

  "github.com/iceburg-instance/database"
  "github.com/iceburg-instance/database/models/terrain"
  "github.com/iceburg-instance/database/models/creature"
)

// TODO: Add regex url parsing
var templates *template.Template

const TERRAIN_VERTICE_COUNT = 76 * 76
const HEIGHT_RANGE = 10

func InitTemplates() {
  templates = template.Must(template.ParseFiles(
    "templates/admin/admin.html",
    "templates/admin/terra.html",
    "templates/admin/fauna.html",
    "templates/admin/terra_success.html",
    "templates/admin/fauna_success.html",
    "templates/partials/header.html",
    "templates/partials/navbar.html",
    "templates/partials/footer.html" ))
}

// Load up the dashboard
// TODO: Check to see that user is actually authenticated first
func DashboardHandler(w http.ResponseWriter, r *http.Request) {
  templates.ExecuteTemplate(w, "admin.html", nil)
}

// Renders the fauna template, and handles requests to change the
// fauna count
func FaunaHandler(w http.ResponseWriter, r *http.Request) {

  if r.Method == "GET" {
    templates.ExecuteTemplate(w, "fauna.html", nil)
    return
  } else if r.Method != "POST" {
    // Permission error
    return
  }

  // In event of POST request, run a switch against the form value indicating
  // the type.  For each type, extract another FormValue, called delta, then
  // update the database in accordance
  creatureType := r.FormValue("creature")
  // TODO: Run a regex checker on creature type
  count := r.FormValue("count")
  qString := creature.GenInsert(creatureType, count)
  _, err := database.Execute(qString)
  if err != nil {
    fmt.Println(err)
    return
  }

  // So, the update was a success.  Send out a success message
  templates.ExecuteTemplate(w, "fauna_success.html", nil)
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
    genHeight(76, 76, HEIGHT_RANGE, terraHeights)

    // Store this array of height values into the database, under the
    // terrain_height model
    execString := terrain.GenInsertBulk(terraHeights)
    result, err := database.Execute(execString)
    if err != nil {
      fmt.Println("fuck!")
    } else {
      rows, _:= result.RowsAffected()
      fmt.Println(rows)
    }
    // Render the success template below
  } else if r.FormValue("reset") == "true" {
    // In the event of a reset, delete all entries from terrain table and
    // gen new entries.
    // This is important as opposed to just doing an update, as it's possible
    // that use might want to change the number of terrain vertices
    terraHeights := make([]float32, TERRAIN_VERTICE_COUNT)
    genHeight(76, 76, HEIGHT_RANGE, terraHeights)

    // Remove all the entries
    qString := terrain.GenReset()
    _, err := database.Execute(qString)
    if err != nil {
      fmt.Println(err)
      return
    }

    // And insert the new ones
    qString = terrain.GenInsertBulk(terraHeights)
    result, err := database.Execute(qString)
    if err != nil {
      fmt.Println(err)
    } else {
      rows, _ := result.RowsAffected()
      fmt.Println(rows)
    }
  }

  templates.ExecuteTemplate(w, "terra_success.html", nil)
  return
}

// Generates height data for the terrain
func genHeight(widthVerts int, lengthVerts int, heightRange int, verts []float32) {

  // Stands for Random Within Range.  A random value that falls within the
  // defined height range
  var rwr float32
  lowerOffset := float32(heightRange) / 2

  for i := 0; i < len(verts); i ++ {

    rwr = (rand.Float32() * float32(heightRange)) - lowerOffset

    if i == 0 {
      // If it's the first vertice, set to purely rand val
      verts[i] = rwr
    } else if i < widthVerts {
      // We're still on the beginning row, in which case we only have to
      // worry about one point of data, the vertice prior
      verts[i] = verts[i-1] + rwr
    } else if i % widthVerts == 0 {
      // Basically, is this vertice a starting vertice?  If so, use the two
      // adjacent calculated points to calc height
      verts[i] = pointAverage(
        verts[i - widthVerts],
        verts[i - widthVerts + 1]) + rwr
    } else if i % widthVerts == widthVerts - 1 {
      // These vertices are located at the end of a row, hence the modulo
      // condition.  Vertices like these will have three adjacent vertices
      // to factor in
      verts[i] = pointAverage(
        verts[i - widthVerts],
        verts[i - widthVerts - 1],
        verts[i -1] ) + rwr
    } else {
      // Most vertices will have 4 adjacent calculated vertices
      verts[i] = pointAverage(
        verts[i - widthVerts],
        verts[i - widthVerts - 1],
        verts[i - widthVerts + 1],
        verts[i - 1]) + rwr
    }
  } // endfor
}

// Calculates the average height given a number of points as input
func pointAverage(points ...float32) float32 {
  var sum float32 = 0.0
  for i := 0; i < len(points); i ++ {
    sum = sum + points[i]
  }
  return sum / float32(len(points))
}
