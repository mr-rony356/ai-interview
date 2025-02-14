import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import sql from "mssql";

export async function POST(request: Request) {
  try {
    const candidate = await request.json();
    const pool = await connectToDatabase();
    const request_db = new pool.Request();

    // Convert base64 strings to binary for the database
    const resumeBuffer = candidate.resume
      ? Buffer.from(candidate.resume.split(",")[1], "base64")
      : null;
    const pictureBuffer = candidate.picture
      ? Buffer.from(candidate.picture.split(",")[1], "base64")
      : null;

    // Insert the candidate into the database
    const result = await request_db
      .input("FirstName", sql.VarChar(100), candidate.firstName)
      .input("LastName", sql.VarChar(100), candidate.lastName)
      .input("Email", sql.VarChar(100), candidate.email)
      .input("PhoneNumber", sql.VarChar(100), candidate.phoneNumber)
      .input("UploadedBy", sql.Int, 1) // Replace with actual user ID when auth is implemented
      .input("CurrentPosition", sql.VarChar(100), candidate.currentPosition)
      .input("Skills", sql.VarChar(100), candidate.skills.join(","))
      .input("Education", sql.VarChar(1000), candidate.education.join(","))
      .input("Resume", sql.VarBinary(sql.MAX), resumeBuffer)
      .input("Picture", sql.VarBinary(sql.MAX), pictureBuffer).query(`
        INSERT INTO my_candidates_list 
        (FirstName, LastName, Email, PhoneNumber, UploadedBy, CurrentPosition, Skills, Education, Resume, Picture)
        VALUES
        (@FirstName, @LastName, @Email, @PhoneNumber, @UploadedBy, @CurrentPosition, @Skills, @Education, @Resume, @Picture);
        SELECT SCOPE_IDENTITY() AS Id;
      `);

    return NextResponse.json({
      message: "Candidate added successfully",
      id: result.recordset[0].Id,
    });
  } catch (error) {
    console.error("Error adding candidate:", error);
    return NextResponse.json(
      { error: "Failed to add candidate" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pool = await connectToDatabase();
    const request = new pool.Request();

    const result = await request.query(`
      SELECT 
        Id, FirstName, LastName, Email, PhoneNumber, 
        CurrentPosition, Skills, Education,
        CONVERT(VARCHAR(MAX), Resume, 2) as Resume,
        CONVERT(VARCHAR(MAX), Picture, 2) as Picture
      FROM my_candidates_list
    `);

    // Convert binary data back to base64 strings
    const candidates = result.recordset.map((candidate) => ({
      id: candidate.Id,
      firstName: candidate.FirstName,
      lastName: candidate.LastName,
      email: candidate.Email,
      phoneNumber: candidate.PhoneNumber,
      currentPosition: candidate.CurrentPosition,
      skills: candidate.Skills ? candidate.Skills.split(",") : [],
      education: candidate.Education ? candidate.Education.split(",") : [],
      resume: candidate.Resume
        ? `data:application/pdf;base64,${candidate.Resume}`
        : "",
      picture: candidate.Picture
        ? `data:image/jpeg;base64,${candidate.Picture}`
        : "",
    }));

    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}
