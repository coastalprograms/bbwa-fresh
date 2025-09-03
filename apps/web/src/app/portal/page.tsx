import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ClipboardCheckIcon, QrCodeIcon } from "lucide-react"
import Link from "next/link"

export default function InductionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Worker Induction Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ClipboardCheckIcon className="h-5 w-5" />
                Worker Induction
              </CardTitle>
              <CardDescription>
                Complete your safety induction and site orientation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                All workers must complete the safety induction before accessing the site.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/induction/worker">
                  Complete the Induction
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Site Check-In Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <QrCodeIcon className="h-5 w-5" />
                Site Check-In
              </CardTitle>
              <CardDescription>
                Quick and easy site access for authorized workers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Scan the QR code on site or check in here to access the work area.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/check-in">
                  Check In to Site
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}