/**
 * @swagger
 * /api/v1/clinicians:
 *   get:
 *     tags: [Clinicians]
 *     summary: Get all clinicians
 *     description: Retrieve a list of all clinicians
 *     responses:
 *       200:
 *         description: List of clinicians
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clinician'
 */
