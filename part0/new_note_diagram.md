
## A diagram depicting the situation where the user creates a new note on the page https://studies.cs.helsinki.fi/exampleapp/notes by writing something into the text field and clicking the Save button.

![picture](./pics/1.png)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Enters note and clicks "Save"
    note over Browser: Browser collects form data

    Browser->>Server: POST /new_note (with form data)
    activate Server
    Server-->>Browser: HTTP 302 Redirect to /notes
    deactivate Server

    Browser->>Server: GET /notes
    activate Server
    Server-->>Browser: HTML document
    deactivate Server

    Browser->>Server: GET /main.css
    activate Server
    Server-->>Browser: CSS file
    deactivate Server

    Browser->>Server: GET /main.js
    activate Server
    Server-->>Browser: JavaScript file
    deactivate Server

    note over Browser: Browser executes JavaScript to fetch the latest notes

    Browser->>Server: GET /data.json
    activate Server
    Server-->>Browser: JSON data (list of notes)
    deactivate Server

    note over Browser: Browser updates the UI with the new note

```

