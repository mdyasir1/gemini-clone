"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth-store"
import type { Country } from "@/types"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { Phone, ChevronDown } from "lucide-react"

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
})

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
})

type PhoneFormData = z.infer<typeof phoneSchema>
type OTPFormData = z.infer<typeof otpSchema>

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setLoading, user } = useAuthStore()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [showCountries, setShowCountries] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: "",
      phone: "",
    },
  })

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    if (user?.isAuthenticated) {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag")
      const data: Country[] = await response.json()
      const sortedCountries = data
        .filter((country) => country.idd?.root && country.idd?.suffixes)
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
      setCountries(sortedCountries)
    } catch (error) {
      console.error("Failed to fetch countries:", error)
      toast.error("Failed to load countries")
    }
  }

  const onPhoneSubmit = async (data: PhoneFormData) => {
    setLoading(true)
    setPhoneNumber(data.phone)

    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true)
      setStep("otp")
      setLoading(false)
      toast.success("OTP sent successfully!")
    }, 1500)
  }

  const onOTPSubmit = async (data: OTPFormData) => {
    setLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      if (data.otp === "123456") {
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          phone: phoneNumber,
          countryCode: selectedCountry?.idd.root + selectedCountry?.idd.suffixes[0] || "",
          isAuthenticated: true,
        }
        setUser(newUser)
        toast.success("Login successful!")
        router.push("/dashboard")
      } else {
        toast.error("Invalid OTP. Try 123456")
      }
      setLoading(false)
    }, 1000)
  }

  const selectCountry = (country: Country) => {
    setSelectedCountry(country)
    const dialCode = country.idd.root + (country.idd.suffixes[0] || "")
    phoneForm.setValue("countryCode", dialCode)
    setShowCountries(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            Gemini Chat
          </CardTitle>
          <p className="text-muted-foreground">
            {step === "phone" ? "Enter your phone number" : "Enter verification code"}
          </p>
        </CardHeader>

        <CardContent>
          {step === "phone" ? (
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountries(!showCountries)}
                    className="w-full flex items-center justify-between p-3 border rounded-md bg-background hover:bg-accent"
                  >
                    <span className="flex items-center gap-2">
                      {selectedCountry ? (
                        <>
                          <span className="text-lg">{selectedCountry.flag}</span>
                          <span>{selectedCountry.name.common}</span>
                          <span className="text-muted-foreground">
                            ({selectedCountry.idd.root}
                            {selectedCountry.idd.suffixes[0]})
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Select country</span>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showCountries && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.cca2}
                          type="button"
                          onClick={() => selectCountry(country)}
                          className="w-full flex items-center gap-2 p-3 hover:bg-accent text-left"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="flex-1">{country.name.common}</span>
                          <span className="text-muted-foreground text-sm">
                            {country.idd.root}
                            {country.idd.suffixes[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {phoneForm.formState.errors.countryCode && (
                  <p className="text-sm text-destructive">{phoneForm.formState.errors.countryCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  {...phoneForm.register("phone")}
                  type="tel"
                  placeholder="Enter phone number"
                  className="text-lg"
                />
                {phoneForm.formState.errors.phone && (
                  <p className="text-sm text-destructive">{phoneForm.formState.errors.phone.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!selectedCountry}>
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                We sent a verification code to
                <br />
                <span className="font-medium">
                  {selectedCountry?.idd.root}
                  {selectedCountry?.idd.suffixes[0]} {phoneNumber}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Verification Code</label>
                <Input
                  {...otpForm.register("otp")}
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-sm text-destructive">{otpForm.formState.errors.otp.message}</p>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Use <code className="bg-muted px-1 rounded">123456</code> as OTP for demo
              </div>

              <Button type="submit" className="w-full">
                Verify & Login
              </Button>

              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                Back to phone number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
