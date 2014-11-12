/*
 * Used to retrieve data relating to the terrain
 * * * * */

package assets

import (
  "fmt"

  "github.com/iceburg-instance/database"
  "github.com/iceburg-instance/database/models/terrain"
)

type HeightData struct {
  HeightVals []terrain.HeightTuple
}

// Extract the terrain height data, return it as a JSON object
func GetHeight() (*HeightData, error) {

  // Get all 5000 something rows of vertice height vals and shove them into
  // an array of HeightTuples
  qString := terrain.GetAllString()
  rows, err := database.Query(qString)
  if err != nil {
    fmt.Println(err)
    return nil, err
  }
  defer rows.Close()

  var heightSlice []terrain.HeightTuple
  var heightTuple terrain.HeightTuple

  for rows.Next() {
    heightTuple = terrain.HeightTuple{}
    if err := rows.Scan(&heightTuple.Id, &heightTuple.Height); err != nil {
      fmt.Println(err)
      return nil, err
    }
    heightSlice = append(heightSlice, heightTuple)
  }

  // Create new HeightData struct using heightSlice
  return &HeightData{HeightVals: heightSlice}, nil
}
