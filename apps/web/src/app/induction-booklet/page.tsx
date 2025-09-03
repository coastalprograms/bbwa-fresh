"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

// Document Header Component
const DocumentHeader = ({ title }: { title: string }) => (
  <div className="border-b-2 border-gray-800 pb-4 mb-8">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src="/Logo Icon.png" alt="Bayside Builders WA" width={60} height={60} />
        <div>
          <h1 className="text-xl font-bold text-gray-800">BAYSIDE BUILDERS WA</h1>
          <p className="text-sm text-gray-600">Professional Construction Services</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">Updated October 2022</p>
      </div>
    </div>
  </div>
)

// Document Footer Component
const DocumentFooter = ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
  <div className="border-t border-gray-300 pt-4 mt-8">
    <div className="flex justify-between items-center text-xs text-gray-500">
      <span>Bayside Builders WA Induction Booklet</span>
      <span>Page {pageNumber} of {totalPages}</span>
      <span>October 2022</span>
    </div>
  </div>
)

// Document Page Component
const DocumentPage = ({ 
  title, 
  pageNumber, 
  totalPages, 
  children,
  addSpacing = false,
  extraSpacing = false,
  maxSpacing = false
}: { 
  title: string;
  pageNumber: number;
  totalPages: number;
  children: React.ReactNode;
  addSpacing?: boolean;
  extraSpacing?: boolean;
  maxSpacing?: boolean;
}) => (
  <div className="bg-white shadow-lg rounded-none border border-gray-300 p-12 min-h-[842px] max-w-full mx-auto">
    <DocumentHeader title={title} />
    <div className="min-h-[600px]">
      {children}
      {addSpacing && <div className="mt-32" />}
      {extraSpacing && <div className="mt-96" />}
      {maxSpacing && <div className="mt-[600px]" />}
    </div>
    <DocumentFooter pageNumber={pageNumber} totalPages={totalPages} />
  </div>
)

