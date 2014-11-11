/*
 * Package for the admin panel, where the owner of the game instance can keep
 * track of number of monsters, restart the terrain, restart the flora, etc
 * * * * */

package admin

import (
  "html/template"
  "net/http"
)

// TODO: Add regex url parsing
var templates *template.Template

func InitTemplates() {
  templates = template.Must(template.ParseFiles(
    "templates/admin/admin.html",
    "templates/partials/header.html",
    "templates/partials/navbar.html",
    "templates/partials/footer.html" ))
}

// Load up the dashboard
func DashboardHandler(w http.ResponseWriter, r *http.Request) {
  templates.ExecuteTemplate(w, "admin.html", nil)
}
