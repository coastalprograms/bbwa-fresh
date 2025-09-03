"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar, Upload } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/client"
import type { Worker } from "@/types/supabase"
import type { ContractorOption } from "@/types/contractors"
import { getActiveContractors, submitWorkerInduction } from "./actions"

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  allergies: z.string().optional(),
  
  // Employment Details
  contractorId: z.string().min(1, "Please select your employer/contractor"),
  position: z.string().min(1, "Position is required"),
  trade: z.string().min(1, "Trade is required"),
  
  // Licenses & Certifications
  whiteCardFile: z.any().optional(),
  highRiskLicense: z.boolean(),
  highRiskLicenseFile: z.any().optional(),
  safeWorkTiltJobs: z.boolean(),
  safeWorkTiltJobsFile: z.any().optional(),
  otherLicense: z.boolean(),
  otherLicenseDetails: z.string().optional(),
  otherLicenseFile: z.any().optional(),
  
  // Emergency Contact
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyRelationship: z.string().min(1, "Relationship is required"),
  
  // Site Rules
  noAlcoholDrugs: z.boolean().refine(val => val === true, "You must agree to no alcohol/drugs policy"),
  electricalEquipment: z.boolean().refine(val => val === true, "You must acknowledge electrical equipment responsibility"),
  hazardousSubstances: z.boolean().refine(val => val === true, "You must understand hazardous substances policy"),
  usePPE: z.boolean().refine(val => val === true, "You must agree to use PPE when necessary"),
  highRiskWorkMeeting: z.boolean().refine(val => val === true, "You must understand high risk work meeting requirements"),
  appropriateSignage: z.boolean().refine(val => val === true, "You must agree to display appropriate signage"),
  noUnauthorizedVisitors: z.boolean().refine(val => val === true, "You must understand visitor policy"),
  housekeeping: z.boolean().refine(val => val === true, "You must acknowledge housekeeping responsibility"),

  // Employer Safety Requirements
  employerTraining: z.boolean().refine(val => val === true, "You must confirm employer provided training"),
  employerSWMS: z.boolean().refine(val => val === true, "You must confirm employer provided SWMS"),
  discussedSWMS: z.boolean().refine(val => val === true, "You must confirm SWMS discussion"),
  preStartMeeting: z.boolean().refine(val => val === true, "You must understand pre-start meeting requirements"),

  // Safety Documentation
  readSafetyBooklet: z.boolean().refine(val => val === true, "You must confirm reading the safety booklet"),
  understandSMP: z.boolean().refine(val => val === true, "You must confirm understanding the Site Management Plan"),
})

type FormData = z.infer<typeof formSchema>

const trades = [
  "Carpenter",
  "Electrician", 
  "Plumber",
  "Painter",
  "Concreter",
  "Roofer",
  "Tiler",
  "Landscaper",
  "General Labourer",
  "Other"
]

const positions = [
  "Site Supervisor",
  "Foreman",
  "Team Leader",
  "Apprentice",
  "Tradesperson",
  "General Worker",
  "Safety Officer",
  "Quality Controller",
  "Other"
]

const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

const relationships = ["Spouse", "Parent", "Child", "Sibling", "Friend", "Other"]

