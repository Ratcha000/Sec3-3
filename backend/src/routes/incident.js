const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// update status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.incident.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;