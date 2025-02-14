"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  uploadedBy: string;
  currentPosition: string;
  yearsOfExperience: number;
  skills: string[];
  resume: string; // We'll store file as base64 string for local storage
  picture: string; // We'll store file as base64 string for local storage
  education: string[];
}

function InterviewLists() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [newCandidate, setNewCandidate] = useState<Candidate>({
    id: Date.now(),
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    uploadedBy: "",
    currentPosition: "",
    yearsOfExperience: 0,
    skills: [],
    resume: "",
    picture: "",
    education: [],
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
        const response = await fetch("/api/candidates");
      if (!response.ok) throw new Error("Failed to fetch candidates");
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      // Add error handling UI if needed
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "resume" | "picture"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setNewCandidate((prev) => ({
        ...prev,
        [fieldName]: base64,
      }));
    }
  };

  const handleArrayInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "skills" | "education"
  ) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setNewCandidate((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCandidate),
      });

      if (!response.ok) throw new Error("Failed to add candidate");

      // Refresh the candidates list
      await fetchCandidates();

      // Reset form and close dialog
      setNewCandidate({
        id: Date.now(),
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        uploadedBy: "",
        currentPosition: "",
        yearsOfExperience: 0,
        skills: [],
        resume: "",
        picture: "",
        education: [],
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding candidate:", error);
      // Add error handling UI if needed
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl mt-56">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Candidates</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Candidate</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
            </DialogHeader>

            {/* Form moved inside dialog */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    type="text"
                    name="firstName"
                    value={newCandidate.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    type="text"
                    name="lastName"
                    value={newCandidate.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={newCandidate.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={newCandidate.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Uploaded By</label>
                  <Input
                    type="text"
                    name="uploadedBy"
                    value={newCandidate.uploadedBy}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Current Position
                  </label>
                  <Input
                    type="text"
                    name="currentPosition"
                    value={newCandidate.currentPosition}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Years of Experience
                  </label>
                  <Input
                    type="number"
                    name="yearsOfExperience"
                    value={newCandidate.yearsOfExperience}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills</label>
                  <Input
                    type="text"
                    placeholder="Separate with commas"
                    onChange={(e) => handleArrayInput(e, "skills")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Education</label>
                  <Input
                    type="text"
                    placeholder="Separate with commas"
                    onChange={(e) => handleArrayInput(e, "education")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resume</label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "resume")}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Picture</label>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "picture")}
                    accept="image/*"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Candidate
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Accordion List */}
      <Accordion type="single" collapsible className="space-y-4">
        {candidates.map((candidate) => (
          <AccordionItem
            key={candidate.id}
            value={candidate.id.toString()}
            className="bg-white rounded-lg shadow-lg"
          >
            <AccordionTrigger className="px-4 py-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  {candidate.picture && (
                    <img
                      src={candidate.picture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {candidate.currentPosition}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {candidate.yearsOfExperience} years exp.
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong> {candidate.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {candidate.phoneNumber}
                  </p>
                  <p>
                    <strong>Uploaded By:</strong> {candidate.uploadedBy}
                  </p>
                  <p>
                    <strong>Current Position:</strong>{" "}
                    {candidate.currentPosition}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Skills:</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p>
                    <strong>Education:</strong>
                  </p>
                  <ul className="list-disc list-inside">
                    {candidate.education.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                  {candidate.resume && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(candidate.resume)}
                      className="mt-2"
                    >
                      View Resume
                    </Button>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// Helper function to convert files to base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default InterviewLists;
