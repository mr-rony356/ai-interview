"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

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

const formSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  yearsOfExperience: z.number().min(1, "Years of experience is required"),
  skillsRequired: z.string().min(1, "Skills are required"),
});

export default function JobListingsPage() {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      yearsOfExperience: 0,
      skillsRequired: "",
    },
  });

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      yearsOfExperience: 0,
      skillsRequired: "",
    },
  });

  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/job-listings");
      const data = await response.json();

      // Check if data is an array, if not use empty array
      setJobListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching job listings:", error);
      setJobListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/job-listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          skillsRequired: values.skillsRequired.split(",").map((r) => r.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create job listing");
      }

      // Refresh the job listings
      await fetchJobListings();
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating job listing:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/job-listings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job listing");
      }

      await fetchJobListings();
    } catch (error) {
      console.error("Error deleting job listing:", error);
    }
  };

  const handleEdit = (job: JobListing) => {
    setEditingJob(job);
    editForm.reset({
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      yearsOfExperience: job.yearsOfExperience,
      skillsRequired: Array.isArray(job.skillsRequired)
        ? job.skillsRequired.join(", ")
        : job.skillsRequired,
    });
    setIsEditOpen(true);
  };

  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!editingJob) return;

    try {
      const response = await fetch(`/api/job-listings/${editingJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          skillsRequired: values.skillsRequired.split(",").map((s) => s.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job listing");
      }

      await fetchJobListings();
      setIsEditOpen(false);
      setEditingJob(null);
      editForm.reset();
    } catch (error) {
      console.error("Error updating job listing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero section with background image */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">My Jobs</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Create Job Listing</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Job Listing</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the job role and responsibilities"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience Required</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skillsRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills (comma-separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="React, TypeScript, Node.js"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create Listing
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Job Listing</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Senior Software Engineer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the job role and responsibilities"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience Required</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="skillsRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, TypeScript, Node.js"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Update Listing
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Job listings section */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : jobListings.length === 0 ? (
          <div className="text-center py-8">No job listings found</div>
        ) : (
          <div className="space-y-4">
            {jobListings.map((job: JobListing) => (
              <div key={job.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{job.jobTitle}</h2>
                    <p className="text-gray-600 mt-2">{job.jobDescription}</p>
                    <div className="text-gray-500 text-sm mt-1">
                      <p>Experience Required: {job.yearsOfExperience} years</p>
                      <p>
                        Skills:{" "}
                        {Array.isArray(job.skillsRequired)
                          ? job.skillsRequired.join(", ")
                          : job.skillsRequired}
                      </p>
                      <p>Job ID: {job.jobID}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(job)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(job.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/job-listings/${job.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    See More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show pagination only if we have job listings */}
        {!isLoading && jobListings.length > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              1
            </button>
            <button className="px-4 py-2 hover:bg-gray-100 rounded-md">
              2
            </button>
            <button className="px-4 py-2 hover:bg-gray-100 rounded-md">
              3
            </button>
            <button className="px-4 py-2 hover:bg-gray-100 rounded-md">
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
