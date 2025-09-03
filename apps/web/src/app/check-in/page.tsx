"use client"

import * as React from "react"
import CheckInForm from './CheckInForm'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"

export default function CheckInPage() {
  const [isWorker, setIsWorker] = React.useState(true)

  return (
    <div className="bg-gray-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Site Check-in</CardTitle>
            <CardDescription>
              Enter your email and share your location to check in to the nearest active job site.
            </CardDescription>
            
            {/* Visitor/Worker Toggle */}
            <div className="flex items-center space-x-2 pt-4">
              <Label htmlFor="user-type">Visitor</Label>
              <Switch
                id="user-type"
                checked={isWorker}
                onCheckedChange={setIsWorker}
              />
              <Label htmlFor="user-type">Worker</Label>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    {isWorker 
                      ? "You must have completed worker induction and have a valid white card to check in."
                      : "All visitors must be accompanied by an authorized site supervisor."
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <CheckInForm />
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Having trouble? Contact your site supervisor for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}