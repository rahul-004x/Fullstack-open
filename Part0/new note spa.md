```mermaid

sequenceDiagram
    participant Browser
    participant Server
    participant JavaScript
    actor User

    Browser->>Server: GET: https://studies.cs.helsinki.fi/exampleapp/spa

    activate Server
    Server-->>Browser: HTML document
    deactivate Server

    Note over Browser: Browser displays HTML document

    User->>Browser: Enter new note
    activate Browser
    User->>Browser: Clicks 'save'
    deactivate Browser

    Browser->>Server: POST: https://studies.cs.helsinki.fi/exampleapp/new_note_spa

    activate Server
    Server-->>Browser: Status Code: 201 Created
    deactivate Server

    Browser->>JavaScript: The Browser passes the response to js.code

    activate JavaScript
    JavaScript->>JavaScript: Parses response and manipulate DOM to render new note

