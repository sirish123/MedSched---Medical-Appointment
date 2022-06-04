//const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Patient = require("../models/patientData");

const DUMMY_PATIENTS = [
  {
    number: "7760633623",
    name: "ASHOK",
    gender: "MALE",
    address: "shivajinagar",
  },
  {
    number: "7349359536",
    name: "Sirish",
    gender: "MALE",
    address: "kaggasdasapura",
  },
];

const getPatientById = async (req, res, next) => {
  const patientId = req.params.pid;

  let patient;
  try {
    patient = await Patient.find({ number: patientId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not find patient",
      500
    );
    return next(error);
  }

  if (!patient) {
    const error = new HttpError(
      "Could not find a patient for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    patient: patient.map((patient) => patient.toObject({ getters: true })),
  });
};

const createPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { number, name, address, gender } = req.body;

  const createdPatient = new Patient({
    // id: uuidv4(),
    number,
    name,
    address,
    gender,
  });

  try {
    await createdPatient.save();
  } catch (err) {
    const error = new HttpError(
      "Creating patient failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Patient: createdPatient });
};

exports.getPatientById = getPatientById;
exports.createPatient = createPatient;
