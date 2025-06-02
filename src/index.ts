import express from 'express'
import membershipRoutes from './modern/routes/membership.routes'
import { errorHandler } from './modern/middleware/error.middleware'
import { AppDataSource } from './modern/config/data-source'

// because of the javascript module, we need to use require to import the legacy routes
const legacyMembershipRoutes = require('./legacy/routes/membership.routes')

const app = express()
const port = 3099

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection initialized")
    
    app.use(express.json())
    app.use('/memberships', membershipRoutes);
    app.use('/legacy/memberships', legacyMembershipRoutes);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error("Error initializing database:", error)
    process.exit(1)
  })