/**
 * @swagger
 * /api/visits:
 *   get:
 *     tags: [Visits]
 *     summary: Get all visits with pagination, sorting, and filtering
 *     description: Retrieve visits in reverse chronological order by default. Supports pagination, custom sorting, and filtering by clinician or patient
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [visitDate, createdAt, updatedAt]
 *           default: visitDate
 *         description: Field to sort by
 *         example: visitDate
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *         example: desc
 *       - in: query
 *         name: clinicianId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter visits by clinician ID
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter visits by patient ID
 *         example: 660e8400-e29b-41d4-a716-446655440001
 *     responses:
 *       200:
 *         description: Paginated list of visits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVisits'
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