export default function InductionBookletPage() {
  const totalPages = 20;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page 1: Title Page */}
        <DocumentPage title="Induction & Site Safety Booklet" pageNumber={1} totalPages={totalPages} extraSpacing={true}>
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">INDUCTION & SITE SAFETY BOOKLET</h1>
              <h2 className="text-2xl font-semibold text-gray-600">BAYSIDE BUILDERS WA</h2>
            </div>
          </div>
        </DocumentPage>

        {/* Page 2: Table of Contents */}
        <DocumentPage title="Table of Contents" pageNumber={2} totalPages={totalPages} addSpacing={true}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">TABLE OF CONTENTS</h2>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Introduction</span>
              <span>3</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Work Health & Safety Policy</span>
              <span>4</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Environmental Policy</span>
              <span>6</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Injury Management Policy</span>
              <span>6</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Risk Management</span>
              <span>7</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Safe Work Method Statement (SWMS) & Job Safety Analysis (JSA)</span>
              <span>8</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Incident Reporting & Investigation</span>
              <span>10</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Role Responsibilities & Duties</span>
              <span>11</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Director</span>
              <span>11</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Employees</span>
              <span>11</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Site Supervisor/Manager</span>
              <span>12</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Subcontractors</span>
              <span>13</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Behaviour</span>
              <span>14</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Consultation</span>
              <span>14</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Pre-start Hazard Assessment</span>
              <span>15</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Training & Licensing</span>
              <span>15</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Bayside Builders WA Construction Site Rules</span>
              <span>16</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Alcohol & Drugs</span>
              <span>16</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Alterations</span>
              <span>16</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Amenities</span>
              <span>17</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Communication</span>
              <span>17</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Electrical hazards</span>
              <span>17</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Emergency Response</span>
              <span>17</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Excavations & Trenches</span>
              <span>18</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>First aid</span>
              <span>18</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Hand Tools, Electrical Tools & Extension Leads</span>
              <span>18</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Hazards</span>
              <span>18</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Hazardous Substances</span>
              <span>18</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Hot Work, Welding & Cutting Equipment</span>
              <span>18</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Housekeeping</span>
              <span>19</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Incident Management</span>
              <span>19</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Ladders</span>
              <span>19</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Licences</span>
              <span>19</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Manual Handling</span>
              <span>19</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Mobile Phones & Devices</span>
              <span>19</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Nail Guns & Explosive Powered Tools</span>
              <span>20</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Penetrations</span>
              <span>20</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Personal Protective Equipment (PPE) & Clothing</span>
              <span>20</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Plant</span>
              <span>20</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Public Safety</span>
              <span>20</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Residual Current Devices (RCDs or &apos;Safety Switches&apos;)</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Scaffolds</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Site Safety Signs</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Site Security</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Subcontractor Equipment</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Traffic Management</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>UV Protection</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Visitors</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Working Alone</span>
              <span>21</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span>Working At Height</span>
              <span>21</span>
            </div>
          </div>
        </DocumentPage>

        {/* Page 3: Introduction */}
        <DocumentPage title="Introduction" pageNumber={3} totalPages={totalPages} addSpacing={true}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">INTRODUCTION</h2>
          
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              The information contained in this Induction booklet applies to all personnel and Subcontractors, including self-employed individuals, engaged by Bayside Builders WA. All Bayside Builders WA personnel, Subcontractors and their workers are required to read and understand the requirements outlined in this Induction booklet and acknowledge this by signing the Acknowledgement at the conclusion of this document before being engaged by Bayside Builders WA and undertaking any work on Bayside Builders WA construction sites.
            </p>
            
            <p>
              This document serves as a reminder of fundamental health and safety considerations. It does not attempt to address all situations or cover every safety and health requirement. Personnel working for Bayside Builders WA and Subcontractors must contact their Bayside Builders WA Site Supervisor/Manager whenever a safety issue emerges that they cannot properly manage independently.
            </p>
            
            <p>
              Bayside Builders WA personnel and Subcontractors have a responsibility to identify potential workplace hazards, assess the associated risks and develop controls to eliminate those risks. All personnel must comply with the site WHS rules. All safety requirements are mandatory unless modifications are approved following proper risk assessment.
            </p>

            <p>
              This Induction booklet was developed with reference to the Western Australian Work Health & Safety Act (2020) and Work Health & Safety (General) Regulations (2022), relevant codes of practice and industry standards.
            </p>

            <div className="mt-6">
              <p className="font-medium mb-3">The objectives of the Bayside Builders WA Work Health & Safety Management System are:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide a work environment where personnel and Subcontractors can perform their duties while remaining free from harm or injury.</li>
                <li>To provide consultation mechanisms that support personnel and Subcontractors in enhancing health and safety standards.</li>
                <li>To assist personnel and Subcontractors in identifying and reducing risks associated with Bayside Builders WA operations.</li>
                <li>To minimise the impact of our activities on the environment.</li>
                <li>To comply with applicable legislation, industry standards and site-specific requirements.</li>
                <li>To assist in ensuring continuity of paid employment for all our personnel and Subcontractors.</li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">BEFORE COMMENCING WORK ON A BAYSIDE BUILDERS WA SITE</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Familiarise yourself with site safety policies and procedures.</li>
                <li>Identify and become familiar with emergency procedures, escape routes and muster points.</li>
                <li>In the event that there are no specific or planned escape routes, you should:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Determine at least one, preferably two, safe escape routes from your work area.</li>
                    <li>Ensure that other personnel on site are aware of your presence.</li>
                    <li>Identify emergency contact information for the site, including:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li>Site address</li>
                        <li>Nearest major intersection</li>
                        <li>Nearest medical facilities, such as hospitals or local doctors, including contact numbers</li>
                        <li>Contact details of site supervisor/manager</li>
                        <li>Contact details of site safety representative</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
              <p className="mt-4 italic">If this information is unavailable, contact the Bayside Builders WA Site Supervisor/Manager for assistance.</p>
            </div>
          </div>
        </DocumentPage>

        {/* Page 4: BAYSIDE BUILDERS WA POLICIES */}
        <DocumentPage title="BAYSIDE BUILDERS WA POLICIES" pageNumber={4} totalPages={totalPages} addSpacing={true}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">BAYSIDE BUILDERS WA POLICIES</h2>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Work Health & Safety Policy</h3>
              <div className="space-y-3">
                <p>
                  Bayside Builders WA is fully committed to the principles of Work Health & Safety and the provision of a safe and healthy work environment for all staff, Subcontractors and visitors.
                </p>
                <p>
                  Additionally, Bayside Builders WA has an obligation to comply with relevant legislation, particularly the Western Australian Work Health & Safety Act (2020) and Work Health & Safety (General) Regulations (2022) which extend to personnel, contractors and visitors to Bayside Builders WA workplaces.
                </p>
                <p>
                  Bayside Builders WA supports meaningful and effective consultation with personnel, contractors and other stakeholders, whose input is encouraged and incorporated into the decision-making processes regarding Health & Safety matters and observes relevant Codes of Practice, which must be followed unless a better approach is documented and adopted.
                </p>
                <p>
                  Bayside Builders WA recognises that WHS is everyone&apos;s responsibility; therefore, all of our personnel and contractors have a duty of care to ensure the safety of themselves and others. The Bayside Builders WA Safety Management System outlines the specific WHS responsibilities of management, personnel and Subcontractors.
                </p>
                <p>
                  Bayside Builders WA will promote a proactive approach to health and safety and regularly review health and safety performance to monitor the effectiveness of health and safety actions.
                </p>

                <div className="mt-4">
                  <h4 className="text-base font-semibold text-gray-800 mb-2">Work Health & Safety Objectives</h4>
                  <p className="mb-2">Bayside Builders WA will ensure compliance with legislation, industry standards and best practice by:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Providing a work environment where personnel and Subcontractors can conduct their work and remain free from harm or injury.</li>
                    <li>Providing consultation mechanisms that support personnel and Subcontractors in improving safety and health standards.</li>
                    <li>Assisting personnel in identifying and reducing risks associated with Bayside Builders WA operations.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Environmental Policy</h3>
              <div className="space-y-3">
                <p>
                  The Bayside Builders WA vision is to cause no harm to the environment and to continually improve our environmental performance by incorporating sound environmental practices as part of our construction activities.
                </p>
                <p className="font-medium">To accomplish this goal, Bayside Builders WA policy is to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Ensure daily activities are undertaken in a manner that encourages sustainable development, including pollution prevention, waste reduction, and the prevention of any discharge to atmosphere, land or water.</li>
                  <li>Pursue environmental performance that exceeds (where practicable) regulatory requirements and industry standards to which Bayside Builders WA subscribes.</li>
                  <li>Enhance communications by ensuring this policy is available to all clients, staff, Subcontractors and the public. Maintain and regularly review this policy and its objectives on a regular basis.</li>
                  <li>Provide assistance to, and encourage, our Subcontractors to develop and employ environmentally responsible practices.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Injury Management Policy</h3>
              <div className="space-y-3">
                <p>
                  Bayside Builders WA is committed to assisting injured workers to return to work as soon as medically appropriate and will adhere to the requirements of the Workers&apos; Compensation & Injury Management Act (1981) in the event of a work-related injury or illness.
                </p>
                <p>
                  Management supports the injury management process and recognises that success relies on the active participation and cooperation of the injured worker. Whenever possible, suitable duties will be arranged internally, having regard for the injured worker&apos;s medical restrictions.
                </p>
              </div>
            </div>
          </div>
        </DocumentPage>

        {/* Page 5: RISK MANAGEMENT */}
        <DocumentPage title="Risk Management" pageNumber={5} totalPages={totalPages}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">RISK MANAGEMENT</h2>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              The identification of hazards in the workplace involves consideration of the situations, events or circumstances that may cause injury, illness or damage. Identification includes the type of injury, illness or damage possible, how work is organised and managed, and the tools and equipment being used.
            </p>
            
            <div>
              <p className="font-medium mb-2">Bayside Builders WA may use various tools to identify hazards including:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Pre-Start Safety Checklist</li>
                <li>Consultation with personnel and contractors</li>
                <li>Regular inspections</li>
                <li>Investigations of accidents</li>
                <li>Job Safety Analysis or Safe Work Method Statements</li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Safe Work Method Statement (SWMS) & Job Safety Analysis (JSA)</h3>
              
              <div className="space-y-4">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A SWMS or JSA is required to be submitted by all Subcontractors to Bayside Builders WA prior to commencement of any works. Contact Bayside Builders WA as required for guidance on the development of the SWMS/JSA in the approved format.</li>
                  <li>If an unforeseen situation arises where there is potential for an accident or incident to cause harm or damage, you must conduct a risk assessment as follows:</li>
                </ul>
                
                <div className="mt-6">
                  <p className="font-medium mb-3">Using the following Risk Matrix, determine the level of risk associated with the activity:</p>
                  <div className="border border-gray-300">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Consequence (severity of injury or damage)</th>
                          <th className="border border-gray-300 p-2">LIKELY</th>
                          <th className="border border-gray-300 p-2">MODERATE</th>
                          <th className="border border-gray-300 p-2">UNLIKELY</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2 font-medium">HIGH (1)</td>
                          <td className="border border-gray-300 p-2 bg-red-100 text-center">HIGH (1)</td>
                          <td className="border border-gray-300 p-2 bg-red-100 text-center">HIGH (1)</td>
                          <td className="border border-gray-300 p-2 bg-yellow-100 text-center">MEDIUM (2)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-medium">MEDIUM (2)</td>
                          <td className="border border-gray-300 p-2 bg-red-100 text-center">HIGH (1)</td>
                          <td className="border border-gray-300 p-2 bg-yellow-100 text-center">MEDIUM (2)</td>
                          <td className="border border-gray-300 p-2 bg-green-100 text-center">LOW (3)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 font-medium">LOW (3)</td>
                          <td className="border border-gray-300 p-2 bg-yellow-100 text-center">MEDIUM (2)</td>
                          <td className="border border-gray-300 p-2 bg-green-100 text-center">LOW (3)</td>
                          <td className="border border-gray-300 p-2 bg-green-100 text-center">LOW (3)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold mb-2">Consequence:</h5>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                      <li><strong>HIGH (1)</strong> - Potential death, permanent disability or major structural failure or damage. Offsite environmental discharge/release not contained and significant long-term environmental harm.</li>
                      <li><strong>MEDIUM (2)</strong> - Potential temporary disability or minor structural failure or damage. Onsite environmental discharge/release contained, minor remediation required, short-term environmental harm.</li>
                      <li><strong>LOW (3)</strong> - Incident that has the potential to cause persons to require first aid. Onsite environmental discharge/release immediately contained, minor level clean-up with no short-term environmental harm.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Likelihood:</h5>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                      <li><strong>LIKELY</strong> - Could happen frequently</li>
                      <li><strong>MODERATE</strong> - Could happen occasionally</li>
                      <li><strong>UNLIKELY</strong> - May occur only in exceptional circumstances</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-2">Ranking:</h5>
                    <div className="space-y-3 text-xs">
                      <div>
                        <strong>HIGH (1)</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Will require detailed pre-planning and ongoing operational monitoring</li>
                          <li>SWMS/JSA to be completed. Worker input required. Procedure may be prepared.</li>
                          <li>Consider if hazard can be removed or substituted</li>
                          <li>Discuss with workers at toolbox meeting</li>
                        </ul>
                      </div>
                      <div>
                        <strong>MEDIUM (2)</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Will require site-specific operational planning</li>
                          <li>SWMS or JSA to be completed – worker input required</li>
                          <li>Discuss with workers at toolbox meeting</li>
                        </ul>
                      </div>
                      <div>
                        <strong>LOW (3)</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Will require localised control measures</li>
                          <li>Discuss with workers at toolbox meeting or one-on-one</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="font-medium mb-2">Subcontractors will be required as part of their contract of employment to complete JSA forms when:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                      <li>Tasks are considered to be medium or high risk.</li>
                      <li>There are new or modified tasks (deviation from standard work procedures).</li>
                      <li>Infrequent tasks.</li>
                      <li>Tasks have previously resulted in injury or damage.</li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </DocumentPage>

        {/* Page 6: WHS Regulations - SWMS/JSA Requirements */}
        <DocumentPage title="WHS Regulations - SWMS/JSA Requirements" pageNumber={6} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <p className="font-medium mb-4">The Western Australian WHS regulations require a SWMS or JSA to be conducted for the following work activities:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Construction work involving a risk of a person falling two metres or more.</li>
                <li>Construction work on telecommunications towers.</li>
                <li>Construction work involving demolition.</li>
                <li>Construction work involving removing or disturbing asbestos.</li>
                <li>Construction work involving alteration to a structure that requires the structure to be temporarily supported to prevent its collapse.</li>
                <li>Construction work involving a confined space.</li>
                <li>Construction work involving excavation to a depth of more than 1.5 metres.</li>
                <li>The construction of tunnels.</li>
                <li>Construction work involving the use of explosives.</li>
                <li>Construction work on or near pressurised gas pipes (including distribution mains).</li>
                <li>Construction work on or near chemical, fuel or refrigerant lines.</li>
                <li>Construction work on or near energised electrical installations and lines (whether overhead or underground).</li>
                <li>Construction work in an area that may have a contaminated or flammable atmosphere.</li>
                <li>Construction work involving tilt-up or precast concrete.</li>
                <li>Construction work on or adjacent to roads or railways that are in use.</li>
                <li>Work on a construction site where there is movement of powered mobile plant.</li>
                <li>Construction work in an area where there are artificial extremes of temperature.</li>
                <li>Construction work in, over or adjacent to water or other liquids if there is a risk of drowning.</li>
                <li>Construction work involving diving.</li>
              </ul>
            </div>
          </div>
        </DocumentPage>

        {/* Page 7: INCIDENT REPORTING & INVESTIGATION */}
        <DocumentPage title="Incident Reporting & Investigation" pageNumber={7} totalPages={totalPages} addSpacing={true}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">INCIDENT REPORTING & INVESTIGATION</h2>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              All workplace incidents and injuries must be notified to the Bayside Builders WA Site Managers as soon as possible.
            </p>
            
            <p>
              The Site Manager shall determine the need to complete an &apos;Incident/Injury Report Form&apos; and/or undertake a formal incident investigation based on the circumstances of the incident/injury and/or the potential for the incident to cause greater harm.
            </p>

            <p className="font-medium">
              WorkSafe must be notified of the following types of injuries:
            </p>

            <div className="mt-4">
              <div className="border border-gray-300">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left w-1/3">Injury Type</th>
                      <th className="border border-gray-300 p-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment as an in-patient in a hospital</td>
                      <td className="border border-gray-300 p-2">
                        • Admission into a hospital as an in-patient for any duration, even if the stay is not overnight or longer.<br/>
                        • It does not include:<br/>
                        &nbsp;&nbsp;- Out-patient treatment provided by the emergency section of a hospital (i.e. not requiring admission as an in-patient)<br/>
                        &nbsp;&nbsp;- Admission for corrective surgery which does not immediately follow the injury (e.g. to fix a fractured nose).
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment for the amputation of any part of the body</td>
                      <td className="border border-gray-300 p-2">• Amputation of a limb such as arm or leg, body part such as hand, foot or the tip of a finger, toe, nose or ear.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment for a serious head injury</td>
                      <td className="border border-gray-300 p-2">
                        • Fractured skull, loss of consciousness, blood clot or bleeding in the brain, damage to the skull to the extent that it is likely to affect organ/face function.<br/>
                        • Head injuries resulting in temporary or permanent amnesia.<br/>
                        • It does not include a bump to the head resulting in a minor contusion or headache.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment for a serious eye injury</td>
                      <td className="border border-gray-300 p-2">
                        • Injury that results in or is likely to result in the loss of the eye or total or partial loss of vision.<br/>
                        • Injury that involves an object penetrating the eye (for example metal fragment, wood chip).<br/>
                        • Exposure of the eye to a substance which poses a risk of serious eye damage.<br/>
                        • It does not include eye exposure to a substance that merely causes irritation.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment for a serious burn</td>
                      <td className="border border-gray-300 p-2">
                        • A burn requiring intensive care or critical care which could require compression garment or a skin graft.<br/>
                        • It does not include a burn that merely requires washing the wound and applying a dressing.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DocumentPage>

        {/* Page 8: Injury Types & Role Definitions */}
        <DocumentPage title="Injury Types & Role Definitions" pageNumber={8} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div className="space-y-4">
              <div className="border border-gray-300">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left w-1/3">Injury Type</th>
                      <th className="border border-gray-300 p-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment for the separation of skin from an underlying tissue (such as de-gloving or scalping)</td>
                      <td className="border border-gray-300 p-2">
                        • Separation of skin from an underlying tissue such that tendon, bone or muscles are exposed (de-gloving or scalping).<br/>
                        • It does not include minor lacerations.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment for a spinal injury</td>
                      <td className="border border-gray-300 p-2">
                        • Injury to the cervical, thoracic, lumbar or sacral vertebrae including the discs and spinal cord.<br/>
                        • It does not include acute back strain.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment for the loss of a bodily function</td>
                      <td className="border border-gray-300 p-2">
                        • Loss of consciousness, loss of movement of a limb or loss of the sense of smell, taste, sight or hearing, or loss of function of an internal organ.<br/>
                        • It does not include mere fainting or a sprain or strain.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Immediate treatment for serious lacerations</td>
                      <td className="border border-gray-300 p-2">
                        • Deep or extensive cuts that cause muscle, tendon, nerve or blood vessel damage or permanent impairment.<br/>
                        • Deep puncture wounds.<br/>
                        • Tears of wounds to the flesh or tissues - this may include stitching to prevent loss of blood and/or other treatment to prevent loss of bodily function and/or infection.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Medical treatment within 48 hours of exposure to a substance</td>
                      <td className="border border-gray-300 p-2">
                        • &apos;Medical treatment&apos; is treatment provided by a doctor.<br/>
                        • Exposure to a substance includes exposure to chemicals, airborne contaminants and exposure to human and/or animal blood and body substances.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Injury or illness in a remote location that required urgent transfer to a medical facility for treatment</td>
                      <td className="border border-gray-300 p-2">
                        • Includes any injury or illness not specified previously that cannot be treated at or near the site of the incident;<br/>
                        • A remote location is any location that is not served by ordinary ambulance services, and may include mines and offshore facilities, rail camps, geological surveys, and isolated holiday facilities;<br/>
                        • A medical facility includes a hospital and any other facility that provides medical services.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium align-top">Injury or illness that a medical practitioner considers likely to prevent the person from being able to do their normal work for at least 10 days</td>
                      <td className="border border-gray-300 p-2">
                        • Captures any illness or injury not specified previously that prevents a person from doing their normal work for at least 10 days;<br/>
                        • This determination may only be made by a medical practitioner and may be in the form of a medical certificate or letter;<br/>
                        • Notification must be provided even if the worker is capable of light duties (e.g. a warehouse worker who is moved to desk duties for the duration of their recovery).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ROLE DEFINITIONS, RESPONSIBILITIES & DUTIES</h3>
              <h4 className="text-base font-semibold text-gray-800 mb-3">Organizational Structure</h4>
              <div className="text-center space-y-2 text-xs font-mono">
                <div>Director</div>
                <div>(Master Builders)</div>
                <div>|</div>
                <div>Administration</div>
                <div>|</div>
                <div>Employee - Contracts Administrator</div>
                <div>|</div>
                <div>Employee Project Manager</div>
                <div>|</div>
                <div>Site Supervisors</div>
                <div>|</div>
                <div>Sub Contractors & WHS Representative</div>
                <div>|</div>
                <div>Sub-tier & Subcontractor Employees</div>
              </div>
            </div>
          </div>
        </DocumentPage>

        {/* Page 9: Role Definitions and Responsibilities */}
        <DocumentPage title="Role Definitions and Responsibilities" pageNumber={9} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Director</h3>
              <p>
                The Director is responsible, to the extent that they have control, for the provision and maintenance of a safe and healthy working environment and safe work practices.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Employees</h3>
              <p className="mb-3">
                Personnel are required to comply with the Bayside Builders WA Safety Management Plan (SMP), safety and health policies, procedures and instructions to ensure their own safety and health and the safety and health of others at Bayside Builders WA work sites. All incidents must be reported to the Site Manager. All personnel are also required to take corrective action to eliminate hazards at the workplace and/or report those hazards that are beyond their control to their immediate Supervisor.
              </p>
              <p>
                Bayside Builders WA personnel are also responsible for obtaining a Construction Induction/White Card. If personnel have been issued with PPE from Bayside Builders WA, they must be instructed in the care, use and maintenance of all equipment.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Site Supervisor/Manager</h3>
              <p className="mb-3">
                Each Bayside Builders WA Site Supervisor/Manager is responsible and accountable for taking all reasonably practicable measures to ensure that the work environment under their control is safe and without risk to health by ensuring that:
              </p>
              
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>The site-specific safety management plan is implemented; hazards are identified, assessed and controlled; and high-risk environments are reported to the Director.</li>
                <li>Substances are used properly, and plant/equipment is in safe working order and is maintained to a high standard.</li>
                <li>Information, induction and on-the-job safety training is provided and that safe working procedures are clearly understood and consistently observed.</li>
                <li>Safe Work Method Statements (SWMS) and/or Job Safety Analysis (JSA) are supplied by all Subcontractors carrying out work on site on behalf of Bayside Builders WA and on completion of the job forwarded to Head Office.</li>
                <li>All SWMS/JSA&apos;s are reviewed by persons conducting the task and any other persons who may be placed in a hazardous situation.</li>
                <li>Safe work procedures and SWMS/JSA&apos;s are followed.</li>
                <li>Regular workplace inspections are carried out and recorded.</li>
                <li>All applicable legislation, standards, guidance notes and codes of practice are complied with.</li>
                <li>All onsite personnel follow instructions and do not put others at risk.</li>
                <li>The workplace is monitored to identify any unsafe or unhealthy conditions or behaviour.</li>
                <li>Regular toolbox meetings are held.</li>
                <li>Necessary documentation in relation to identification of hazards on site and implement appropriate controls are completed.</li>
                <li>Personnel and Subcontractors are consulted and communicated with, in relation to managing health and safety on site.</li>
                <li>Incidents are investigated to thoroughly identify the contributing factors, and initiate improvements required to prevent recurrence.</li>
                <li>Controls are implemented in relation to hazards reported by personnel and Subcontractors.</li>
                <li>Safety and health issues that are beyond their control are referred to the Director for attention. Site Managers will ensure that measures are in place as an interim action to mitigate the risks identified.</li>
              </ul>
            </div>
          </div>
        </DocumentPage>

        {/* Page 10: Subcontractors & Compliance */}
        <DocumentPage title="Subcontractors & Compliance" pageNumber={10} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Subcontractors</h3>
              <p className="mb-3">
                All Subcontractors engaged to perform work on Bayside Builders WA sites will, as part of their contract, comply with the Work Health & Safety Act (2020) and Work Health & Safety (General) Regulations (2022), Bayside Builders WA SMP and any other specified health and safety policies and procedures of Bayside Builders WA.
              </p>
              <p className="mb-3">
                Where Bayside Builders WA engages Subcontractors, any formal contract must include the requirement that the Subcontractor&apos;s personnel and/or their sub-tier contractors are provided with site-specific safety information and that workers observe safety directions from the Main Contractor.
              </p>
              <p className="mb-3">
                It is the responsibility of Bayside Builders WA Subcontractors to ensure that their personnel are made aware of this site-specific SMP and the requirements of the Bayside Builders WA &apos;Induction Booklet&apos;.
              </p>
              
              <p className="font-medium mb-3">All Bayside Builders WA Subcontractors (and their personnel) must:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Report to Bayside Builders WA Site Manager any situation which they have reason to believe could present a risk.</li>
                <li>Report any &apos;accident&apos; or injury to health which arises at a Bayside Builders WA work site.</li>
                <li>Use equipment appropriately and not interfere or misuse anything provided for their safety.</li>
                <li>Co-operate with management by following instructions and wearing protective clothing or equipment as provided and instructed.</li>
                <li>Complete the mandatory Construction Induction Course (White Card) as required by the Western Australian WHS Regulations.</li>
                <li>Supply and wear all PPE that is not provided by Bayside Builders WA. All PPE that is provided by Bayside Builders WA must be maintained in good working order and worn at all times as directed by either Legislation, signage or by Bayside Builders WA Site Managers.</li>
                <li>Prepare and submit to Bayside Builders WA a specific SWMS/JSA&apos;s for all high-risk construction work before starting work on site.</li>
                <li>Meet with a Bayside Builders WA representative prior to commencing any work on the project to discuss any WHS requirements, the Subcontractors SWMS/JSA&apos;s and any other specific information relating to the contractor&apos;s activities.</li>
                <li>Conduct activities and work in a safe and healthy manner and in accordance with the requirements of the Safety Management Plan, Inductions, WHS Legislation and applicable SWMS/JSA&apos;s.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Contractor Non-compliances</h3>
              <p className="mb-3">Bayside Builders WA will undertake the following course of action for identified non-conformances:</p>
              
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>For minor issues, the contractor will be given a verbal direction indicating what the issue is, what needs to occur and the level of safety that Bayside Builders WA expects.</li>
                <li>For major safety and health breaches or situations where there is imminent risk to a worker or other person, the Subcontractor will stop work and be issued with a written warning detailing the issue and controls expected. Work will only restart when adequate safety controls have been implemented.</li>
                <li>For ongoing safety and health non-conformances of a significant or high risk nature, contractors may be directed to cease work in accordance with a breach of the contract.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Behaviour</h3>
              <p>
                Bayside Builders WA does not tolerate any form of offensive behaviour, particularly harassment, bullying, discrimination, and vilification. Subcontractors are responsible for ensuring that they or their personnel and their subcontractors and their personnel do not harass, vilify or discriminate against any person on the basis of their sex, sexuality, marital status, pregnancy, race, intellectual or physical disability and age, and do not engage in any form of bullying behaviour.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Consultation</h3>
              <p className="mb-3">
                Bayside Builders WA promotes the active participation of all personnel in WHS decisions. Personnel and Subcontractors are consulted and given opportunity, encouragement and training to be proactively involved in WHS matters affecting the organisation and their work activities.
              </p>
              
              <p className="mb-2">Consultation occurs in reference to, but not limited to, the following subjects/topics:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Hazard identification and risk assessment processes;</li>
                <li>Control measures for the management of hazards and risks;</li>
                <li>Changes to the organisation&apos;s policies and procedures or work routines which may affect WHS.</li>
              </ul>
            </div>
          </div>
        </DocumentPage>

        {/* Page 11: Pre-start Assessment & Training */}
        <DocumentPage title="Pre-start Assessment & Training" pageNumber={11} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Pre-start Hazard Assessment</h3>
              <p>
                In order to ensure that potential hazards/risks are identified at the earliest possible opportunity, Bayside Builders WA has developed this Pre-start Hazard Assessment Procedure, which in conjunction with the other policies and procedures contained within the Safety Management Plan will help to create a safe work environment.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Site Inspections</h3>
              <p>
                Bayside Builders WA Site Supervisor/Manager will inspect the site to identify any hazards or unsafe practices. These shall be addressed and rectified as soon as practicable and a record of actions taken recorded on the site inspection report. A recognised industry auditor or association shall conduct on-site audits and safety inspections as requested.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Training & Licensing</h3>
              <p className="mb-3">All site workers are required to have the minimum training requirements:</p>
              
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs mb-4">
                <li>White card recognised within Western Australia.</li>
                <li>Trade qualifications for the work they are undertaking, or if undertaking an apprenticeship be under the direct supervision of a trade qualified (in the respective trade) person from the company they work for.</li>
              </ul>

              <div className="mt-4">
                <h4 className="text-base font-semibold text-gray-800 mb-2">Undertaking High Risk Work:</h4>
                <p className="mb-3">All Subcontractors whose workers are completing High Risk Work must ensure that:</p>
                
                <ul className="list-disc list-inside space-y-1 ml-4 text-xs mb-4">
                  <li>The individual is to have a current High-Risk Work Licence on their person for the activity being performed as per the licence class depicted; and</li>
                  <li>Be reflected within the JSA for the task/job being performed.</li>
                </ul>

                <p className="font-medium mb-3">The following are tasks that are deemed to be High Risk Work by WorkSafe WA:</p>
                <div className="border border-gray-300">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-1 text-left w-1/12">Code</th>
                        <th className="border border-gray-300 p-1 text-left w-5/12">Description</th>
                        <th className="border border-gray-300 p-1 text-left w-1/12">Code</th>
                        <th className="border border-gray-300 p-1 text-left w-5/12">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">LF</td>
                        <td className="border border-gray-300 p-1">Forklift Truck</td>
                        <td className="border border-gray-300 p-1 font-medium">LO</td>
                        <td className="border border-gray-300 p-1">Order-Picking Fork Lift Truck</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">DG</td>
                        <td className="border border-gray-300 p-1">Dogging</td>
                        <td className="border border-gray-300 p-1 font-medium">C1</td>
                        <td className="border border-gray-300 p-1">Slewing Mobile Crane up to & including 100 tonnes lifting capacity (includes C6, C2, CN & CV)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">RB</td>
                        <td className="border border-gray-300 p-1">Basic Rigging</td>
                        <td className="border border-gray-300 p-1 font-medium">RI</td>
                        <td className="border border-gray-300 p-1">Intermediate Rigging</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">RA</td>
                        <td className="border border-gray-300 p-1">Advanced Rigging</td>
                        <td className="border border-gray-300 p-1 font-medium">RAN</td>
                        <td className="border border-gray-300 p-1">Non-slewing Mobile Cranes (greater than 3 tonnes lifting capacity)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">SB</td>
                        <td className="border border-gray-300 p-1">Basic Scaffolding</td>
                        <td className="border border-gray-300 p-1 font-medium">SI</td>
                        <td className="border border-gray-300 p-1">Intermediate Scaffolding</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">CT</td>
                        <td className="border border-gray-300 p-1">Tower Cranes</td>
                        <td className="border border-gray-300 p-1 font-medium">C2</td>
                        <td className="border border-gray-300 p-1">Slewing mobile cranes (up to & including 20 tonnes lifting capacity) (includes CN & CV)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">CS</td>
                        <td className="border border-gray-300 p-1">Self-erecting Cranes</td>
                        <td className="border border-gray-300 p-1 font-medium">CD</td>
                        <td className="border border-gray-300 p-1">Derrick Cranes</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">CP</td>
                        <td className="border border-gray-300 p-1">Portal Boom Cranes</td>
                        <td className="border border-gray-300 p-1 font-medium">CV</td>
                        <td className="border border-gray-300 p-1">Vehicle loading Cranes (10 tonnes or greater lifting capacity)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">CB</td>
                        <td className="border border-gray-300 p-1">Bridge & Gantry Cranes</td>
                        <td className="border border-gray-300 p-1 font-medium">C6</td>
                        <td className="border border-gray-300 p-1">Slewing Mobile Cranes (up to & including 60 tonnes lifting capacity) (includes C2, CN & CV)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">CO</td>
                        <td className="border border-gray-300 p-1">Slewing Mobile Cranes (over 100 tonnes lifting capacity) (includes C1, C6, C2, CN & CV)</td>
                        <td className="border border-gray-300 p-1 font-medium">CN</td>
                        <td className="border border-gray-300 p-1">Non-slewing mobile Cranes (greater than 3 tonnes lifting capacity)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">HM</td>
                        <td className="border border-gray-300 p-1">Materials Hoists (Cantilever Platforms)</td>
                        <td className="border border-gray-300 p-1 font-medium">HP</td>
                        <td className="border border-gray-300 p-1">Hoists (personnel & materials) (includes HM)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-1 font-medium">PB</td>
                        <td className="border border-gray-300 p-1">Concrete Placing Booms</td>
                        <td className="border border-gray-300 p-1 font-medium">WP</td>
                        <td className="border border-gray-300 p-1">Boom type elevating work platforms (boom length 11 metres or greater)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </DocumentPage>

        {/* Page 12: Bayside Builders WA Site Rules */}
        <DocumentPage title="Bayside Builders WA Site Rules" pageNumber={12} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Alcohol & Drugs</h3>
              <p className="mb-2">
                Bayside Builders WA does not currently employ a formal alcohol and drugs testing regime, however they reserve the right to introduce such a program at the discretion of Bayside Builders WA management.
              </p>
              <p>
                Bayside Builders WA will consult with its personnel before introducing an alcohol and drugs testing program. All personnel and Subcontractors will be required to adhere to Bayside Builders WA testing policies and procedures.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Alterations</h3>
              <p>
                No person without specific approval is to alter or remove any plant, equipment or safety device on site. This includes but is not limited to scaffolds, handrails, barricades, signage, guards, penetration covers etc.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Amenities such as toilets and water will be provided on site. Please report damage or malfunctioning facilities to the Site Manager.</li>
                <li>The building under construction may be used to eat meals and provide shelter. Shelter may also be in the form of contractors&apos; vehicles.</li>
                <li>All food scraps, wrappers and containers are to be put into bins on site after each meal.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Communication</h3>
              <p className="mb-2">
                Clear communication is the key to improving safety, productivity, organisation and cost-effectiveness on the job. It&apos;s crucial to establish helpful communication methods for any construction site. Bayside Builders WA will utilise the following methods for communicating with personnel and contractors:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Daily pre-start meetings</li>
                <li>Email</li>
                <li>Phone calls and text messaging</li>
                <li>Radios</li>
                <li>In-person and toolbox meetings</li>
                <li>Signage and noticeboards (if applicable)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Electrical Hazards</h3>
              <p className="mb-2">Maintain the following safe clearances from live overhead power lines:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs mb-2">
                <li>1 metre from power lines up to 1000 volts,</li>
                <li>3 metres from power lines up to 33,000 volts, and</li>
                <li>6 metres from power lines over 33,000 volts.</li>
              </ul>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Locate any underground power lines prior to any excavation work (DBYD).</li>
                <li>All power lines are to be considered live unless otherwise advised.</li>
                <li>No piggy-back plugs or double adaptor are to be used on site.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Electrical Testing & Tagging</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>All portable electrical tools and equipment are to be inspected, tested and tagged in accordance with WHS (General) Regulations every 3 months.</li>
                <li>Workers are not to use untagged equipment.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Emergency Response</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>All site personnel are instructed during the site induction of site emergency procedures and information.</li>
                <li>Availability of first aid kits shall be established.</li>
                <li>The need for firefighting equipment shall be identified and if required installed and the location sign posted.</li>
                <li>Emergency contact information shall be established and made available.</li>
                <li>Muster points are established and sign posted as required.</li>
              </ul>
            </div>
          </div>
        </DocumentPage>

        {/* Page 13: Subcontractor Responsibilities */}
        <DocumentPage title="Site Safety Rules Continued" pageNumber={13} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Excavations & Trenches</h3>
              <p className="mb-2">
                Excavation and trenching works should be conducted in accordance with the WA Code of Practice, &apos;Excavation&apos;. This code outlines accepted safe practices and recommendations for excavation work in Western Australia.
              </p>
              <p className="mb-2">
                The WA WHS Regulations identifies excavation work over 1.5 metres deep to be a high-risk work activity and therefore a SWMS/JSA must be developed and excavation permit obtained for this work activity prior to commencement of excavation works.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>A competent person at the start of every shift must inspect excavations, after any accidental collapse or event likely to have affected its stability and on an ongoing basis.</li>
                <li>Excavations below 1.5m must be shored, benched, battered or assessed as self-supporting by a competent person.</li>
                <li>Make sure the excavation is protected with barriers.</li>
                <li>Safe access/egress must be provided.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">First Aid</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>All workers are required to have access to a suitable first aid kit at all times.</li>
                <li>Any injuries requiring medical treatment MUST be reported to the Site Manager as soon as possible, but within no more than 24 hours.</li>
                <li>Bayside Builders WA recommends that all construction subcontractors have at least one person within their team that has completed an accredited First Aid training course.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hand Tools, Electrical Tools & Extension Leads</h3>
              <p className="mb-2">All hand and electrical tools must be in serviceable condition and suitable for the task.</p>
              <p className="mb-2">Extension leads shall not be longer than 30 metres or joined together to extend further than 30 metres in total length.</p>
              <p className="mb-2">Extension leads are to be raised off the ground in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs mb-3">
                <li>Extension leads are exposed to pooled or flowing water.</li>
                <li>Extension leads are exposed to vehicle traffic, pedestrian traffic, or potential damage.</li>
                <li>Extension leads are out of site of the user.</li>
              </ul>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Tool guards shall not be removed or modified under any circumstances.</li>
                <li>Appropriate personal protective equipment is to be used at all times.</li>
                <li>Domestic extension leads, power boards or double adaptors are not permitted on Bayside Builders WA sites.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hazards</h3>
              <p className="mb-2">All hazards are to be controlled in accordance with:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs mb-3">
                <li>All Western Australia Work Health & Safety Regulations.</li>
                <li>All relevant &apos;Standards Australia&apos; Codes of Practice.</li>
                <li>Accepted industry standards and recognised guidance materials.</li>
              </ul>
              <p className="mb-2">Any hazards that you are unable to control MUST be reported to the Site Manager.</p>
              <p className="mb-2">Where a hazard presents an imminent risk then the situation MUST be made safe immediately and the Site Manager advised. This may include, but not be limited to the following:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs mb-2">
                <li>Barricade the hazard or hazardous area off.</li>
                <li>Warn other personnel on site.</li>
                <li>Cease use of affected plant or tools and tag &apos;Out of Service&apos;.</li>
              </ul>
              <p className="text-xs">Follow the guidelines of Material Safety Data Sheets (MSDS/SDS) where a hazardous substance is involved.</p>
            </div>
          </div>
        </DocumentPage>

        {/* Page 14: Site Safety Procedures */}
        <DocumentPage title="Site Safety Procedures" pageNumber={14} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hazardous Substances</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Make sure an Australian issued Material Safety Data Sheet (MSDS/SDS) that has been revised within the past 5 years is provided to the Bayside Builders WA Site Manager before bringing any hazardous substances on to site, e.g. Solvents, adhesives, sealants.</li>
                <li>The requirements of the MSDS/SDS are to be complied with at all times when using hazardous substances.</li>
                <li>Do not store more of a hazardous substance on site than what you need for the job.</li>
                <li>Do not store hazardous substances, including fuels, in or near site facilities such as toilets, lunchrooms or site offices.</li>
                <li>Hazardous substances must be stored in secure facilities.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hot Work, Welding & Cutting Equipment</h3>
              <p className="mb-3">Welding and/or cutting equipment must only be operated by suitably experienced persons. The following points shall be complied with at all times:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Suitable PPE shall be worn when using welding or cutting equipment.</li>
                <li>Make sure fire extinguishers are located in the immediate vicinity of any work that may create a fire risk such as grinding, welding, and thermal or oxygen cutting or heating, and other related heat-producing or spark-producing operations.</li>
                <li>Know your type of fire extinguisher, how it is to be used and what it can be used on.</li>
                <li>All gas cylinders must be located in a ventilated area, upright, secured and transported on purpose-built trolleys.</li>
                <li>Flashback arrestors must be fitted to each end of the hoses when using pressurised oxygen with a fuel gas. When using atmospheric air with a fuel gas, an arrester need only be fitted to the handpiece.</li>
                <li>Flashback arrestors should be inspected weekly, tested every year, and replaced every five years.</li>
                <li>Ensure that any potentially flammable materials in the area will not be ignited by the welding or cutting process.</li>
                <li>All ancillary equipment must be in good working order.</li>
                <li>Screens shall be used, or other controls put in place, to protect other workers/people from ultraviolet radiation produced by some process such as arc welding.</li>
                <li>The Site Manager will advise you if a Hot Work Permit system is in operation on the site.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Housekeeping</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Keep work areas and access-ways clean and tidy (all unnecessary items, loose/unstable materials and waste safely removed from the area).</li>
                <li>Waste is to be placed in the appropriate waste bins or waste storage area.</li>
                <li>Where provided for, recyclable waste is to be separate and placed in bins provided.</li>
                <li>All workers are required to leave their work area in a safe and tidy state at the end of each shift/day.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Incident Management</h3>
              <p className="mb-2">All incidents and near miss incidents (and hazards that cannot be removed or rectified immediately) must be reported to the Bayside Builders WA Site Manager.</p>
              <p className="mb-2">Key requirements within this process include:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Formal statutory notification(s).</li>
                <li>An Incident Form is also to be completed.</li>
                <li>Incidents and accidents will be investigated for causal factors and control measures to be implemented where applicable to prevent a recurrence.</li>
              </ul>
            </div>
          </div>
        </DocumentPage>

        {/* Page 15: Pre-start Hazard Assessment & Training */}
        <DocumentPage title="Safety Equipment & Procedures" pageNumber={15} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ladders</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>Only light duty tasks of short duration are to be performed from a ladder.</li>
                <li>Only commercial grade ladders with the compliance sticker to be intact are to be used on site (no domestic rated ladders).</li>
                <li>Ladders are to be set up on an angle of 1 metre out at the base to every 4 metres up, be placed on firm level ground and secured to prevent movement.</li>
                <li>Ladders must be maintained in a serviceable condition.</li>
                <li>Ladders must extend at least 900mm above the landing.</li>
                <li>Step ladders are to be used in accordance with the manufacturer&apos;s guidelines.</li>
                <li>3 points of contact must be maintained when climbing up or down a ladder.</li>
                <li>Extension ladders must not be used to provide access to scaffold.</li>
                <li>Ladders must be suitable for the task (i.e. non-conductive ladders used for electrical work).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Licences</h3>
              <p>All personnel are to be trained in the plant and equipment being used. This includes holding certificates and licenses as required.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Manual Handling</h3>
              <p className="mb-2">There are no specific limitations on the weight that a single individual is permitted to lift as this can vary from one person to another. There are many factors that must be considered including but not limited to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs mb-3">
                <li>The weight of the load.</li>
                <li>The physical dimensions of the load.</li>
                <li>Does the load have any sharp edges.</li>
                <li>Is the load likely to be caught by the wind.</li>
                <li>Does the load have handles/lifting points.</li>
              </ul>

              <p className="mb-2">If you believe that you cannot safely lift the load, then you must seek advice from your supervisor.</p>
              
              <p className="mb-2 font-medium">Use correct lifting techniques:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-xs mb-3">
                <li>Determine the weight of the load.</li>
                <li>Ensure the path you intend to travel is clear and free of obstacles and trip hazards.</li>
                <li>Ensure the area where you intend to place the load is clear and safe.</li>
                <li>Face the direction you intend to travel (avoid twisting and turning when carrying heavier loads).</li>
                <li>Bend your knees and keep your back straight.</li>
                <li>Get a good hold/grip on the load.</li>
                <li>Lift with your legs.</li>
                <li>Place the load by bending your knees; DO NOT bend your back.</li>
              </ul>

              <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                <li>With heavy or awkward loads, get help or use mechanical assistance such as a forklift.</li>
                <li>If it is too heavy, don&apos;t lift it!</li>
              </ul>
            </div>
          </div>
        </DocumentPage>

        {/* Page 16: Mobile Phones, Nail Guns, Penetrations, PPE */}
        <DocumentPage title="Mobile Phones, Nail Guns, Penetrations & PPE" pageNumber={16} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Mobile Phones & Devices</h3>
              <p className="mb-3">
                There are many hazards associated with using mobile devices on a worksite. It can distract users from the hazards associated with their work tasks and their surroundings, and it can distract other workers in the area.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The use of mobile phones or devices is not permitted while operating any mobile plant or equipment, or while performing activities that require your full attention.</li>
                <li>The use of mobile phones or devices is not permitted while attending safety meetings or while receiving safety-related information such as a safety talk.</li>
                <li>Managers should make every reasonable effort to avoid using their mobile phones or devices or making calls while directing activities on the worksite.</li>
                <li>If an urgent family matter requires a worker to use their mobile phones or device, the worker must leave the work area, so that the communication can be done in a safe manner.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Nail Guns & Explosive Powered Tools</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Where nail guns or explosive powered tools are being used safety signage such as &apos;Warning – Nail Gun in Use&apos;, shall be erected at ALL access points to the area, not just on the back of the vehicle.</li>
                <li>All appropriate PPE, such as hearing protection, shall be used at all times.</li>
                <li>Tools shall not be left unattended while still active.</li>
                <li>Tools are to be maintained in a serviceable condition at all times.</li>
                <li>Explosive charges shall be secured in a locked box as required by State Legislation.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Penetrations</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Penetrations greater than 200mm x 200mm but less than 2m x 2m in timber suspended floors will be securely covered and warning signage displayed.</li>
                <li>For concrete suspended floors with penetrations greater than 200mm x 200mm, but less than 2m x 2m, steel mesh will be embedded in the concrete, in addition to secure covers and signage.</li>
                <li>Penetrations of 2m x 2m, or more, in both timber and concrete suspended floors will be barricaded.</li>
                <li>Penetrations in ground floors will be covered or barricaded.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Personal Protective Equipment (PPE) & Clothing</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Safety footwear that complies with Australian Standards is required to be worn on all Bayside Builders WA sites.</li>
                <li>The minimum general clothing requirements are shorts and high visibility short sleeve tops/shirts. More substantial clothing may be required in some circumstances such as when working with hazardous chemicals.</li>
                <li>The PPE requirements of the MSDS/SDS shall be complied with when working with, or in proximity to, any hazardous substances or chemicals.</li>
              </ul>
              
              <p className="mt-3 mb-2 font-medium">Other common types of PPE that may be required include:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Hearing protection:</strong> if noise levels above 85 dB cannot be eliminated or reduced by other means, then approved hearing protection shall be used such as ear plugs or earmuffs. As a rule of thumb, if you have to raise your voice to be heard by a person standing 1 metre away from you then noise levels are above the accepted safe standard.</li>
                <li><strong>Safety glasses:</strong> all persons on site are required to wear approved safety glasses/goggles/face shields where safety signage indicates such a requirement. In all other cases persons exposed to airborne particles, chemicals or ultraviolet radiation from welding processes must wear suitable approved eye protection.</li>
                <li><strong>Gloves:</strong> are essential PPE when performing certain work activities such as welding, handling loads with sharp edges, hot loads and where a MSDS/SDS recommends hand protection when using a hazardous substance.</li>
                <li><strong>Safety helmets:</strong> must be worn at all times where indicated at site entry points. As per Western Australian WHS legislation a safety helmet must be worn where there is any risk of being struck on the head by a falling object; or hitting the head against an object.</li>
                <li><strong>High visibility clothing:</strong> if not identified as a minimum site requirement, all involved in the operation of cranes and other lifting equipment on site are required to wear a high visibility vest.</li>
                <li><strong>Respiratory devices:</strong> where required by the MSDS/SDS suitable respiratory protection such as dust and/or vapour masks must be worn when using or working in the vicinity of hazardous substances.</li>
                <li><strong>Sunscreen:</strong> should be used to reduce the risk of sunburn and potentially skin cancer.</li>
              </ul>
            </div>
          </div>
        </DocumentPage>

        {/* Page 17: Plant, Public Safety, RCDs, Scaffolds */}
        <DocumentPage title="Plant, Public Safety, RCDs & Scaffolds" pageNumber={17} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Plant</h3>
              <p className="mb-3">
                The term plant includes, but is not limited to, cranes, hoists, elevating work platforms, building maintenance units such as swing stages or suspended stages, pressure equipment and explosive powered tools such as nail guns.
              </p>
              <p className="mb-3">
                In addition to relevant WA Legislative requirements and/or Codes of Practice, the use of any plant on site shall meet the following requirements:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Subcontractors using mobile plant (e.g. mobile cranes, excavators, forklifts, elevated work platforms, etc.) are required to provide Bayside Builders WA with a SWMS/JSA prior to the commencement of works.</li>
                <li>Plant registration details, where required, shall be readily available and plant registration numbers clearly displayed.</li>
                <li>All mobile plant shall be maintained to the manufacturer&apos;s specifications and operator&apos;s log books are to be kept up-to-date. The logbook should be readily available upon request by Bayside Builders WA.</li>
                <li>Mobile plant requiring operator&apos;s licenses are only to be operated by appropriately licensed persons. It is the responsibility of the contractors to use appropriately licensed persons.</li>
                <li>Where no formal license is required to operate a specific piece of plant, operators must be able to demonstrate competence in operating that plant.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Public Safety</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Bayside Builders WA will ensure that clearly displayed signs are erected on the boundary describing the site as being a construction site.</li>
                <li>A spotter will guide vehicles or equipment reversing onto or off the site, so that workers aren&apos;t driving blindly into areas where there may be pedestrians and other vehicles.</li>
              </ul>
              <p className="mt-3 mb-2 font-medium">When a site is left unattended:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>If a perimeter site fence is in use, the last worker to leave the site must ensure that access points to the site are to be secured,</li>
                <li>If no perimeter site fence is in use, then it is the personnel or Subcontractor&apos;s responsibility to secure or remove any hazards associated with their work prior to leaving the site. For example:
                  <ul className="list-disc list-inside space-y-1 ml-6 mt-1">
                    <li>Do not leave large drums containing water unless they have a secure lid.</li>
                    <li>Barriers or fencing erected along potential fall hazards and/or retaining walls.</li>
                    <li>Access to scaffolds is restricted (remove ladder).</li>
                  </ul>
                </li>
              </ul>
              <p className="mt-3">Extra care is required in established residential areas and/or near schools or playgrounds.</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Residual Current Devices (RCDs or &apos;Safety Switches&apos;)</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Contractors using portable electrical equipment on Bayside Builders WA worksites must do so in conjunction with a portable Residual Current Device (RCD), tested and tagged in accordance with Western Australian legislation.</li>
                <li>Domestic RCD&apos;s are not permitted on Bayside Builders WA sites.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Scaffolds</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All scaffolding is to be erected using safe manual handling and construction practices in accordance with the manufacturers or supplier&apos;s guidelines.</li>
                <li>All erected scaffolding is to be compliant with the manufacturer&apos;s guidelines, Australian Standards or the Western Australian Code of Practice AS/NZS4576:1995 – Guidelines for scaffolding.</li>
                <li>All scaffolds where a person could fall more than 2 metres MUST be provided with edge protection.</li>
              </ul>
              <p className="mt-3 mb-2 font-medium">Scaffolds where a person can fall more than 4 metres:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>MUST be erected, altered and dismantled by a licensed scaffolder.</li>
                <li>MUST be inspected and tagged prior to use and at least every 30 days.</li>
              </ul>
              <p className="mt-3">Incomplete or unsafe scaffolds MUST be tagged, sign posted or barricaded to prevent unauthorised access.</p>
            </div>
          </div>
        </DocumentPage>

        {/* Page 18: Site Safety Signs, Security, Traffic, UV, Visitors */}
        <DocumentPage title="Site Safety Signs, Security, Traffic & Visitors" pageNumber={18} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Site Safety Signs</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Site safety signs are to be complied with at all times,</li>
                <li>Site safety signs are NOT to be obstructed by vehicles or by any other means.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Site Security</h3>
              <p className="mb-3">
                A site-specific risk assessment in relation to site security should be conducted to identify any hazards and appropriate control measures are in place. Site Supervisors/Managers are responsible for ensuring that at a minimum the site is securely fenced. Appropriate signage is erected with contact telephone numbers and the site is locked at the end of each day. Personnel and Subcontractors prior to leaving the site should ensure that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Electrical power is off.</li>
                <li>Access to elevated floors, scaffolding and ladders is blocked.</li>
                <li>Plant, equipment, tools, chemicals and dangerous goods are securely stored.</li>
                <li>Water drums are emptied.</li>
                <li>Excavation areas such as pits, trenches and pier holes are covered.</li>
                <li>Plant or machinery is secure and cannot be operated illegally.</li>
                <li>Objects that could become dangerous in strong winds are secured, including incomplete or inadequately braced walls that might collapse.</li>
                <li>Other hazards that may cause injury have been controlled.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Subcontractor Equipment</h3>
              <p>
                Subcontractors are responsible for security arrangements in relation to their plant, tools, equipment and materials required on site during the works.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Traffic Management</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>General Western Australian road rules are applicable on all Bayside Builders WA sites, unless otherwise advised by the Site Manager,</li>
                <li>Contact the Site Manager to determine unloading and storage requirements,</li>
                <li>When unloading a vehicle on a public road, traffic cones and/or warning signs shall be positioned to warn the public. Where such activity occurs repeatedly and/or over an extended period of time, a specific Road/Traffic Management Plan and appropriate permits may be required,</li>
                <li>Make sure properly trained spotters control reversing vehicles before unloading,</li>
                <li>Vehicles must be properly maintained, and drivers properly trained,</li>
                <li>Depending on the situation, the Site Manager may arrange to have a Traffic Management Company to control the road traffic.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">UV Protection</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Bayside Builders WA encourage all persons on site to wear adequate clothing (e.g. hats) and other protective methods (e.g. sunscreen) to protect themselves from the effects of working while exposed to UV rays.</li>
                <li>Very hot and extreme heat conditions can lead to heat related health problems. Types of heat related illnesses include, but is not limited to, heat cramps, heat exhaustion, heat stroke and heat fainting.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Visitors</h3>
              <p>
                Site personnel shall NOT bring any person onto site unless the Site Manager has been notified and approval given.
              </p>
            </div>
          </div>
        </DocumentPage>

        {/* Page 19: Working Alone & Working at Height */}
        <DocumentPage title="Working Alone & Working at Height" pageNumber={19} totalPages={totalPages} addSpacing={true}>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Working Alone</h3>
              <p className="mb-3">
                Working by yourself is a unique hazard that must be controlled. The following guidelines will help to reduce the risks associated with working alone:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Always ensure that someone knows where you will be working. This can be achieved by having a copy of your work schedule at home or with your partner/family.</li>
                <li>If you are not scheduled to be on site and there are no other workers on site then you must advise the Site Manager.</li>
                <li>Do NOT perform any work activities which could incapacitate you to the point of not being able to seek assistance.</li>
                <li>Do NOT under any circumstances work at height where you are exposed to a fall risk or you are required to use fall arrest equipment, such as a safety harness.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Working At Height</h3>
              <p className="mb-3">
                The WA Code of Practice &apos;Prevention of Falls at Work Places&apos; should be observed when working at height. The following guidelines shall be complied with at all times:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Safe access must be provided to all elevated work areas.</li>
                <li>Where a person could fall 2 or more metres from a; scaffold, stairs, landings, formwork, false-work, suspended slabs or mezzanine floors, edge protection MUST be provided. Edge protection includes a top rail, mid-rail and kickboard or mesh panel.</li>
                <li>Where persons could fall more than 3 metres from any other open edge (eg, roof), a risk assessment shall be conducted and suitable control measures put in place.</li>
              </ul>
              
              <p className="mt-4 mb-3 font-medium">
                Where a fall injury prevention systems (FIPS) or restraint systems (eg, harnesses, lanyards, fall arrestors, rope grabs, restraint devices, catch platforms) are to be used then the following requirements apply:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All persons required to use the fall injury prevention system shall be trained in the use of the system.</li>
                <li>An emergency rescue plan shall be put in place. This plan shall include what action is to be taken and how a person will be rescued in the event of a fall.</li>
                <li>Workers shall not be required to work alone.</li>
              </ul>
            </div>
          </div>
        </DocumentPage>

        {/* Page 20: Note to Contractors & End of Document */}
        <DocumentPage title="Note to Contractors" pageNumber={20} totalPages={totalPages}>
          <div className="flex flex-col justify-between min-h-[1000px] text-sm leading-relaxed">
            {/* TOP SECTION */}
            <div className="text-center space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-8">NOTE TO CONTRACTORS</h2>
              
              <p>
                The Bayside Builders WA Site Manager or a Bayside Builders WA WHS Representative who observes an unsafe practice has the right to direct a Subcontractor to cease work until the safety concern is addressed to the satisfaction of the Bayside Builders WA Site Manager or a Bayside Builders WA WHS Representative.
              </p>
              
              <p>
                Bayside Builders WA will take into consideration compliance with safe work practices when selecting Subcontractors for future work.
              </p>
            </div>
            
            {/* MIDDLE SECTION - Centered WHS compliance text */}
            <div className="flex flex-col justify-center items-center">
              <p className="text-center font-bold text-base px-8">
                IN ALL OTHER INSTANCES COMPLY WITH THE WORK HEALTH & SAFETY ACT (2020) & WORK HEALTH & SAFETY (GENERAL) REGULATIONS (2022).
              </p>
            </div>
            
            {/* BOTTOM SECTION */}
            <div className="text-center space-y-4">
              <p className="font-medium">
                Bayside Builders WA Induction Booklet (Updated Oct 2022)
              </p>
              <p className="text-lg font-bold">
                END OF DOCUMENT
              </p>
            </div>
          </div>
        </DocumentPage>
      </div>
    </div>
  )
}