export default function WorkerInductionPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)
  const [hasViewedDocument, setHasViewedDocument] = React.useState(false)
  const [contractors, setContractors] = React.useState<ContractorOption[]>([])
  const [contractorsLoading, setContractorsLoading] = React.useState(true)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      allergies: "",
      contractorId: "",
      position: "",
      trade: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelationship: "",
      highRiskLicense: false,
      safeWorkTiltJobs: false,
      otherLicense: false,
      otherLicenseDetails: "",
      noAlcoholDrugs: false,
      electricalEquipment: false,
      hazardousSubstances: false,
      usePPE: false,
      highRiskWorkMeeting: false,
      appropriateSignage: false,
      noUnauthorizedVisitors: false,
      housekeeping: false,
      employerTraining: false,
      employerSWMS: false,
      discussedSWMS: false,
      preStartMeeting: false,
      readSafetyBooklet: false,
      understandSMP: false,
    },
  })

  // Load contractors on mount
  React.useEffect(() => {
    async function loadContractors() {
      const result = await getActiveContractors()
      if (result.success && result.contractors) {
        setContractors(result.contractors)
      }
      setContractorsLoading(false)
    }
    loadContractors()
  }, [])

  async function onSubmit(values: FormData) {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const result = await submitWorkerInduction({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobile: values.mobile,
        contractorId: values.contractorId,
        position: values.position,
        trade: values.trade,
        allergies: values.allergies,
        emergencyName: values.emergencyName,
        emergencyPhone: values.emergencyPhone,
        emergencyRelationship: values.emergencyRelationship,
        // Safety requirements
        noAlcoholDrugs: values.noAlcoholDrugs,
        electricalEquipment: values.electricalEquipment,
        hazardousSubstances: values.hazardousSubstances,
        usePPE: values.usePPE,
        highRiskWorkMeeting: values.highRiskWorkMeeting,
        appropriateSignage: values.appropriateSignage,
        noUnauthorizedVisitors: values.noUnauthorizedVisitors,
        housekeeping: values.housekeeping,
        employerTraining: values.employerTraining,
        employerSWMS: values.employerSWMS,
        discussedSWMS: values.discussedSWMS,
        preStartMeeting: values.preStartMeeting,
        readSafetyBooklet: values.readSafetyBooklet,
        understandSMP: values.understandSMP,
        // License info
        otherLicense: values.otherLicense,
        otherLicenseDetails: values.otherLicenseDetails,
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit induction')
      }
      setSubmitSuccess(true)
      
      // Reset form after successful submission
      form.reset()
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting the form')
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchHighRiskLicense = form.watch("highRiskLicense")
  const watchSafeWorkTiltJobs = form.watch("safeWorkTiltJobs")
  const watchOtherLicense = form.watch("otherLicense")

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-900 mb-2">Induction Complete!</h1>
              <p className="text-green-700 mb-6">
                Thank you for completing your worker induction. Your information has been successfully submitted.
              </p>
              <p className="text-green-600 text-sm">
                You will receive a confirmation email shortly with your induction details.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Worker Induction Form</h1>
          <p className="text-gray-600 mt-2">Please complete all sections to begin your site induction</p>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 induction-form">
            
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="0400 000 000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies or Medical Concerns</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please list any allergies, medical conditions, or concerns that may affect your work safety"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This information helps us ensure your safety on site
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="contractorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company/Employer *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={contractorsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue 
                              placeholder={contractorsLoading ? "Loading contractors..." : "Select your employer"} 
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contractors.map((contractor) => (
                            <SelectItem key={contractor.value} value={contractor.value}>
                              {contractor.label}
                              {contractor.abn && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  (ABN: {contractor.abn})
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {positions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trade *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your trade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {trades.map((trade) => (
                              <SelectItem key={trade} value={trade}>
                                {trade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>


            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Emergency contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="0400 000 000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="emergencyRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationships.map((relationship) => (
                            <SelectItem key={relationship} value={relationship}>
                              {relationship}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Bayside Builders WA Safety Documentation */}
            <Card>
              <CardHeader>
                <CardTitle>Bayside Builders WA Safety Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Induction & Site Safety Booklet</h4>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Open the induction booklet
                          window.open('/induction-booklet', '_blank')
                          setHasViewedDocument(true)
                        }}
                      >
                        📄 View Induction Booklet (Required)
                      </Button>
                      
                      {!hasViewedDocument && (
                        <p className="text-sm text-amber-600 font-medium">
                          ⚠️ You must view the induction booklet before proceeding with the form
                        </p>
                      )}
                      
                      {hasViewedDocument && (
                        <p className="text-sm text-green-600 font-medium">
                          ✅ Induction booklet viewed - you may now proceed
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`space-y-6 max-w-4xl mx-auto ${!hasViewedDocument ? 'opacity-50 pointer-events-none' : ''}`}>
                    <FormField
                      control={form.control}
                      name="readSafetyBooklet"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              disabled={!hasViewedDocument}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm leading-relaxed">
                              I have read a copy of the BAYSIDE BUILDERS WA Induction & Site Safety Booklet and state that I understand its contents and agree to accept the direction of the BAYSIDE BUILDERS WA Supervisors in pursuit of a hazard free work environment *
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="understandSMP"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              disabled={!hasViewedDocument}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm leading-relaxed">
                              I understand that BAYSIDE BUILDERS WA will have a site specific management plan available on each site and it is my responsibility to ensure that I am familiar with the contents of the SMP upon arrival to site *
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bayside Builders WA Site Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Bayside Builders WA Site Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-center">
                  The following list of rules are non negotiable across all BAYSIDE BUILDERS WA sites. Please confirm that you understand and agree to abide by these rules.
                </p>
                
                <div className={`space-y-6 max-w-4xl mx-auto ${!hasViewedDocument ? 'opacity-50 pointer-events-none' : ''}`}>
                  {!hasViewedDocument && (
                    <p className="text-sm text-amber-600 font-medium mb-6 text-center">
                      ⚠️ Please view the Safety Documentation above before completing this section
                    </p>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="noAlcoholDrugs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I understand that Alcohol and Drugs are not permitted to be consumed on BAYSIDE BUILDERS WA sites and that I am under no circumstances to enter site or undertake works whilst under the influence of Alcohol and/or Drugs *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="electricalEquipment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I acknowledge my responsibility to ensure all electrical equipment is maintained in good operating order and tagged in accordance with Reg 3.63. of the OSH Regulations 1996 *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hazardousSubstances"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I understand that all hazardous substances being brought on to site are to have an MSDS *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usePPE"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I confirm that I will use PPE when necessary to reduce the risk of exposure to certain hazards *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="highRiskWorkMeeting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I understand that all high risk work must have a SWMS / JSA / Pre-start Meeting *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appropriateSignage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I agree to display appropriate signage whilst Nail Guns & explosive power tools are in use *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noUnauthorizedVisitors"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I understand visitors are not permitted onsite unless completed an induction or given approval by Supervisor *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="housekeeping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I acknowledge my responsibility in regard to Housekeeping and agree to maintain a tidy work area at all times *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Employer Safety Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Employer Safety Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-center">
                  Confirmation that your company has provided you with safety requirements inline with all OHS and Worksafe standards
                </p>
                
                <div className={`space-y-6 max-w-4xl mx-auto ${!hasViewedDocument ? 'opacity-50 pointer-events-none' : ''}`}>
                  {!hasViewedDocument && (
                    <p className="text-sm text-amber-600 font-medium mb-6 text-center">
                      ⚠️ Please view the Safety Documentation above before completing this section
                    </p>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="employerTraining"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I confirm that my employer has provided me with the relevant training required to undertake my specific work duties *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employerSWMS"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I confirm that my employer has provided me with all relevant SWMS & JSAs required for undertaking any high risk works *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discussedSWMS"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            I confirm that my employer and I have discussed and agreed the content of relevant SWMS & JSAs *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preStartMeeting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!hasViewedDocument}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm leading-relaxed">
                            Where appropriate I understand the need to undertake a pre-start meeting to discuss relevant site specific hazards in conjunction with the SWMS & JSAs *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Licenses & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Licenses & Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {/* White Card - Mandatory */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">White Card (Required)</h3>
                        <p className="text-sm text-gray-700">Construction Induction Training - Mandatory for all site workers</p>
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <label htmlFor="white-card-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-gray-900">Upload White Card</span>
                            <span className="block text-xs text-gray-600 mt-1">PNG, JPG, PDF up to 10MB</span>
                          </label>
                          <input id="white-card-upload" name="white-card-upload" type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* High Risk License */}
                  <FormField
                    control={form.control}
                    name="highRiskLicense"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-lg">
                        <div className="space-y-1">
                          <FormLabel>High Risk License</FormLabel>
                          <FormDescription>
                            Working at heights, confined spaces, etc.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchHighRiskLicense && (
                    <div className="ml-6 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <label htmlFor="high-risk-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-gray-900">Upload High Risk License</span>
                            <span className="block text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</span>
                          </label>
                          <input id="high-risk-upload" name="high-risk-upload" type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Safe Work on Tilt Jobs */}
                  <FormField
                    control={form.control}
                    name="safeWorkTiltJobs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-lg">
                        <div className="space-y-1">
                          <FormLabel>Safe Work on Tilt Jobs</FormLabel>
                          <FormDescription>
                            Tilt panel and precast concrete work certification
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchSafeWorkTiltJobs && (
                    <div className="ml-6 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <label htmlFor="tilt-work-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-gray-900">Upload Tilt Work Certificate</span>
                            <span className="block text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</span>
                          </label>
                          <input id="tilt-work-upload" name="tilt-work-upload" type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other Professional License */}
                  <FormField
                    control={form.control}
                    name="otherLicense"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 p-4 border rounded-lg">
                        <div className="space-y-1">
                          <FormLabel>Other Professional License</FormLabel>
                          <FormDescription>
                            Any additional licenses or certifications
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchOtherLicense && (
                    <div className="ml-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="otherLicenseDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please specify other license details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your other professional licenses or certifications"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-2">
                            <label htmlFor="other-license-upload" className="cursor-pointer">
                              <span className="text-sm font-medium text-gray-900">Upload Other License</span>
                              <span className="block text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</span>
                            </label>
                            <input id="other-license-upload" name="other-license-upload" type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Induction Form'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}