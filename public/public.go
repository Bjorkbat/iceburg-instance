/*
 * Package for serving up public files.  More specifically, files rendered as
 * is AND aren't uploaded by the user (those are in the media folder).  Used
 * predominantly for css and js files
 * * * * */

package public

import (
  "io/ioutil"
  "net/http"
  "regexp"
)

// Important.  Define a regular expression to limit the types of files served
// Basically, only serve stuff in either the js or css directory, with a
// limited charset, and make sure the file has the right suffix
var validStatic = regexp.MustCompile("^/public/(js|css|img|glsl)/([a-zA-Z0-9]+)(.min)?(.css|.js|.jpg|.png|.glsl)$")

// Simple, serve a file
func PublicHandler(w http.ResponseWriter, r *http.Request) {

  // First, check to see that the path is even valid
  path := validStatic.FindStringSubmatch(r.URL.Path)
  if path == nil {
    http.NotFound(w, r)
    return
  }

  // If the path is valid, then extract the necessary subexpressions.
  // Suffix only matters when dealing with images
  directory := path[1]
  filename := path[2]
  min := path[3]
  suffix := path[4]

  // Generate the appropriate filepath string depending on the directory
  var ioString string = ""
  var contentType string = ""

  switch directory {
    case "css":
      ioString = "public/css/" + filename + min + ".css"
      contentType = "text/css"
    case "glsl":
      ioString = "public/glsl/" + filename + ".glsl"
      contentType = "text/plain"
    case "js":
      ioString = "public/js/" + filename + min + ".js"
      contentType = "application/javascript"
    case "img":
      switch suffix {
        case ".jpg":
          contentType = "image/jpeg"
        case ".png":
          contentType = "image/png"
        default:
          http.Error(w, "Image neither png or jpeg", http.StatusInternalServerError)
          return
      }
      ioString = "public/img/" + filename + suffix
    default:
      http.Error(w, "Regex is fucked", http.StatusInternalServerError)
      return
  }

  // Then, serve up some delish (or go 404 if you can't find the file)
  static, err := ioutil.ReadFile(ioString)
  if err != nil {
    http.NotFound(w, r)
  } else {
    w.Header().Set("Content-Type", contentType)
    w.Write(static)
  }
}
