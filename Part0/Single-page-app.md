
```mermaid

sequenceDiagram
    participant Browser
    participant Server

    Browser->>Server: GET: https://studies.cs.helsinki.fi/exampleapp/spa

    activate Server
    Server-->>Browser: HTML document
    deactivate Server

    Browser->>Server: GET: https://studies.cs.helsinki.fi/exampleapp/spa/main.css

    activate Server
    Server-->>Browser: the CSS file
    deactivate Server

    Browser->>Server: GET: https://studies.cs.helsinki.fi/exampleapp/spa/spa.js

    activate Server
    Server-->>Browser: the JavaScript file
    deactivate Server

    Note right of Browser: The browser start executing the JavaScript code that fatched the data from JSON from the server

    Browser->>Server: GET: https://studies.cs.helsinki.fi/exampleapp/data.json

    activate Server
    Server-->>Browser: {content: "Beck is better than everyone", date: "2024-05-03T15:55:52.382Z"}
    deactivate Server

    Browser->>Browser: Parse JSON response and displays the list of notes
