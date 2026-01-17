import Admin from "../Models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      const error = new Error("Admin already exists");
      error.statusCode = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully"
    });

  } catch (err) {
    next(err);
  }
};


export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      return next(error);
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      const error = new Error("Invalid email");
      error.statusCode = 404;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
  {
    id: admin._id,
    email: admin.email,
    role:"admin"   // 👈 ADD THIS
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.status(200).json({
      message: "Admin login successful",
      token
    });

  } catch (err) {
    next(err);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (err) {
    next(err);
  }
};
export const getAdminJobs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // total jobs count
    const totalJobs = await Job.countDocuments({
      postedBy: req.user.id
    });

    // paginated jobs
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applicationsCount = await Application.countDocuments({
          job: job._id
        });

        return {
          _id: job._id,
          title: job.title,
          company: job.company,
          jobType: job.jobType,
          location: job.location,
          salary: job.salary,
          status: job.status || "Active",
          applicationsCount
        };
      })
    );

    res.status(200).json({
      jobs: jobsWithApplications,
      pagination: {
        totalJobs,
        currentPage: page,
        totalPages: Math.ceil(totalJobs / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};
