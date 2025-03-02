const prisma = require('../db');
const createHttpError = require('http-errors');

// Create a new municipality
const createMunicipality = async (req, res, next) => {
  try {

    const {municipalityId, municipality } = req.body;
console.log( req.body);

    if (!municipality & !municipalityId) {
      throw createHttpError(400, 'Municipality name & municipalityId is required');
    }

    const existingMunicipality = await prisma.municipalities.findFirst({
      where: {
        OR: [
          { municipality: municipality },
          { municipalityId:parseInt(municipalityId) }
        ]
      }
    });
    if (existingMunicipality) {
      throw createHttpError(409, 'Municipality already exists');
    }

    const newMunicipality = await prisma.municipalities.create({
      data: {
        municipality: municipality,
        municipalityId: parseInt(municipalityId)
      },
    });

    res.status(201).json({ success: true, municipality: newMunicipality });
  } catch (error) {
    next(error);
  }
};

// Get all municipalities
const getAllMunicipalities = async (req, res, next) => {
  try {
    const municipalities = await prisma.municipalities.findMany();
    res.json(municipalities);
  } catch (error) {
    next(error);
  }
};

// Update a municipality
const updateMunicipality = async (req, res, next) => {
  const { id } = req.params;
  const { municipality } = req.body;

  try {
    const updatedMunicipality = await prisma.municipalities.update({
      where: { municipalityId: parseInt(id) },
      data: {
        municipality: municipality,
        municipalityId: parseInt(id) 
      },
    });

    res.json({ success: true, municipality: updatedMunicipality });
  } catch (error) {
    next(error);
  }
};

// Delete a municipality
const deleteMunicipality = async (req, res, next) => {
  const { id } = req.params;
console.log("xxxx",req.params);

  try {
    await prisma.municipalities.delete({
      where: { municipalityId: parseInt(id) },
    });

    res.json({ success: true, message: 'Municipality deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMunicipality,
  getAllMunicipalities,
  updateMunicipality,
  deleteMunicipality,
};
