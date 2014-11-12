/*
 * package for loading game assets stored in the database somewhere, things
 * like terrain height data, trees, monsters, etc
 * * * * */

package assets

import (
  "encoding/json"
  "fmt"
  "net/http"
)

// Handler for getting terrain data, currenly just returns a JSON object
// representing the terrain height data
func TerrainHandler(w http.ResponseWriter, r *http.Request) {
  if r.Method != "GET" {
    // Permission error
    return
  }

  // Grab terrain height data using GetHeight
  heightData, err := GetHeight()
  if err != nil {
    fmt.Println(err)
    return
  }

  // Marshal it to a JSON object
  obj, err := json.Marshal(heightData)
  if err != nil {
    fmt.Println(err)
    return
  }

  // Write the byte data back to client
  w.Write(obj)
  return
}
