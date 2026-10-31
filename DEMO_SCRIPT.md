# Demonstration Video Script (roughly 3–5 minutes)

**1. Starting the app**: "This is StudyFlow, a student assignment tracker built with Next.js 16, MySQL and Docker Compose. Here are the Dockerfile, Compose configuration and SQL initialization script. I'll now run `docker compose up --build`."

**2. Browser**: "The application is available on localhost port 8080. It displays assignments loaded from MySQL and calculates the dashboard summary from those records."

**3. Main features**: "I can create a new assignment with a course, deadline, priority, status and notes. I can search by title or course, filter tasks by status, edit existing tasks, mark them complete, and delete them."

**4. MySQL proof**: "Now I'll open phpMyAdmin on localhost port 8081. In the `studyflow` database's `tasks` table, you can see the same assignments. When I edit or delete one in the app, this MySQL data changes accordingly. Refreshing the web page retrieves the database data again."

**5. Conclusion**: "The Next.js web app communicates through REST API routes to MySQL via the `mysql2` driver. Docker Compose starts the web app, MySQL and phpMyAdmin together. The source code and setup guide are available in the linked GitHub repository."
