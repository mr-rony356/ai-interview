import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import sql from "mssql";

export async function POST(request: Request) {
  try {
    const job = await request.json();
    const pool = await connectToDatabase();
    const request_db = new pool.Request();

    // Generate a unique jobID
    const jobID = `JOB-${Date.now()}`;

    // Insert the job listing into the database
    const result = await request_db
      .input("jobID", sql.VarChar(100), jobID)
      .input("jobTitle", sql.VarChar(100), job.jobTitle)
      .input("jobDescription", sql.VarChar(1000), job.jobDescription)
      .input("yearsOfExperience", sql.Int, job.yearsOfExperience)
      .input("skillsRequired", sql.VarChar(1000), job.skillsRequired.join(","))
      .input("candidateIDs", sql.VarChar(1000), "") // Empty string for new jobs
      .input("uploadedBy", sql.Int, 1) // Replace with actual user ID when auth is implemented
      .query(`
        INSERT INTO [job-listings]
        (jobID, jobTitle, jobDescription, yearsOfExperience, skillsRequired, candidateIDs, uploadedBy)
        VALUES
        (@jobID, @jobTitle, @jobDescription, @yearsOfExperience, @skillsRequired, @candidateIDs, @uploadedBy);
        SELECT SCOPE_IDENTITY() AS Id;
      `);

    return NextResponse.json({
      message: "Job listing added successfully",
      id: result.recordset[0].Id,
    });
  } catch (error) {
    console.error("Error adding job listing:", error);
    return NextResponse.json(
      { error: "Failed to add job listing" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pool = await connectToDatabase();
    const request = new pool.Request();

    const result = await request.query(`
      SELECT *
      FROM [job-listings]
      ORDER BY Id DESC    `);
    const jobs = result.recordset.map((job) => ({
      id: job.Id,
      jobID: job.jobID,
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      yearsOfExperience: job.yearsOfExperience,
      skillsRequired: job.skillsRequired,
      candidateIDs: job.candidateIDs,
      uploadedBy: job.uploadedBy,
      location: job.Location,
      salaryRange: job.SalaryRange,
      jobType: job.JobType,
      likes: job.Likes,
      createdAt: job.CreatedAt,
      updatedAt: job.UpdatedAt,
    }));

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching job listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
