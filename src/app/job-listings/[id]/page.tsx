"use client";

import { useEffect, useState, use } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface JobListing {
  id: number;
  jobID: string;
  jobTitle: string;
  jobDescription: string;
  yearsOfExperience: number;
  skillsRequired: string[];
  candidateIDs: string[];
  uploadedBy: number;
}

export default function JobDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [job, setJob] = useState<JobListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [candidatesCount, setCandidatesCount] = useState(0);

  useEffect(() => {
    fetchJobDetails();
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/job-listings/${params.id}`);
      const data = await response.json();
      setJob(data);
      setCandidatesCount(data.candidateIDs?.length || 0);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!job) {
    return <div className="container mx-auto px-4 py-8">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero section */}
      <div className="relative h-80 bg-gradient-to-r from-gray-700 to-gray-900">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-4">{job.jobTitle}</h1>
          <div className="flex items-center space-x-8 text-white">
            <div className="text-2xl">{job.jobID}</div>
            <div className="flex items-center">
              <span className="text-2xl">{candidatesCount}</span>
              <span className="ml-2 text-sm uppercase">Candidates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="container mx-auto px-4 py-8">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="job-description"
            className="bg-white rounded-lg"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center">
                <span className="text-xl font-semibold">Job Description</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <p>{job.jobDescription}</p>
                <div>
                  <h3 className="font-semibold mb-2">Required Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Experience Required:</h3>
                  <p>{job.yearsOfExperience} years</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="interview-questions"
            className="bg-white rounded-lg"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center">
                <span className="text-xl font-semibold">
                  Interview Questions
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <p>Interview questions will be displayed here...</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="candidates" className="bg-white rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center">
                <span className="text-xl font-semibold">Candidates</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <p>Candidates will be displayed here...</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
