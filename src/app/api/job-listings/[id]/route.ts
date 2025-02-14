import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import sql from "mssql";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const pool = await connectToDatabase();
    const request_db = new pool.Request();

    const result = await request_db.input("id", sql.Int, parseInt(params.id))
      .query(`
        SELECT *
        FROM [job-listings]
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: "Job listing not found" },
        { status: 404 }
      );
    }

    const job = result.recordset[0];
    return NextResponse.json({
      id: job.Id,
      jobID: job.jobID,
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      yearsOfExperience: job.yearsOfExperience,
      skillsRequired: job.skillsRequired ? job.skillsRequired.split(",") : [],
      candidateIDs: job.candidateIDs ? job.candidateIDs.split(",") : [],
      uploadedBy: job.uploadedBy,
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Failed to fetch job details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const pool = await connectToDatabase();
  const request_db = new pool.Request();

  const result = await request_db
    .input("id", sql.Int, parseInt(params.id))
    .query(`DELETE FROM [job-listings] WHERE Id = @id`);
  return NextResponse.json(
    { message: "Job listing deleted successfully" },
    { status: 200 }
  );
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const pool = await connectToDatabase();
  const request_db = new pool.Request();

  const job = await request.json();

  await request_db
    .input("id", sql.Int, parseInt(params.id))
    .input("jobTitle", sql.VarChar(100), job.jobTitle)
    .input("jobDescription", sql.VarChar(1000), job.jobDescription)
    .input("yearsOfExperience", sql.Int, job.yearsOfExperience)
      .input("skillsRequired", sql.VarChar(1000), job.skillsRequired.join(","))
      .query(`
        UPDATE [job-listings]
        SET 
          jobTitle = @jobTitle,
          jobDescription = @jobDescription,
          yearsOfExperience = @yearsOfExperience,
          skillsRequired = @skillsRequired
        WHERE Id = @id
        `);

  return NextResponse.json({ message: "Job listing updated successfully" });
  
}
