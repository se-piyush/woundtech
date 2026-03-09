/**
 * @swagger
 * /api/v1/clinicians/{id}:
 *   get:
 *     tags: [Clinicians]
 *     summary: Get clinician by ID
 *     description: Retrieve a specific clinician by their ID including their visit history
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Clinician ID
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Clinician details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinician'
 *       404:
 *         description: Clinician not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
