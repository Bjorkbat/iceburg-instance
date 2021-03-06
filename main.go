/*
 * Main Iceburg backend file.  It's primary function is to respond to a number
 * of command line args, as well as function as a routing file of sorts, taking
 * in urls and passing them along to the appropriate views
 * * * * */

package main

import (
  // Base imports
  "fmt"
  "net/http"
  "os"

  // Local imports
  "github.com/iceburg-instance/admin"
  "github.com/iceburg-instance/assets"
  "github.com/iceburg-instance/database"
  "github.com/iceburg-instance/database/db_init"
  "github.com/iceburg-instance/home"
  "github.com/iceburg-instance/public"
  "github.com/iceburg-instance/accounts"
)

func main() {

  // Currently only one command line arg defined.  Will add more as needs
  // arise
  args := os.Args
  if len(args) <= 1 {
    // TODO: Print out usage help
    return
  } else {
    switch args[1] {
      case "initdb":
        // Initialize the database with the necessary models
        err := db_init.Init()
        if err != nil {
          fmt.Println(err)
        } else {
          fmt.Println("Database Initialized")
        }
        return
      case "runserver":
        // Prep the server and run it
        defineRoutes()
        // Add a flag argument where you can ignore the database.  Basically
        // used just to fuck around with the demo
        if len(args) < 3 || args[2] != "--ignoredb" {
          err := database.Open()
          if err != nil {
            fmt.Println(err)
            return
          }
        }
        fmt.Println("Server is Running on Port :8080")
        http.ListenAndServe(":8080", nil)
    }
  }
}

// Contrary to the name, this function does more than simply define the routes
// that the server will accept.  It also sets up any templates that the routes
// might need as well.
func defineRoutes() {

  // Static handler
  // TODO: Add function to handle static files
  http.HandleFunc("/public/", public.PublicHandler)

  // Homepage
  home.InitTemplates()
  http.HandleFunc("/", home.HomeHandler)

  // Dashboard
  accounts.InitTemplates()
  http.HandleFunc("/login/", accounts.LoginHandler)
  http.HandleFunc("/signup/", accounts.SignUpHandler)

  admin.InitTemplates()
  http.HandleFunc("/admin/", admin.DashboardHandler)
  http.HandleFunc("/admin/terra/", admin.TerraHandler)
  http.HandleFunc("/admin/fauna/", admin.FaunaHandler)

  // Asset Retreival
  http.HandleFunc("/assets/terrain/", assets.TerrainHandler)
  http.HandleFunc("/assets/creatures/", assets.CreatureHandler)
}
