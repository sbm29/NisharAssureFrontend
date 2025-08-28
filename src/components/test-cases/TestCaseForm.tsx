import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TestCase } from "@/types/testCase";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAddTestCase } from "@/hooks/testcases/useAddTestCases";
import { useUpdateTestCase } from "@/hooks/testcases/useUpdateTestCase";

const testCaseSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  type: z.enum([
    "Functional",
    "Performance",
    "Security",
    "Usability",
    "Compatibility",
    "Other",
  ]),
  preconditions: z.string().optional(),
  steps: z.string().min(10, { message: "Test steps are required." }),
  expectedResults: z
    .string()
    .min(5, { message: "Expected results are required." }),
  testSuite: z.string(),
  project: z.string().optional(), 
  createdBy: z.string().optional(),
});

type TestCaseFormValues = z.infer<typeof testCaseSchema>;

interface TestCaseFormProps {
  _id?: string;
  defaultValues?: Partial<TestCaseFormValues>;
  isEditing?: boolean;
  projectId: string; 
  testSuiteId?: string;

  onSuccess?: () => void;
}

const TestCaseForm: React.FC<TestCaseFormProps> = ({
  _id,
  defaultValues,
  isEditing,
  projectId,
  testSuiteId,

  onSuccess,
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("details");

  const form = useForm<TestCaseFormValues>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      _id: defaultValues?._id || "",
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      priority: defaultValues?.priority || "Medium",
      type: defaultValues?.type || "Functional",
      preconditions: defaultValues?.preconditions || "",
      steps: defaultValues?.steps || "",
      expectedResults: defaultValues?.expectedResults || "",
      testSuite: testSuiteId || "",
    },
  });

  

  const { isSubmitting } = form.formState;

  const { mutateAsync: createTestCase } = useAddTestCase();
  const { mutateAsync: updateTestCase } = useUpdateTestCase();

  //console.log("testSuiteId", testSuiteId);

  const handleSubmit = async (data: TestCaseFormValues) => {
    console.log("Test Case data", data);

    if (!testSuiteId) {
      toast({
        title: "Error",
        description: "Missing project, test suite, or module ID",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("defaultValues", defaultValues);
      console.log("_id", _id);
      if (isEditing && defaultValues._id) {
        // ✅ Update logic
        setActiveTab("steps");
        console.log("Update logic");
        await updateTestCase({
          _id: defaultValues._id,
          project: projectId,
          testSuite: testSuiteId,

          ...data,
        });
      } else {
        // ✅ Create logic
        await createTestCase({
          ...data,
          project: projectId,
          testSuite: testSuiteId,
        });
        form.reset();
        if (onSuccess) onSuccess();
      }

      toast({
        title: `Test case ${isEditing ? "updated" : "created"} successfully`,
        description: `"${data.title}" has been ${
          isEditing ? "updated" : "created"
        }.`,
      });
    } catch (error) {
      toast({
        title: `Error ${isEditing ? "updating" : "creating"} test case`,
        description: (error as Error).message || "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          console.log("Form submit triggered");
          form.handleSubmit(handleSubmit, (errors) => {
            console.log("Form validation failed", errors);
          })(e);
        }}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`${isMobile ? "grid grid-cols-2" : ""} w-full md:w-auto`}
          >
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="steps">Steps & Expected Results</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter test case title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter test case description"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Functional">Functional</SelectItem>
                        <SelectItem value="Performance">Performance</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Usability">Usability</SelectItem>
                        <SelectItem value="Compatibility">
                          Compatibility
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preconditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preconditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter test case preconditions (optional)"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="button" onClick={() => setActiveTab("steps")}>
                Next: Steps
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Steps</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed test steps"
                      className="min-h-40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Results</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter expected results"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("details")}
              >
                Back
              </Button>
              <Button type="submit">
                {isSubmitting
                  ? "Submitting..."
                  : isEditing
                  ? "Update Test Case"
                  : "Create Test Case"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default TestCaseForm;
