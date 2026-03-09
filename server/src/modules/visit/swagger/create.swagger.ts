/**
 * @swagger
 * /api/v1/visits:
 *   post:
 *     tags: [Visits]
 *     summary: Record a new visit
 *     description: Create a new patient visit record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clinicianId
 *               - patientId
 *               - visitDate
 *             properties:
 *               clinicianId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               patientId:
 *                 type: string
 *                 format: uuid
 *                 example: 660e8400-e29b-41d4-a716-446655440001
 *               visitDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-08T10:30:00Z"
 *               notes:
 *                 type: string
 *                 example: Patient presented with chest pain
 *               diagnosis:
 *                 type: string
 *                 example: Acute myocardial infarction
 *               treatment:
 *                 type: string
 *                 example: Prescribed aspirin and statins
 *     responses:
 *       201:
 *         description: Visit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visit'
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Clinician or Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
